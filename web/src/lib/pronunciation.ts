import { getAudioCache, getDictCache, setAudioCache, setDictCache } from "../db";
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
  if (!res.ok) throw new Error(`TTS失敗 (${res.status})`);
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
