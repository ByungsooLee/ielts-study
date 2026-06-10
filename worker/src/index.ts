import type { Env } from "./env";
import {
  ERROR_CODES,
  HttpError,
  corsHeaders,
  errorJson,
  handleOptions,
  json,
  readJson,
  requireAuth,
  type Cors,
} from "./http";
import {
  DEFAULT_USER_ID,
  LEGACY_CONTENT_KEY,
  LEGACY_PROGRESS_KEY,
  contentLegacyKey,
  progressKey,
} from "./keys";
import {
  MAX_TTS_CACHE_BYTES,
  TTS_CACHE_TTL_SECONDS,
  shouldCache,
  ttsHash,
} from "./ttsCache";
import { ttsCacheKey } from "./keys";
import {
  addTtsUsage,
  buildTtsUsageStatus,
  countChars,
  getTtsUsage,
  resolveMonthlyLimit,
  ttsUsageHeaders,
  wouldExceedLimit,
} from "./ttsUsage";

const VOICE_MAP: Record<string, { languageCode: string; name: string }> = {
  "en-GB": { languageCode: "en-GB", name: "en-GB-Neural2-A" },
  "en-US": { languageCode: "en-US", name: "en-US-Neural2-D" },
  "en-AU": { languageCode: "en-AU", name: "en-AU-Neural2-B" },
};

const ALLOWED_AUDIO_ENCODINGS = new Set(["MP3", "OGG_OPUS", "LINEAR16"]);

/** 公開情報のみ。秘密情報（SYNC_TOKEN）は絶対に返さない。 */
function bootstrapInfo(env: Env) {
  return {
    apiVersion: "v1",
    authMode: "manual-token" as const,
    requiresToken: true,
    features: {
      progressSync: true,
      tts: Boolean(env.GOOGLE_TTS_KEY),
      legacyContentKv: true,
    },
  };
}

async function handleContent(request: Request, env: Env, cors: Cors): Promise<Response> {
  if (request.method === "GET") {
    const raw = (await env.IELTS_KV.get(contentLegacyKey())) ?? (await env.IELTS_KV.get(LEGACY_CONTENT_KEY));
    if (!raw) return json({ records: [], updatedAt: 0 }, 200, cors);
    return json(JSON.parse(raw), 200, cors);
  }
  if (request.method === "PUT") {
    // 妥当な JSON のみ受理（不正は readJson が 400）。content はレガシー扱い。
    const body = await readJson<unknown>(request);
    await env.IELTS_KV.put(contentLegacyKey(), JSON.stringify(body));
    return json({ ok: true }, 200, cors);
  }
  throw new HttpError(ERROR_CODES.METHOD_NOT_ALLOWED, "Method Not Allowed", 405);
}

async function handleProgress(request: Request, env: Env, cors: Cors): Promise<Response> {
  if (request.method === "GET") {
    const raw =
      (await env.IELTS_KV.get(progressKey(DEFAULT_USER_ID))) ??
      (await env.IELTS_KV.get(LEGACY_PROGRESS_KEY));
    if (!raw) return json({}, 200, cors);
    return json(JSON.parse(raw), 200, cors);
  }
  if (request.method === "PUT") {
    const body = await readJson<Record<string, unknown>>(request);
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new HttpError(ERROR_CODES.BAD_REQUEST, "progress はオブジェクトである必要があります", 400);
    }
    await env.IELTS_KV.put(progressKey(DEFAULT_USER_ID), JSON.stringify(body));
    return json({ ok: true }, 200, cors);
  }
  throw new HttpError(ERROR_CODES.METHOD_NOT_ALLOWED, "Method Not Allowed", 405);
}

async function handleTtsUsage(env: Env, cors: Cors): Promise<Response> {
  const limit = resolveMonthlyLimit(env.TTS_MONTHLY_LIMIT);
  const usage = await getTtsUsage(env.IELTS_KV);
  return json(buildTtsUsageStatus(usage, limit), 200, cors);
}

async function handleTts(request: Request, env: Env, cors: Cors): Promise<Response> {
  const body = await readJson<{
    text?: string;
    voice?: string;
    speakingRate?: number;
    audioEncoding?: string;
  }>(request);

  const text = body.text?.trim();
  if (!text) {
    throw new HttpError(ERROR_CODES.BAD_REQUEST, "text is required", 400);
  }

  const voiceKey = body.voice ?? "en-GB";
  const voice = VOICE_MAP[voiceKey] ?? VOICE_MAP["en-GB"];
  const speakingRate =
    typeof body.speakingRate === "number" && body.speakingRate >= 0.25 && body.speakingRate <= 4
      ? body.speakingRate
      : 1;
  const audioEncoding =
    body.audioEncoding && ALLOWED_AUDIO_ENCODINGS.has(body.audioEncoding) ? body.audioEncoding : "MP3";
  const contentType = audioEncoding === "MP3" ? "audio/mpeg" : "application/octet-stream";

  const hash = await ttsHash({
    text,
    languageCode: voice.languageCode,
    voiceName: voice.name,
    speakingRate,
    audioEncoding,
  });
  const cacheKey = ttsCacheKey(hash);
  const limit = resolveMonthlyLimit(env.TTS_MONTHLY_LIMIT);

  // 1) キャッシュヒット: 再生成しない・使用量は加算しない（合言葉さえ合えばキー無しでも返せる）
  const cached = await env.IELTS_KV.get(cacheKey, "arrayBuffer");
  if (cached) {
    const usage = await getTtsUsage(env.IELTS_KV);
    const status = buildTtsUsageStatus(usage, limit);
    return new Response(cached, {
      headers: { "Content-Type": contentType, ...cors, ...ttsUsageHeaders(status), "X-TTS-Cache": "hit" },
    });
  }

  // 2) 生成にはキーが必要
  if (!env.GOOGLE_TTS_KEY) {
    throw new HttpError(
      ERROR_CODES.TTS_NOT_CONFIGURED,
      "GOOGLE_TTS_KEY が Worker に設定されていません。wrangler secret put GOOGLE_TTS_KEY を実行してください。",
      503,
    );
  }

  // 3) 月次上限チェック（超えるなら 429）
  const charCount = countChars(text);
  const beforeUsage = await getTtsUsage(env.IELTS_KV);
  if (wouldExceedLimit(beforeUsage.charsUsed, charCount, limit)) {
    const status = buildTtsUsageStatus(beforeUsage, limit);
    return errorJson(
      ERROR_CODES.RATE_LIMITED,
      `今月の TTS 上限（${limit.toLocaleString()} 文字）を超えるため生成を停止しました。キャッシュ済みの音声は引き続き再生できます。`,
      429,
      cors,
      status,
      ttsUsageHeaders(status),
    );
  }

  // 4) Google TTS 呼び出し
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.GOOGLE_TTS_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: voice.languageCode, name: voice.name },
        audioConfig: { audioEncoding, speakingRate },
      }),
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    console.error("Google TTS error", res.status, detail);
    throw new HttpError(ERROR_CODES.UPSTREAM_ERROR, "TTS の生成に失敗しました", 502);
  }

  const data = (await res.json()) as { audioContent?: string };
  if (!data.audioContent) {
    console.error("Google TTS returned no audioContent");
    throw new HttpError(ERROR_CODES.UPSTREAM_ERROR, "音声が返されませんでした", 502);
  }

  const binary = Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0));

  // 使用量を加算（生成時のみ）
  const updatedUsage = await addTtsUsage(env.IELTS_KV, charCount);
  const status = buildTtsUsageStatus(updatedUsage, limit);

  // サイズが小さければキャッシュ（容量暴発防止のため上限超は保存しない）
  if (shouldCache(binary.byteLength)) {
    try {
      await env.IELTS_KV.put(cacheKey, binary, { expirationTtl: TTS_CACHE_TTL_SECONDS });
    } catch (e) {
      console.error("TTS cache put failed", e);
    }
  }

  return new Response(binary, {
    headers: {
      "Content-Type": contentType,
      ...cors,
      ...ttsUsageHeaders(status),
      "X-TTS-Cache": binary.byteLength <= MAX_TTS_CACHE_BYTES ? "miss" : "skip",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") return handleOptions(cors);

    try {
      const url = new URL(request.url);

      // 公開エンドポイント（認証不要・秘密情報なし）
      if (url.pathname === "/app-bootstrap" && request.method === "GET") {
        return json(bootstrapInfo(env), 200, cors);
      }

      // 以降は Bearer 認証必須
      if (!requireAuth(request, env)) {
        return errorJson(ERROR_CODES.UNAUTHORIZED, "Unauthorized", 401, cors);
      }

      if (url.pathname === "/content") return await handleContent(request, env, cors);
      if (url.pathname === "/progress") return await handleProgress(request, env, cors);
      if (url.pathname === "/tts-usage" && request.method === "GET") {
        return await handleTtsUsage(env, cors);
      }
      if (url.pathname === "/tts" && request.method === "POST") {
        return await handleTts(request, env, cors);
      }

      return errorJson(ERROR_CODES.NOT_FOUND, "Not Found", 404, cors);
    } catch (e) {
      if (e instanceof HttpError) {
        return errorJson(e.code, e.message, e.status, cors, e.details);
      }
      // 例外をそのままレスポンスに出さない（ログには残す）
      console.error("Unhandled worker error", e);
      return errorJson(ERROR_CODES.INTERNAL, "Internal Server Error", 500, cors);
    }
  },
};
