export interface Env {
  IELTS_KV: KVNamespace;
  SYNC_TOKEN: string;
  GOOGLE_TTS_KEY: string;
  GEMINI_KEY: string;
  ALLOWED_ORIGIN?: string;
}

const VOICE_MAP: Record<string, { languageCode: string; name: string }> = {
  "en-GB": { languageCode: "en-GB", name: "en-GB-Neural2-A" },
  "en-US": { languageCode: "en-US", name: "en-US-Neural2-D" },
  "en-AU": { languageCode: "en-AU", name: "en-AU-Neural2-B" },
};

function isLocalDevOrigin(origin: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function getAllowedOrigins(env: Env): string[] {
  const raw = env.ALLOWED_ORIGIN || "*";
  if (raw === "*") return ["*"];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function resolveAllowOrigin(origin: string | null, env: Env): string {
  const allowedList = getAllowedOrigins(env);
  if (allowedList.includes("*")) return origin ?? "*";
  if (!origin) return allowedList[0] ?? "*";
  if (allowedList.includes(origin)) return origin;
  // localhost と 127.0.0.1 のポート違いも許可（Vite 開発用）
  if (isLocalDevOrigin(origin) && allowedList.some(isLocalDevOrigin)) return origin;
  return allowedList[0];
}

function corsHeaders(origin: string | null, env: Env): HeadersInit {
  return {
    "Access-Control-Allow-Origin": resolveAllowOrigin(origin, env),
    "Access-Control-Allow-Methods": "GET,PUT,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };
}

function unauthorized(origin: string | null, env: Env) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin, env) },
  });
}

function json(data: unknown, origin: string | null, env: Env, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin, env) },
  });
}

function isAuthorized(request: Request, env: Env): boolean {
  const header = request.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token.length > 0 && token === env.SYNC_TOKEN;
}

async function handleProgress(request: Request, env: Env, origin: string | null) {
  if (request.method === "GET") {
    const raw = await env.IELTS_KV.get("progress");
    if (!raw) return json({}, origin, env);
    return new Response(raw, {
      headers: { "Content-Type": "application/json", ...corsHeaders(origin, env) },
    });
  }
  if (request.method === "PUT") {
    const body = await request.text();
    await env.IELTS_KV.put("progress", body);
    return json({ ok: true }, origin, env);
  }
  return json({ error: "Method not allowed" }, origin, env, 405);
}

async function handleTts(request: Request, env: Env, origin: string | null) {
  const body = (await request.json()) as { text?: string; voice?: string };
  const text = body.text?.trim();
  const voiceKey = body.voice ?? "en-GB";
  const voice = VOICE_MAP[voiceKey] ?? VOICE_MAP["en-GB"];

  if (!text) return json({ error: "text is required" }, origin, env, 400);

  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.GOOGLE_TTS_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: voice.languageCode, name: voice.name },
        audioConfig: { audioEncoding: "MP3" },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    return json({ error: "TTS failed", detail: err }, origin, env, 502);
  }

  const data = (await res.json()) as { audioContent?: string };
  if (!data.audioContent) return json({ error: "No audio returned" }, origin, env, 502);

  const binary = Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0));
  return new Response(binary, {
    headers: {
      "Content-Type": "audio/mpeg",
      ...corsHeaders(origin, env),
    },
  });
}

async function handleFeedback(request: Request, env: Env, origin: string | null) {
  const body = (await request.json()) as {
    sentence?: string;
    grammar?: string;
    word?: string;
  };

  if (!body.sentence?.trim()) {
    return json({ error: "sentence is required" }, origin, env, 400);
  }

  const prompt = [
    "次の英文をIELTS学習者向けに添削してください。",
    "文法と自然さを直し、日本語で短くコメントしてください。",
    body.grammar ? `指定構文: ${body.grammar}` : "",
    body.word ? `対象単語: ${body.word}` : "",
    `英文: ${body.sentence}`,
    'JSONのみで返答: {"corrected":"...", "comment":"..."}',
  ]
    .filter(Boolean)
    .join("\n");

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    return json({ error: "Gemini failed", detail: err }, origin, env, 502);
  }

  const geminiData = (await geminiRes.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return json({ error: "No feedback returned" }, origin, env, 502);

  try {
    const parsed = JSON.parse(text) as { corrected?: string; comment?: string };
    return json(
      {
        corrected: parsed.corrected ?? body.sentence,
        comment: parsed.comment ?? "添削コメントを取得できませんでした。",
      },
      origin,
      env,
    );
  } catch {
    return json(
      {
        corrected: body.sentence,
        comment: text,
      },
      origin,
      env,
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin, env) });
    }

    if (!isAuthorized(request, env)) return unauthorized(origin, env);

    const url = new URL(request.url);
    if (url.pathname === "/progress") return handleProgress(request, env, origin);
    if (url.pathname === "/tts" && request.method === "POST") return handleTts(request, env, origin);
    if (url.pathname === "/feedback" && request.method === "POST") {
      return handleFeedback(request, env, origin);
    }

    return json({ error: "Not found" }, origin, env, 404);
  },
};
