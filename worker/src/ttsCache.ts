/** TTS 音声キャッシュのキー生成と保存ポリシー。 */

export interface TtsCacheParts {
  text: string;
  languageCode: string;
  voiceName: string;
  speakingRate: number;
  audioEncoding: string;
}

/** これより大きい音声は KV にキャッシュしない（KV 値サイズ・容量の暴発防止）。 */
export const MAX_TTS_CACHE_BYTES = 256 * 1024;

/** キャッシュ TTL（90日）。古い音声は自動失効させ容量を抑える。 */
export const TTS_CACHE_TTL_SECONDS = 60 * 60 * 24 * 90;

/**
 * text + languageCode + voiceName + speakingRate + audioEncoding から
 * 決定的な hash を生成（SHA-256 先頭32桁）。同一入力は必ず同一キー。
 */
export async function ttsHash(parts: TtsCacheParts): Promise<string> {
  const payload = JSON.stringify([
    parts.text,
    parts.languageCode,
    parts.voiceName,
    parts.speakingRate,
    parts.audioEncoding,
  ]);
  const data = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

export function shouldCache(byteLength: number): boolean {
  return byteLength > 0 && byteLength <= MAX_TTS_CACHE_BYTES;
}
