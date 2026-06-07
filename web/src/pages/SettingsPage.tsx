import { fetchRemoteProgress, putRemoteProgress, saveLocalProgress } from "../lib/sync";
import { mergeProgress } from "../lib/merge";
import { useProgressStore } from "../stores/progressStore";
import { useSettingsStore } from "../stores/settingsStore";
import type { Accent } from "../types";

export function SettingsPage() {
  const { settings, syncStatus, lastSyncedAt, syncError, setWorkerUrl, setSyncToken, setAccent, setSyncStatus, setLastSyncedAt } =
    useSettingsStore();
  const progress = useProgressStore((s) => s.progress);
  const updateProgress = useProgressStore((s) => s.updateProgress);

  async function syncNow() {
    if (!settings.workerUrl || !settings.syncToken) {
      setSyncStatus("error", "Worker URL と合言葉を入力してください");
      return;
    }
    setSyncStatus("syncing");
    try {
      const remote = await fetchRemoteProgress(settings.workerUrl, settings.syncToken);
      const merged = mergeProgress(progress, remote);
      updateProgress(merged);
      saveLocalProgress(merged);
      await putRemoteProgress(settings.workerUrl, settings.syncToken, merged);
      setSyncStatus("ok");
      setLastSyncedAt(Date.now());
    } catch (e) {
      const msg = e instanceof Error ? e.message : "同期に失敗しました";
      const hint =
        msg === "Failed to fetch"
          ? "（CORSまたはネットワークエラー。ブラウザのURLが localhost か 127.0.0.1 か確認し、Workerを再デプロイしてください）"
          : "";
      setSyncStatus("error", `${msg}${hint}`);
    }
  }

  const statusLabel =
    syncStatus === "syncing"
      ? "同期中"
      : syncStatus === "ok"
        ? "同期ON"
        : syncStatus === "error"
          ? "エラー"
          : navigator.onLine
            ? "待機中"
            : "オフライン";

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">設定</h2>

      <label className="block text-sm">
        <span className="text-slate-700">Worker URL</span>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          placeholder="https://your-worker.workers.dev"
          value={settings.workerUrl}
          onChange={(e) => setWorkerUrl(e.target.value)}
        />
      </label>

      <label className="block text-sm">
        <span className="text-slate-700">合言葉 (SYNC_TOKEN)</span>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          type="password"
          value={settings.syncToken}
          onChange={(e) => setSyncToken(e.target.value)}
        />
        <p className="mt-1 text-xs text-slate-500">
          強固なランダム文字列を使ってください。漏れると進捗を読み書きされる可能性があります。
        </p>
      </label>

      <label className="block text-sm">
        <span className="text-slate-700">発音アクセント</span>
        <select
          className="mt-1 w-full rounded border px-3 py-2"
          value={settings.accent}
          onChange={(e) => setAccent(e.target.value as Accent)}
        >
          <option value="en-GB">en-GB（既定）</option>
          <option value="en-US">en-US</option>
          <option value="en-AU">en-AU</option>
        </select>
      </label>

      <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
        <p>同期状態: {statusLabel}</p>
        {syncError && <p className="mt-1 text-red-600">{syncError}</p>}
        {lastSyncedAt && (
          <p className="mt-1 text-slate-500">最終同期: {new Date(lastSyncedAt).toLocaleString()}</p>
        )}
      </div>

      <button type="button" className="rounded bg-blue-600 px-4 py-2 text-white" onClick={() => void syncNow()}>
        今すぐ同期
      </button>
    </div>
  );
}
