import { getAudioCache, getDictCache, setAudioCache, setDictCache } from "../db";
import { parseTtsUsageHeaders } from "./ttsUsage";
import { useTtsUsageStore } from "../stores/ttsUsageStore";
import type { Accent, StudyItem } from "../types";

const DICT_API = "https://api.dictionaryapi.dev/api/v2/entries/en";

export function audioCacheKey(text: string, voice: Accent): string {
  return `${voice}::${text.trim().toLowerCase()}`;
}

async function playBlob(blob: Blob): Promise<void> {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  await new Promise<void>((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("音声再生に失敗しました"));
    };
    void audio.play().catch(reject);
  });
}

async function fetchDictionary(word: string) {
  const cached = await getDictCache(word);
  if (cached?.blob) return cached;

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
    try {
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("json")) {
        const data = (await res.json()) as {
          error?: string;
          detail?: string;
          charsUsed?: number;
          monthlyLimit?: number;
          warning?: boolean;
          blocked?: boolean;
          percentUsed?: number;
          month?: string;
          warningThreshold?: number;
        };
        detail = data.error ?? data.detail ?? "";
        if (data.monthlyLimit != null && data.charsUsed != null) {
          useTtsUsageStore.getState().setUsage({
            month: data.month ?? new Date().toISOString().slice(0, 7),
            charsUsed: data.charsUsed,
            monthlyLimit: data.monthlyLimit,
            warningThreshold: data.warningThreshold ?? Math.floor(data.monthlyLimit * 0.8),
            warning: data.warning ?? false,
            blocked: data.blocked ?? res.status === 429,
            percentUsed: data.percentUsed ?? Math.round((data.charsUsed / data.monthlyLimit) * 1000) / 10,
          });
        }
      } else {
        detail = await res.text();
      }
    } catch {
      // ignore parse errors
    }
    const hint =
      res.status === 429
        ? "（今月の無料枠上限）"
        : res.status === 503
          ? "（Google TTS API キーが Worker に未設定の可能性）"
          : res.status === 502
            ? "（Google Cloud TTS API の有効化・課金・APIキー制限を確認）"
            : "";
    throw new Error(`TTS失敗 (${res.status})${hint}${detail ? `: ${detail.slice(0, 120)}` : ""}`);
  }

  const usage = parseTtsUsageHeaders(res.headers);
  if (usage) useTtsUsageStore.getState().setUsage(usage);

  return res.blob();
}

export async function playPronunciation(options: {
  item?: StudyItem;
  text?: string;
  accent: Accent;
  workerUrl: string;
  syncToken: string;
}): Promise<void> {
  const { item, accent, workerUrl, syncToken } = options;
  const text = options.text ?? item?.pron?.tts ?? item?.front ?? "";
  const lookup = item?.pron?.lookup ?? (item?.type === "word" || item?.type === "phrase" ? item.front : undefined);

  if (lookup) {
    try {
      const dict = await fetchDictionary(lookup);
      if (dict.blob) {
        await playBlob(dict.blob);
        return;
      }
    } catch {
      // fallback to TTS
    }
  }

  const cacheKey = audioCacheKey(text, accent);
  const cached = await getAudioCache(cacheKey);
  if (cached) {
    await playBlob(cached);
    return;
  }

  if (!workerUrl || !syncToken) {
    throw new Error("TTSには Worker URL と合言葉の設定が必要です");
  }

  const blob = await fetchTts(workerUrl, syncToken, text, accent);
  await setAudioCache(cacheKey, blob);
  await playBlob(blob);
}
