import { useEffect, useRef, useState } from "react";
import { mergeProgress } from "../lib/merge";
import { normalizeProgress } from "../lib/progress";
import { fetchRemoteProgress, putRemoteProgress, saveLocalProgress } from "../lib/sync";
import { getDeviceId } from "../lib/device";
import { useProgressStore } from "../stores/progressStore";
import { formatCharCount } from "../lib/ttsUsage";
import { isSyncConfigured, setSyncToken, setWorkerUrl, workerUrlLabel } from "../lib/workerConfig";
import { useSettingsStore } from "../stores/settingsStore";
import { useTtsUsageStore } from "../stores/ttsUsageStore";
import type { Accent, ColorMode, DailyNewLimit, ProgressData } from "../types";
import { SM2 } from "../lib/sm2";

const fieldClass =
  "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";
const labelClass = "font-medium text-slate-900 dark:text-slate-100";
const hintClass = "mt-1 text-xs text-slate-700 dark:text-slate-300";
const panelClass =
  "rounded-lg bg-slate-50 p-4 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100";
const btnClass =
  "rounded border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700";

export function SettingsPage() {
  const {
    settings,
    syncStatus,
    lastSyncedAt,
    syncError,
    setAccent,
    setColorMode,
    setDailyNewLimit,
    setSyncStatus,
    setLastSyncedAt,
    refreshConnection,
  } = useSettingsStore();
  const progress = useProgressStore((s) => s.progress);
  const updateProgress = useProgressStore((s) => s.updateProgress);
  const ttsUsage = useTtsUsageStore((s) => s.usage);
  const ttsLoadError = useTtsUsageStore((s) => s.loadError);
  const refreshTtsUsage = useTtsUsageStore((s) => s.refresh);
  const [buildVersion, setBuildVersion] = useState<string | null>(null);
  const [workerTest, setWorkerTest] = useState<string | null>(null);

  // 接続設定の編集用ローカル状態
  const [urlInput, setUrlInput] = useState(settings.workerUrl);
  const [tokenInput, setTokenInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [connSaved, setConnSaved] = useState<string | null>(null);
  const [ioMessage, setIoMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deviceId = getDeviceId();

  useEffect(() => {
    void fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { version?: string }) => setBuildVersion(d.version ?? "不明"))
      .catch(() => setBuildVersion("取得失敗"));
  }, []);

  useEffect(() => {
    setUrlInput(settings.workerUrl);
  }, [settings.workerUrl]);

  useEffect(() => {
    if (isSyncConfigured()) {
      void refreshTtsUsage(settings.workerUrl, settings.syncToken);
    }
  }, [refreshTtsUsage, settings.workerUrl, settings.syncToken]);

  function saveConnection() {
    setWorkerUrl(urlInput);
    if (tokenInput.trim()) setSyncToken(tokenInput);
    refreshConnection();
    setTokenInput("");
    setShowToken(false);
    setConnSaved("保存しました");
    setTimeout(() => setConnSaved(null), 2500);
  }

  async function testWorkerConnection() {
    if (!isSyncConfigured()) {
      setWorkerTest("✗ 合言葉が未設定です。下のフォームで入力して保存してください");
      return;
    }
    const { settings: s } = useSettingsStore.getState();
    setWorkerTest("確認中...");
    try {
      const base = s.workerUrl.replace(/\/$/, "");
      const res = await fetch(`${base}/tts-usage`, {
        headers: { Authorization: `Bearer ${s.syncToken}` },
      });
      if (res.status === 401) {
        setWorkerTest("✗ 合言葉が一致しません。Worker の SYNC_TOKEN を確認してください");
        return;
      }
      if (!res.ok) {
        setWorkerTest(`✗ Worker 応答エラー (${res.status})`);
        return;
      }
      setWorkerTest("✓ Worker に接続できました（TTS・同期が使えます）");
      await refreshTtsUsage(s.workerUrl, s.syncToken);
    } catch (e) {
      setWorkerTest(`✗ 接続失敗: ${e instanceof Error ? e.message : "不明"}`);
    }
  }

  async function syncNow() {
    if (!isSyncConfigured()) {
      setSyncStatus("error", "合言葉が未設定です。接続設定で入力してください");
      return;
    }
    const { settings: s } = useSettingsStore.getState();
    setSyncStatus("syncing");
    try {
      // 教材は Pages 静的シャードから常に配信されるので、同期対象は進捗のみ。
      const remote = await fetchRemoteProgress(s.workerUrl, s.syncToken);
      const merged = mergeProgress(progress, remote);
      updateProgress(merged);
      saveLocalProgress(merged);
      await putRemoteProgress(s.workerUrl, s.syncToken, merged);
      setSyncStatus("ok");
      setLastSyncedAt(Date.now());
      await refreshTtsUsage(s.workerUrl, s.syncToken);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "同期に失敗しました";
      const hint =
        msg.includes("401") || msg.includes("Unauthorized")
          ? "（合言葉不一致。Worker の SYNC_TOKEN を確認してください）"
          : msg === "Failed to fetch"
            ? "（CORSまたはネットワークエラー。Workerを再デプロイしてください）"
            : "";
      setSyncStatus("error", `${msg}${hint}`);
    }
  }

  function exportProgress() {
    try {
      const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ielts-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setIoMessage({ kind: "ok", text: "進捗をエクスポートしました" });
    } catch {
      setIoMessage({ kind: "err", text: "エクスポートに失敗しました" });
    }
  }

  async function importProgress(file: File) {
    setIoMessage(null);
    let parsed: Partial<ProgressData>;
    try {
      const text = await file.text();
      parsed = JSON.parse(text) as Partial<ProgressData>;
    } catch {
      setIoMessage({ kind: "err", text: "JSON を読み取れませんでした（ファイルが壊れています）" });
      return;
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed) || !("srs" in parsed)) {
      setIoMessage({ kind: "err", text: "進捗データの形式ではありません（srs が見つかりません）" });
      return;
    }
    try {
      const incoming = normalizeProgress(parsed);
      const merged = mergeProgress(progress, incoming);
      updateProgress(merged);
      saveLocalProgress(merged);
      setIoMessage({ kind: "ok", text: "進捗をインポート（マージ）しました" });
    } catch {
      setIoMessage({ kind: "err", text: "インポートに失敗しました" });
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
      <h2 className="text-lg font-semibold">設定</h2>

      {/* 接続設定（手動） */}
      <div className={panelClass}>
        <p className="font-medium">Worker 接続</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          {workerUrlLabel(settings.workerUrl)}
        </p>

        <label className="mt-3 block text-sm">
          <span className={labelClass}>Worker API URL</span>
          <input
            className={fieldClass}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://...workers.dev"
            inputMode="url"
            autoComplete="off"
          />
        </label>

        <label className="mt-3 block text-sm">
          <span className={labelClass}>Sync Token（合言葉）</span>
          <div className="mt-1 flex gap-2">
            <input
              className={fieldClass.replace("mt-1 ", "")}
              type={showToken ? "text" : "password"}
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder={isSyncConfigured() ? "設定済み（変更する場合のみ入力）" : "Worker の SYNC_TOKEN と同じ値"}
              autoComplete="off"
            />
            <button type="button" className={btnClass} onClick={() => setShowToken((v) => !v)}>
              {showToken ? "隠す" : "表示"}
            </button>
          </div>
          <p className={hintClass}>
            合言葉:{" "}
            {isSyncConfigured() ? (
              <span className="text-emerald-700 dark:text-emerald-400">設定済み</span>
            ) : (
              <span className="text-amber-700 dark:text-amber-300">未設定</span>
            )}
            （平文では表示しません。Worker からの自動取得は行いません）
          </p>
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700" onClick={saveConnection}>
            接続設定を保存
          </button>
          <button type="button" className={btnClass} onClick={() => void testWorkerConnection()}>
            接続テスト
          </button>
          {connSaved && <span className="text-sm text-emerald-700 dark:text-emerald-400">{connSaved}</span>}
        </div>
        {workerTest && (
          <p className={`mt-2 text-sm ${workerTest.startsWith("✓") ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
            {workerTest}
          </p>
        )}
        <p className={`mt-2 ${hintClass}`}>
          端末ID: <code className="text-xs">{deviceId}</code>
        </p>
      </div>

      <label className="block text-sm">
        <span className={labelClass}>表示テーマ</span>
        <select className={fieldClass} value={settings.colorMode} onChange={(e) => setColorMode(e.target.value as ColorMode)}>
          <option value="system">システムに合わせる</option>
          <option value="light">ライト</option>
          <option value="dark">ダーク</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className={labelClass}>1日の新規上限（今日の復習）</span>
        <select className={fieldClass} value={settings.dailyNewLimit} onChange={(e) => setDailyNewLimit(Number(e.target.value) as DailyNewLimit)}>
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
        <p className="font-medium">Google TTS 使用量（今月）</p>
        {ttsUsage ? (
          <div className="mt-2 space-y-2">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full rounded-full ${ttsUsage.blocked ? "bg-red-500" : ttsUsage.warning ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min(ttsUsage.percentUsed, 100)}%` }}
              />
            </div>
            <p>
              {formatCharCount(ttsUsage.charsUsed)} / {formatCharCount(ttsUsage.monthlyLimit)} 文字（{ttsUsage.percentUsed}%）
            </p>
            {ttsUsage.warning && !ttsUsage.blocked && (
              <p className="text-amber-800 dark:text-amber-300">80% を超えました。新しい文の再生は控えめにしてください。</p>
            )}
            {ttsUsage.blocked && (
              <p className="text-red-700 dark:text-red-300">上限に達したため、新しい TTS 生成は停止しています。</p>
            )}
            <p className={hintClass}>キャッシュ済み音声・辞書の実録音は引き続き利用できます。</p>
          </div>
        ) : (
          <p className={`mt-1 ${hintClass}`}>
            {isSyncConfigured() ? (ttsLoadError ?? "使用量を読み込み中...") : "合言葉を設定すると使用量を表示します。"}
          </p>
        )}
      </div>

      {/* 進捗のエクスポート / インポート */}
      <div className={panelClass}>
        <p className="font-medium">ローカル進捗のバックアップ</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className={btnClass} onClick={exportProgress}>
            エクスポート（JSON）
          </button>
          <button type="button" className={btnClass} onClick={() => fileInputRef.current?.click()}>
            インポート（マージ）
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importProgress(file);
              e.target.value = "";
            }}
          />
        </div>
        {ioMessage && (
          <p className={`mt-2 text-sm ${ioMessage.kind === "ok" ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
            {ioMessage.text}
          </p>
        )}
        <p className={hintClass}>インポートは既存の進捗と item 単位でマージします（壊れた JSON は安全に失敗）。</p>
      </div>

      <div className={panelClass}>
        <p>同期状態: {statusLabel}</p>
        {syncError && <p className="mt-1 text-red-600 dark:text-red-400">{syncError}</p>}
        {lastSyncedAt && <p className={hintClass}>最終同期: {new Date(lastSyncedAt).toLocaleString()}</p>}
      </div>

      <button type="button" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" onClick={() => void syncNow()}>
        今すぐ同期
      </button>

      {buildVersion && <p className={`${hintClass} text-center`}>ビルド: {buildVersion}</p>}
    </div>
  );
}
