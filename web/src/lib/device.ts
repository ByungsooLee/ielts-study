import { STORAGE_KEYS, readString, writeString } from "./storage";

function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

let cached: string | null = null;

/** この端末を識別する安定 ID（進捗のマージ・由来追跡に使用）。 */
export function getDeviceId(): string {
  if (cached) return cached;
  const existing = readString(STORAGE_KEYS.deviceId);
  if (existing) {
    cached = existing;
    return existing;
  }
  const id = randomId();
  writeString(STORAGE_KEYS.deviceId, id);
  cached = id;
  return id;
}

/** @internal テスト用 */
export function resetDeviceIdCacheForTests(): void {
  cached = null;
}
