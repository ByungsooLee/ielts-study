import { DEFAULT_USER_ID, LEGACY_TTS_USAGE_KEY, ttsUsageKey } from "./keys";

/** Neural 音声の無料枠（月100万文字）。env.TTS_MONTHLY_LIMIT で上書き可。 */
export const TTS_MONTHLY_FREE_LIMIT = 1_000_000;
export const TTS_WARNING_RATIO = 0.8;

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

export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function countChars(text: string): number {
  return [...text].length;
}

export function resolveMonthlyLimit(rawLimit?: string): number {
  const n = Number(rawLimit);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : TTS_MONTHLY_FREE_LIMIT;
}

function parseUsage(raw: string | null, month: string): TtsUsageRecord | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<TtsUsageRecord>;
    if (data.month !== month) return null;
    return { month, charsUsed: typeof data.charsUsed === "number" ? data.charsUsed : 0 };
  } catch {
    return null;
  }
}

export async function getTtsUsage(
  kv: KVNamespace,
  userId: string = DEFAULT_USER_ID,
  month: string = currentMonth(),
): Promise<TtsUsageRecord> {
  const current = parseUsage(await kv.get(ttsUsageKey(month, userId)), month);
  if (current) return current;
  // 後方互換: 旧単一キー（同じ月なら引き継ぐ）
  const legacy = parseUsage(await kv.get(LEGACY_TTS_USAGE_KEY), month);
  if (legacy) return legacy;
  return { month, charsUsed: 0 };
}

export async function addTtsUsage(
  kv: KVNamespace,
  chars: number,
  userId: string = DEFAULT_USER_ID,
  month: string = currentMonth(),
): Promise<TtsUsageRecord> {
  const usage = await getTtsUsage(kv, userId, month);
  const next: TtsUsageRecord = { month, charsUsed: usage.charsUsed + Math.max(0, chars) };
  await kv.put(ttsUsageKey(month, userId), JSON.stringify(next));
  return next;
}

/** 生成しても上限を超えないか（true=超える=ブロック）。 */
export function wouldExceedLimit(used: number, addChars: number, limit: number): boolean {
  return used + addChars > limit;
}

export function buildTtsUsageStatus(
  usage: TtsUsageRecord,
  limit: number = TTS_MONTHLY_FREE_LIMIT,
): TtsUsageStatus {
  const warningThreshold = Math.floor(limit * TTS_WARNING_RATIO);
  const percentUsed = Math.round((usage.charsUsed / limit) * 1000) / 10;
  return {
    month: usage.month,
    charsUsed: usage.charsUsed,
    monthlyLimit: limit,
    warningThreshold,
    warning: usage.charsUsed >= warningThreshold && usage.charsUsed < limit,
    blocked: usage.charsUsed >= limit,
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
