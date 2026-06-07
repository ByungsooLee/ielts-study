export const TTS_MONTHLY_FREE_LIMIT = 1_000_000;
export const TTS_WARNING_RATIO = 0.8;
export const TTS_WARNING_THRESHOLD = Math.floor(TTS_MONTHLY_FREE_LIMIT * TTS_WARNING_RATIO);
const KV_KEY = "tts-usage";

export interface TtsUsageRecord {
  month: string;
  charsUsed: number;
}

export interface TtsUsageStatus {
  month: string;
  charsUsed: number;
  monthlyLimit: number;
  warningThreshold: number;
  warning: boolean;
  blocked: boolean;
  percentUsed: number;
}

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function countChars(text: string): number {
  return [...text].length;
}

export async function getTtsUsage(kv: KVNamespace): Promise<TtsUsageRecord> {
  const month = currentMonth();
  const raw = await kv.get(KV_KEY);
  if (!raw) return { month, charsUsed: 0 };
  try {
    const data = JSON.parse(raw) as TtsUsageRecord;
    if (data.month !== month) return { month, charsUsed: 0 };
    return { month, charsUsed: data.charsUsed ?? 0 };
  } catch {
    return { month, charsUsed: 0 };
  }
}

export async function addTtsUsage(kv: KVNamespace, chars: number): Promise<TtsUsageRecord> {
  const usage = await getTtsUsage(kv);
  usage.charsUsed += chars;
  await kv.put(KV_KEY, JSON.stringify(usage));
  return usage;
}

export function buildTtsUsageStatus(usage: TtsUsageRecord): TtsUsageStatus {
  const percentUsed = Math.round((usage.charsUsed / TTS_MONTHLY_FREE_LIMIT) * 1000) / 10;
  return {
    month: usage.month,
    charsUsed: usage.charsUsed,
    monthlyLimit: TTS_MONTHLY_FREE_LIMIT,
    warningThreshold: TTS_WARNING_THRESHOLD,
    warning: usage.charsUsed >= TTS_WARNING_THRESHOLD && usage.charsUsed < TTS_MONTHLY_FREE_LIMIT,
    blocked: usage.charsUsed >= TTS_MONTHLY_FREE_LIMIT,
    percentUsed,
  };
}

export function ttsUsageHeaders(status: TtsUsageStatus): Record<string, string> {
  return {
    "X-TTS-Chars-Used": String(status.charsUsed),
    "X-TTS-Monthly-Limit": String(status.monthlyLimit),
    "X-TTS-Warning": status.warning ? "1" : "0",
    "X-TTS-Blocked": status.blocked ? "1" : "0",
  };
}
