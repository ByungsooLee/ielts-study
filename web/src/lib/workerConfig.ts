import { STORAGE_KEYS, readString, removeRaw, writeString } from "./storage";

/** 本番 Worker（個人用・固定） */
export const PRODUCTION_WORKER_URL = "https://ielts-study-worker.byung4050.workers.dev";

/** ローカル `npm run dev:worker` 用 */
export const LOCAL_WORKER_URL = "http://127.0.0.1:8787";

let runtimeSyncToken: string | null = null;

/**
 * Worker URL の解決順:
 *   1. 設定画面で保存した手動 URL（localStorage）
 *   2. VITE_DEFAULT_WORKER_URL（ビルド時）
 *   3. dev=ローカル / 本番=固定URL
 */
export function resolveWorkerUrl(): string {
  const manual = readString(STORAGE_KEYS.workerUrl).trim();
  if (manual) return manual.replace(/\/$/, "");
  const fromEnv = import.meta.env.VITE_DEFAULT_WORKER_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return (import.meta.env.DEV ? LOCAL_WORKER_URL : PRODUCTION_WORKER_URL).replace(/\/$/, "");
}

export function setWorkerUrl(url: string): void {
  const trimmed = url.trim().replace(/\/$/, "");
  if (trimmed) writeString(STORAGE_KEYS.workerUrl, trimmed);
  else removeRaw(STORAGE_KEYS.workerUrl);
}

/**
 * 合言葉の解決順:
 *   1. VITE_DEFAULT_SYNC_TOKEN（ビルド時埋め込み）
 *   2. 設定画面で手動入力した端末キャッシュ（localStorage）
 *
 * ※ Worker からの自動取得は廃止（/app-bootstrap は秘密情報を返さない）。
 */
export function resolveSyncToken(): string {
  const fromEnv = (import.meta.env.VITE_DEFAULT_SYNC_TOKEN ?? "").trim();
  if (fromEnv) return fromEnv;
  if (runtimeSyncToken) return runtimeSyncToken;
  const stored = readString(STORAGE_KEYS.syncToken);
  if (stored) {
    runtimeSyncToken = stored;
    return stored;
  }
  return "";
}

/** 設定画面から手動でトークンを保存。 */
export function setSyncToken(token: string): void {
  const trimmed = token.trim();
  runtimeSyncToken = trimmed || null;
  if (trimmed) writeString(STORAGE_KEYS.syncToken, trimmed);
  else removeRaw(STORAGE_KEYS.syncToken);
}

export function clearSyncToken(): void {
  setSyncToken("");
}

export function isSyncConfigured(): boolean {
  return resolveSyncToken().length > 0;
}

export interface BootstrapInfo {
  apiVersion: string;
  authMode: string;
  requiresToken: boolean;
  features: { progressSync: boolean; tts: boolean; legacyContentKv: boolean };
}

/**
 * 公開情報のみを取得（認証不要・秘密情報なし）。
 * 機能フラグや requiresToken の確認に使う。失敗しても致命ではない。
 */
export async function fetchBootstrapInfo(workerUrl = resolveWorkerUrl()): Promise<BootstrapInfo | null> {
  const base = workerUrl.replace(/\/$/, "");
  try {
    const res = await fetch(`${base}/app-bootstrap`, { method: "GET" });
    if (!res.ok) return null;
    return (await res.json()) as BootstrapInfo;
  } catch {
    return null;
  }
}

export function workerUrlLabel(url: string): string {
  if (url === PRODUCTION_WORKER_URL) return "本番 Worker";
  if (url === LOCAL_WORKER_URL) return "ローカル Worker（dev:worker）";
  return "カスタム Worker";
}

/** @internal vitest 用 */
export function resetSyncTokenCacheForTests(): void {
  runtimeSyncToken = null;
  removeRaw(STORAGE_KEYS.syncToken);
}
