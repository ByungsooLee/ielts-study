/**
 * localStorage の読み書きを一元化する安全ユーティリティ。
 * - JSON parse 失敗でアプリ全体が落ちないようにする
 * - 破損時はバックアップキーへ退避して初期化する
 * - 旧キーからの後方互換読み取り＋新キーへの移行
 */

const PREFIX = "ielts:";

export const STORAGE_KEYS = {
  progress: `${PREFIX}progress`,
  settings: `${PREFIX}settings`,
  deviceId: `${PREFIX}device-id`,
  syncToken: `${PREFIX}sync-token`,
  workerUrl: `${PREFIX}worker-url`,
} as const;

/** 旧キー（移行のための読み取り専用フォールバック） */
export const LEGACY_STORAGE_KEYS: Record<string, string[]> = {
  [STORAGE_KEYS.progress]: ["progress"],
  [STORAGE_KEYS.settings]: ["settings"],
  [STORAGE_KEYS.syncToken]: ["ielts-sync-token"],
};

export function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeRaw(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode / quota: 黙って無視（メモリ状態は保持される） */
  }
}

export function removeRaw(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** 破損データを `${key}.corrupt.<ts>` に退避し、元キーを消す。 */
function quarantine(key: string, raw: string): void {
  try {
    writeRaw(`${key}.corrupt.${Date.now()}`, raw);
  } catch {
    /* ignore */
  }
  removeRaw(key);
}

interface ReadJsonOptions {
  /** タイムスタンプ付きで自動採番されない固定の旧キー */
  legacyKeys?: string[];
}

/**
 * JSON を安全に読む。
 * - 破損していたら退避して fallback を返す
 * - 新キーが無ければ旧キーを試し、見つかれば新キーへ移行
 */
export function readJson<T>(key: string, fallback: T, options: ReadJsonOptions = {}): T {
  const raw = readRaw(key);
  if (raw != null) {
    try {
      return JSON.parse(raw) as T;
    } catch {
      quarantine(key, raw);
      return fallback;
    }
  }

  const legacyKeys = options.legacyKeys ?? LEGACY_STORAGE_KEYS[key] ?? [];
  for (const legacyKey of legacyKeys) {
    const legacyRaw = readRaw(legacyKey);
    if (legacyRaw == null) continue;
    try {
      const parsed = JSON.parse(legacyRaw) as T;
      writeRaw(key, legacyRaw); // 新キーへ移行（旧キーは安全のため残す）
      return parsed;
    } catch {
      quarantine(legacyKey, legacyRaw);
    }
  }

  return fallback;
}

export function writeJson(key: string, value: unknown): void {
  try {
    writeRaw(key, JSON.stringify(value));
  } catch {
    /* circular 等は無視 */
  }
}

/** 文字列値（トークン等）の読み取り。旧キーがあれば移行。 */
export function readString(key: string, options: ReadJsonOptions = {}): string {
  const raw = readRaw(key);
  if (raw != null) return raw;
  const legacyKeys = options.legacyKeys ?? LEGACY_STORAGE_KEYS[key] ?? [];
  for (const legacyKey of legacyKeys) {
    const legacyRaw = readRaw(legacyKey);
    if (legacyRaw != null) {
      writeRaw(key, legacyRaw);
      return legacyRaw;
    }
  }
  return "";
}

export function writeString(key: string, value: string): void {
  writeRaw(key, value);
}
