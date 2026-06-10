import { getAudioCache, getDictCache, setAudioCache, setDictCache } from "../db";
import { playAudioBlob } from "./audioPlayer";
import { parseTtsUsageHeaders } from "./ttsUsage";
import { useTtsUsageStore } from "../stores/ttsUsageStore";
import type { Accent, PlaybackRate, StudyItem } from "../types";

const DICT_API = "https://api.dictionaryapi.dev/api/v2/entries/en";

export function audioCacheKey(text: string, voice: Accent): string {
  return `${voice}::${text.trim().toLowerCase()}`;
}

async function fetchDictionary(word: string) {
  const cached = await getDictCache(word);
  if (cached?.blob) return cached;

  if (cached?.audioUrl) {
    try {
      const audioRes = await fetch(cached.audioUrl);
      if (audioRes.ok) {
        const blob = await audioRes.blob();
        const result = { ...cached, blob, cachedAt: Date.now() };
        await setDictCache(result);
        return result;
      }
    } catch {
      // API へフォールバック
    }
  }

  const res = await fetch(`${DICT_API}/${encodeURIComponent(word)}`);
  if (!res.ok) throw new Error("辞書に見つかりません");
  const data = (await res.json()) as Array<{
    phonetic?: string;
    phonetics?: Array<{ text?: string; audio?: string }>;
  }>;
  const entry = data[0];
  const phonetic =
    entry?.phonetic ??
    entry?.phonetics?.find((p) => p.text)?.text ??
    entry?.phonetics?.[0]?.text;
  const audioUrl =
    entry?.phonetics?.find((p) => p.audio)?.audio ??
    entry?.phonetics?.[0]?.audio;

  let blob: Blob | undefined;
  if (audioUrl) {
    const audioRes = await fetch(audioUrl);
    if (audioRes.ok) blob = await audioRes.blob();
  }

  const result = {
    word: word.toLowerCase(),
    ipa: phonetic,
    audioUrl,
    blob,
    cachedAt: Date.now(),
  };
  await setDictCache(result);
  return result;
}

async function fetchTts(
  workerUrl: string,
  syncToken: string,
  text: string,
  voice: Accent,
): Promise<Blob> {
  const base = workerUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/tts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${syncToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, voice }),
  });
  if (!res.ok) {
    let detail = "";
    // 使用量はヘッダ（X-TTS-*）から優先的に取得（429 でも付与される）
    const headerUsage = parseTtsUsageHeaders(res.headers);
    if (headerUsage) useTtsUsageStore.getState().setUsage(headerUsage);
    try {
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("json")) {
        // 新形式: { error: { code, message, details } } / 旧形式: { error: string }
        const data = (await res.json()) as {
          error?: string | { code?: string; message?: string; details?: unknown };
          detail?: string;
        };
        if (typeof data.error === "string") {
          detail = data.error;
        } else if (data.error && typeof data.error === "object") {
          detail = data.error.message ?? "";
          const d = data.error.details as Partial<import("../types").TtsUsageStatus> | undefined;
          if (!headerUsage && d && d.monthlyLimit != null && d.charsUsed != null) {
            useTtsUsageStore.getState().setUsage({
              month: d.month ?? new Date().toISOString().slice(0, 7),
              charsUsed: d.charsUsed,
              monthlyLimit: d.monthlyLimit,
              warningThreshold: d.warningThreshold ?? Math.floor(d.monthlyLimit * 0.8),
              warning: d.warning ?? false,
              blocked: d.blocked ?? res.status === 429,
              percentUsed:
                d.percentUsed ?? Math.round((d.charsUsed / d.monthlyLimit) * 1000) / 10,
            });
          }
        } else {
          detail = data.detail ?? "";
        }
      } else {
        detail = await res.text();
      }
    } catch {
      // ignore parse errors
    }
    const hint =
      res.status === 401
        ? "（合言葉が Worker と一致しません。設定で再入力し、ターミナルで npm run secrets:push を実行してください）"
        : res.status === 429
          ? "（今月の無料枠上限）"
          : res.status === 503
            ? "（Google TTS API キーが Worker に未設定の可能性。npm run secrets:push を実行）"
            : res.status === 502
              ? "（Google Cloud TTS API の有効化・課金・APIキー制限を確認）"
              : "";
    throw new Error(`TTS失敗 (${res.status})${hint}${detail ? `: ${detail.slice(0, 120)}` : ""}`);
  }

  const usage = parseTtsUsageHeaders(res.headers);
  if (usage) useTtsUsageStore.getState().setUsage(usage);

  return res.blob();
}

export type PronunciationSource = "word" | "sentence";

function dictionaryLookup(item: StudyItem | undefined): string | undefined {
  if (!item) return undefined;
  if (item.pron?.lookup) return item.pron.lookup;
  if (item.type === "word" || item.type === "phrase") return item.front;
  return undefined;
}

export async function playPronunciation(options: {
  item?: StudyItem;
  text?: string;
  source?: PronunciationSource;
  accent: Accent;
  workerUrl: string;
  syncToken: string;
  playbackRate?: PlaybackRate;
}): Promise<void> {
  const { item, accent, workerUrl, syncToken, playbackRate = 1, source = "word" } = options;
  const text = (options.text ?? item?.pron?.tts ?? item?.front ?? "").trim();
  if (!text) throw new Error("再生するテキストがありません");

  if (source === "word") {
    const lookup = dictionaryLookup(item);
    if (lookup) {
      try {
        const dict = await fetchDictionary(lookup);
        if (dict.blob) {
          await playAudioBlob(dict.blob, playbackRate);
          return;
        }
      } catch {
        // TTS へフォールバック
      }
    }
  }

  const ttsText = source === "word" ? (dictionaryLookup(item) ?? text) : text;
  const cacheKey = audioCacheKey(ttsText, accent);
  const cached = await getAudioCache(cacheKey);
  if (cached) {
    await playAudioBlob(cached, playbackRate);
    return;
  }

  if (!workerUrl || !syncToken) {
    throw new Error(
      source === "sentence"
        ? "例文の再生には設定画面で Worker URL と合言葉を入力してください"
        : "辞書音声が見つかりません。設定画面で Worker URL と合言葉を入力すると TTS で再生できます",
    );
  }

  const blob = await fetchTts(workerUrl, syncToken, ttsText, accent);
  await setAudioCache(cacheKey, blob);
  await playAudioBlob(blob, playbackRate);
}
