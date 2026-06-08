/** 本番 Worker（個人用・固定） */
export const PRODUCTION_WORKER_URL = "https://ielts-study-worker.byung4050.workers.dev";

/** ローカル `npm run dev:worker` 用 */
export const LOCAL_WORKER_URL = "http://127.0.0.1:8787";

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

export function resolveSyncToken(): string {
  return (import.meta.env.VITE_DEFAULT_SYNC_TOKEN ?? "").trim();
}

export function workerUrlLabel(url: string): string {
  if (url === PRODUCTION_WORKER_URL) return "本番 Worker";
  if (url === LOCAL_WORKER_URL) return "ローカル Worker（dev:worker）";
  return "カスタム Worker";
}
