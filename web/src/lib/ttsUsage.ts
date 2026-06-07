import type { TtsUsageStatus } from "../types";

export const TTS_MONTHLY_FREE_LIMIT = 1_000_000;
export const TTS_WARNING_THRESHOLD = 800_000;

export function parseTtsUsageHeaders(headers: Headers): TtsUsageStatus | null {
  const charsUsed = headers.get("X-TTS-Chars-Used");
  const monthlyLimit = headers.get("X-TTS-Monthly-Limit");
  if (!charsUsed || !monthlyLimit) return null;

  const used = Number(charsUsed);
  const limit = Number(monthlyLimit);
  const warningThreshold = Math.floor(limit * 0.8);
  return {
    month: new Date().toISOString().slice(0, 7),
    charsUsed: used,
    monthlyLimit: limit,
    warningThreshold,
    warning: headers.get("X-TTS-Warning") === "1",
    blocked: headers.get("X-TTS-Blocked") === "1",
    percentUsed: Math.round((used / limit) * 1000) / 10,
  };
}

export async function fetchTtsUsage(
  workerUrl: string,
  syncToken: string,
): Promise<TtsUsageStatus | null> {
  const base = workerUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/tts-usage`, {
    headers: { Authorization: `Bearer ${syncToken}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as TtsUsageStatus;
}

export function formatCharCount(n: number): string {
  return n.toLocaleString("ja-JP");
}
