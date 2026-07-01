/**
 * KV キー設計（将来の複数ユーザー化に備えて関数で一元化）。
 *
 *   progress:user:{userId}
 *   tts-usage:{yyyyMM}:{userId}
 *   tts-cache:{hash}
 *
 * 書き込みは新キーへ寄せ、読み取りは旧キー（progress / tts-usage）も後方互換で参照する。
 * 教材(content)は Pages 静的シャードで配信するため KV では扱わない（廃止）。
 */

/** 個人用なので当面 "default" 固定。複数ユーザー化時はリクエストから解決する。 */
export const DEFAULT_USER_ID = "default";

/** 旧キー（後方互換の読み取り専用フォールバック） */
export const LEGACY_PROGRESS_KEY = "progress";
export const LEGACY_TTS_USAGE_KEY = "tts-usage";

export function progressKey(userId: string = DEFAULT_USER_ID): string {
  return `progress:user:${userId}`;
}

export function ttsUsageKey(month: string, userId: string = DEFAULT_USER_ID): string {
  return `tts-usage:${month}:${userId}`;
}

export function ttsCacheKey(hash: string): string {
  return `tts-cache:${hash}`;
}
