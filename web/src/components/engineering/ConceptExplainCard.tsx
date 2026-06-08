import { useState } from "react";
import { RecordingPanel } from "../RecordingPanel";
import { PlaybackSpeedPicker } from "../PlaybackSpeedPicker";
import { playPronunciation } from "../../lib/pronunciation";
import { useSettingsStore } from "../../stores/settingsStore";
import type { ContentRecord, Grade, PlaybackRate, Sched } from "../../types";

type Phase = "meaning" | "prompt" | "model";

interface Props {
  record: ContentRecord;
  phase: Phase;
  onPhase: (phase: Phase) => void;
  playbackRate: PlaybackRate;
  onPlaybackRate: (rate: PlaybackRate) => void;
  onGrade: (grade: Grade) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  sched?: Sched;
}

export function ConceptExplainCard({
  record,
  phase,
  onPhase,
  playbackRate,
  onPlaybackRate,
  onGrade,
  onPrev,
  onNext,
  canPrev,
  sched,
}: Props) {
  const { item } = record;
  const settings = useSettingsStore((s) => s.settings);
  const [error, setError] = useState<string | null>(null);
  const explain = item.explain;

  async function playText(text: string) {
    setError(null);
    try {
      await playPronunciation({
        item,
        text,
        source: "sentence",
        accent: settings.accent,
        workerUrl: settings.workerUrl,
        syncToken: settings.syncToken,
        playbackRate,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "再生に失敗しました");
    }
  }

  if (!explain) {
    return (
      <div className="rounded-xl bg-white p-6 text-slate-600 shadow-sm dark:bg-slate-900">
        この項目には explain データがありません。
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            {item.collection} · {item.themeName}
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{item.front}</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{item.meaning}</p>
        </div>
        <PlaybackSpeedPicker value={playbackRate} onChange={onPlaybackRate} />
      </div>

      {phase === "meaning" && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">意味を確認したら、英語で説明する練習へ進みます。</p>
          <button
            type="button"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
            onClick={() => onPhase("prompt")}
          >
            英語で説明する
          </button>
        </div>
      )}

      {phase === "prompt" && (
        <div className="space-y-4">
          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">問い（日本語）</p>
            <p className="mt-2 text-slate-800 dark:text-slate-200">{explain.prompt_ja}</p>
          </div>
          <p className="text-sm text-slate-500">口に出すか録音してから、模範解答を見てください。</p>
          <RecordingPanel
            itemId={item.id}
            label="自分の説明を録音"
            onCompareModel={() => playText(explain.model_en)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600"
              onClick={() => onPhase("meaning")}
            >
              戻る
            </button>
            <button
              type="button"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
              onClick={() => onPhase("model")}
            >
              模範を見る
            </button>
          </div>
        </div>
      )}

      {phase === "model" && (
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">模範（英語）</p>
            <p className="mt-2 leading-relaxed text-slate-900 dark:text-slate-100">{explain.model_en}</p>
            <button
              type="button"
              className="mt-3 rounded-lg border border-emerald-300 px-3 py-1.5 text-sm text-emerald-800 dark:border-emerald-700 dark:text-emerald-200"
              onClick={() => void playText(explain.model_en)}
            >
              🔊 模範を再生
            </button>
          </div>
          {item.examples?.[0] && (
            <button
              type="button"
              className="text-sm text-slate-600 underline dark:text-slate-400"
              onClick={() => void playText(item.examples![0].en)}
            >
              🔊 例文を再生
            </button>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {sched && (
            <p className="text-xs text-slate-500">
              復習 {sched.reps} 回 · あいまい {sched.maybeCount ?? 0} 回
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded bg-red-500 px-4 py-2 text-white" onClick={() => onGrade("forgot")}>
              忘れた (1)
            </button>
            <button type="button" className="rounded bg-amber-500 px-4 py-2 text-white" onClick={() => onGrade("maybe")}>
              あいまい (2)
            </button>
            <button
              type="button"
              className="rounded bg-emerald-600 px-4 py-2 text-white"
              onClick={() => onGrade("remembered")}
            >
              覚えてた (3)
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between border-t border-slate-200 pt-3 dark:border-slate-700">
        <button
          type="button"
          className="text-sm text-slate-600 disabled:opacity-40 dark:text-slate-400"
          disabled={!canPrev}
          onClick={onPrev}
        >
          ← 前へ
        </button>
        <button type="button" className="text-sm text-slate-600 dark:text-slate-400" onClick={onNext}>
          次へ →
        </button>
      </div>
    </div>
  );
}
