import { useEffect, useState } from "react";
import { getAllContent, upsertContent } from "../db";
import { mergeContent, recordsToContentData } from "../lib/contentMerge";
import { fetchRemoteContent, putRemoteContent } from "../lib/contentSync";
import { mergeProgress } from "../lib/merge";
import { fetchRemoteProgress, putRemoteProgress, saveLocalProgress } from "../lib/sync";
import { useContentStore } from "../stores/contentStore";
import { useProgressStore } from "../stores/progressStore";
import { formatCharCount } from "../lib/ttsUsage";
import { workerUrlLabel } from "../lib/workerConfig";
import { useSettingsStore } from "../stores/settingsStore";
import { useTtsUsageStore } from "../stores/ttsUsageStore";
import type { Accent, ColorMode, DailyNewLimit } from "../types";
import { SM2 } from "../lib/sm2";

const fieldClass =
  "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";
const labelClass = "font-medium text-slate-900 dark:text-slate-100";
const hintClass = "mt-1 text-xs text-slate-700 dark:text-slate-300";
const panelClass =
  "rounded-lg bg-slate-50 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100";

export function SettingsPage() {
  const {
    settings,
    syncStatus,
    lastSyncedAt,
    syncError,
    setSyncToken,
    setAccent,
    setColorMode,
    setDailyNewLimit,
    setSyncStatus,
    setLastSyncedAt,
  } = useSettingsStore();
  const progress = useProgressStore((s) => s.progress);
  const updateProgress = useProgressStore((s) => s.updateProgress);
  const loadContent = useContentStore((s) => s.load);
  const ttsUsage = useTtsUsageStore((s) => s.usage);
  const ttsLoadError = useTtsUsageStore((s) => s.loadError);
  const refreshTtsUsage = useTtsUsageStore((s) => s.refresh);
  const [buildVersion, setBuildVersion] = useState<string | null>(null);
  const [workerTest, setWorkerTest] = useState<string | null>(null);

  useEffect(() => {
    void fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { version?: string }) => setBuildVersion(d.version ?? "不明"))
      .catch(() => setBuildVersion("取得失敗"));
  }, []);

  useEffect(() => {
    if (settings.workerUrl && settings.syncToken) {
      void refreshTtsUsage(settings.workerUrl, settings.syncToken);
    }
  }, [refreshTtsUsage, settings.syncToken, settings.workerUrl]);

  async function testWorkerConnection() {
    if (!settings.syncToken) {
      setWorkerTest("合言葉を入力してください");
      return;
    }
    setWorkerTest("確認中...");
    try {
      const base = settings.workerUrl.replace(/\/$/, "");
      const res = await fetch(`${base}/tts-usage`, {
        headers: { Authorization: `Bearer ${settings.syncToken}` },
      });
      if (res.status === 401) {
        setWorkerTest(
          "✗ 合言葉が一致しません。worker/.dev.vars の SYNC_TOKEN を設定画面に貼り、ターミナルで npm run secrets:push を実行してください",
        );
        return;
      }
      if (!res.ok) {
        setWorkerTest(`✗ Worker 応答エラー (${res.status})`);
        return;
      }
      setWorkerTest("✓ Worker に接続できました（TTS・同期が使えます）");
      await refreshTtsUsage(settings.workerUrl, settings.syncToken);
    } catch (e) {
      setWorkerTest(`✗ 接続失敗: ${e instanceof Error ? e.message : "不明"}`);
    }
  }

  async function syncNow() {
    if (!settings.syncToken) {
      setSyncStatus("error", "合言葉を入力してください");
      return;
    }
    setSyncStatus("syncing");
    try {
      const localRecords = await getAllContent();
      const remoteContent = await fetchRemoteContent(settings.workerUrl, settings.syncToken);
      const mergedContent = mergeContent(
        recordsToContentData(localRecords),
        remoteContent,
      );
      if (mergedContent.records.length > 0) {
        await upsertContent(mergedContent.records);
        await loadContent();
      }
      await putRemoteContent(settings.workerUrl, settings.syncToken, mergedContent);

      const remote = await fetchRemoteProgress(settings.workerUrl, settings.syncToken);
      const merged = mergeProgress(progress, remote);
      updateProgress(merged);
      saveLocalProgress(merged);
      await putRemoteProgress(settings.workerUrl, settings.syncToken, merged);
      setSyncStatus("ok");
      setLastSyncedAt(Date.now());
      await refreshTtsUsage(settings.workerUrl, settings.syncToken);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "同期に失敗しました";
      const hint =
        msg.includes("401") || msg.includes("Unauthorized")
          ? "（合言葉不一致。worker/.dev.vars の SYNC_TOKEN を再入力し npm run secrets:push）"
          : msg === "Failed to fetch"
            ? "（CORSまたはネットワークエラー。Workerを再デプロイしてください）"
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
    <div className="mx-auto max-w-xl space-y-6 rounded-xl bg-white p-6 text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">設定</h2>

      <div className={panelClass}>
        <p className="font-medium text-slate-900 dark:text-slate-100">Worker 接続先（自動）</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          {workerUrlLabel(settings.workerUrl)} — <code className="text-xs">{settings.workerUrl}</code>
        </p>
        <p className={`mt-2 ${hintClass}`}>
          個人用のため URL は固定です。ローカル開発（<code className="text-xs">npm run dev</code>）では
          ローカル Worker、本番（pages.dev）では本番 Worker に接続します。
        </p>
      </div>

      <label className="block text-sm">
        <span className={labelClass}>合言葉 (SYNC_TOKEN)</span>
        <input
          className={fieldClass}
          type="password"
          value={settings.syncToken}
          onChange={(e) => setSyncToken(e.target.value)}
        />
        <p className={hintClass}>
          強固なランダム文字列を使ってください。漏れると進捗を読み書きされる可能性があります。
          Worker を再デプロイしたあとは <code className="text-xs">npm run secrets:push</code> で本番に反映が必要です。
        </p>
        <button
          type="button"
          className="mt-2 rounded border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
          onClick={() => void testWorkerConnection()}
        >
          Worker 接続テスト
        </button>
        {workerTest && <p className={`mt-2 text-sm ${workerTest.startsWith("✓") ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>{workerTest}</p>}
      </label>

      <label className="block text-sm">
        <span className={labelClass}>表示テーマ</span>
        <select
          className={fieldClass}
          value={settings.colorMode}
          onChange={(e) => setColorMode(e.target.value as ColorMode)}
        >
          <option value="system">システムに合わせる</option>
          <option value="light">ライト</option>
          <option value="dark">ダーク</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className={labelClass}>1日の新規上限（今日の復習）</span>
        <select
          className={fieldClass}
          value={settings.dailyNewLimit}
          onChange={(e) => setDailyNewLimit(Number(e.target.value) as DailyNewLimit)}
        >
          {SM2.DAILY_NEW_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} 件/日
            </option>
          ))}
        </select>
        <p className={hintClass}>復習 due 件数に加え、未学習を n 昇順でこの件数まで追加します。</p>
      </label>

      <label className="block text-sm">
        <span className={labelClass}>発音アクセント</span>
        <select className={fieldClass} value={settings.accent} onChange={(e) => setAccent(e.target.value as Accent)}>
          <option value="en-GB">en-GB（既定）</option>
          <option value="en-US">en-US</option>
          <option value="en-AU">en-AU</option>
        </select>
      </label>

      <div className={panelClass}>
        <p className="font-medium text-slate-900 dark:text-slate-100">Google TTS 使用量（今月）</p>
        {ttsUsage ? (
          <div className="mt-2 space-y-2">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full rounded-full ${
                  ttsUsage.blocked ? "bg-red-500" : ttsUsage.warning ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(ttsUsage.percentUsed, 100)}%` }}
              />
            </div>
            <p className="text-slate-900 dark:text-slate-100">
              {formatCharCount(ttsUsage.charsUsed)} / {formatCharCount(ttsUsage.monthlyLimit)} 文字（
              {ttsUsage.percentUsed}%）
            </p>
            {ttsUsage.warning && !ttsUsage.blocked && (
              <p className="text-amber-800 dark:text-amber-300">
                80% を超えました。無料枠内に収めるため、新しい文の再生は控えめにしてください。
              </p>
            )}
            {ttsUsage.blocked && (
              <p className="text-red-700 dark:text-red-300">無料枠に達したため、新しい TTS 生成は停止しています。</p>
            )}
            <p className={hintClass}>
              キャッシュ済み音声・辞書の実録音は引き続き利用できます。Neural 音声の無料枠は月 100 万文字です。
            </p>
          </div>
        ) : (
          <p className={`mt-1 ${hintClass}`}>
            {settings.workerUrl && settings.syncToken
              ? (ttsLoadError ?? "使用量を読み込み中...")
              : "Worker URL と合言葉を設定すると表示されます。"}
          </p>
        )}
      </div>

      <div className={panelClass}>
        <p className="text-slate-900 dark:text-slate-100">同期状態: {statusLabel}</p>
        {syncError && <p className="mt-1 text-red-600 dark:text-red-400">{syncError}</p>}
        {lastSyncedAt && (
          <p className={hintClass}>最終同期: {new Date(lastSyncedAt).toLocaleString()}</p>
        )}
      </div>

      <button type="button" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" onClick={() => void syncNow()}>
        今すぐ同期
      </button>

      {buildVersion && (
        <p className={`${hintClass} text-center`}>ビルド: {buildVersion}</p>
      )}
    </div>
  );
}
