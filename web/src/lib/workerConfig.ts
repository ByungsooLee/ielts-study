/** 本番 Worker（個人用・固定） */
export const PRODUCTION_WORKER_URL = "https://ielts-study-worker.byung4050.workers.dev";

/** ローカル `npm run dev:worker` 用 */
export const LOCAL_WORKER_URL = "http://127.0.0.1:8787";

const SYNC_TOKEN_CACHE_KEY = "ielts-sync-token";

let runtimeSyncToken: string | null = null;

/**
 * Worker URL は設定画面では変更しない。
 * - 本番ビルド: 本番 Worker 固定
 * - ローカル dev: ローカル Worker（dev:worker 起動時）
 * - VITE_DEFAULT_WORKER_URL があれば最優先（上書き用）
 */
export function resolveWorkerUrl(): string {
  const fromEnv = import.meta.env.VITE_DEFAULT_WORKER_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return (import.meta.env.DEV ? LOCAL_WORKER_URL : PRODUCTION_WORKER_URL).replace(/\/$/, "");
}

function readCachedSyncToken(): string {
  if (runtimeSyncToken) return runtimeSyncToken;
  try {
    const stored = localStorage.getItem(SYNC_TOKEN_CACHE_KEY);
    if (stored) {
      runtimeSyncToken = stored;
      return stored;
    }
  } catch {
    /* private mode 等 */
  }
  return "";
}

function cacheSyncToken(token: string): void {
  runtimeSyncToken = token;
  try {
    localStorage.setItem(SYNC_TOKEN_CACHE_KEY, token);
  } catch {
    /* ignore */
  }
}

/** ビルド時埋め込み → 端末キャッシュ → Worker 自動取得の順 */
export function resolveSyncToken(): string {
  const fromEnv = (import.meta.env.VITE_DEFAULT_SYNC_TOKEN ?? "").trim();
  if (fromEnv) return fromEnv;
  return readCachedSyncToken();
}

export function isSyncConfigured(): boolean {
  return resolveSyncToken().length > 0;
}

/**
 * 合言葉を Worker から自動取得（端末登録不要）。
 * 本番 Pages でビルド時トークンが無くても、初回起動で取得して以降はキャッシュ。
 */
export async function bootstrapSyncToken(workerUrl = resolveWorkerUrl()): Promise<string> {
  const existing = resolveSyncToken();
  if (existing) return existing;

  const base = workerUrl.replace(/\/$/, "");
  try {
    const res = await fetch(`${base}/app-bootstrap`, { method: "GET" });
    if (!res.ok) return "";
    const data = (await res.json()) as { syncToken?: string };
    const token = data.syncToken?.trim() ?? "";
    if (token) cacheSyncToken(token);
    return token;
  } catch {
    return "";
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
  try {
    localStorage.removeItem(SYNC_TOKEN_CACHE_KEY);
  } catch {
    /* ignore */
  }
}
