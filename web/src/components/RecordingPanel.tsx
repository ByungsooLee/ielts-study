import { useEffect, useState } from "react";
import { listRecordings, playRecordingBlob, RecordingSession, removeRecording } from "../lib/recording";
import type { Recording } from "../types";

interface Props {
  itemId: string;
  label?: string;
  onCompareModel?: () => Promise<void>;
}

export function RecordingPanel({ itemId, label = "録音", onCompareModel }: Props) {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session] = useState(() => new RecordingSession());

  async function refresh() {
    setRecordings(await listRecordings(itemId));
  }

  useEffect(() => {
    void refresh();
  }, [itemId]);

  async function startRecording() {
    setError(null);
    try {
      await session.start();
      setRecording(true);
    } catch {
      setError("マイクの許可が必要です。ブラウザ設定でマイクを許可してください。");
    }
  }

  async function stopRecording() {
    try {
      await session.stop(itemId);
      setRecording(false);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "録音に失敗しました");
      setRecording(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {!recording ? (
          <button
            type="button"
            className="rounded bg-rose-600 px-3 py-1 text-xs text-white"
            onClick={() => void startRecording()}
          >
            録音開始
          </button>
        ) : (
          <button
            type="button"
            className="rounded bg-slate-700 px-3 py-1 text-xs text-white"
            onClick={() => void stopRecording()}
          >
            停止して保存
          </button>
        )}
        {onCompareModel && (
          <button
            type="button"
            className="rounded bg-emerald-600 px-3 py-1 text-xs text-white"
            onClick={() => void onCompareModel()}
          >
            お手本を再生
          </button>
        )}
      </div>
      {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
      <ul className="space-y-1">
        {recordings.map((r) => (
          <li key={r.id} className="flex items-center justify-between text-xs text-slate-600">
            <span>{new Date(r.createdAt).toLocaleString()} ({Math.round(r.durationMs / 1000)}秒)</span>
            <span className="flex items-center gap-2">
              <button
                type="button"
                className="text-blue-600"
                onClick={() => void playRecordingBlob(r.blob)}
              >
                再生
              </button>
              <button
                type="button"
                className="text-red-600"
                onClick={() => void removeRecording(r.id).then(refresh)}
              >
                削除
              </button>
            </span>
          </li>
        ))}
        {recordings.length === 0 && <li className="text-xs text-slate-400">録音はまだありません（最大5件）</li>}
      </ul>
    </div>
  );
}
