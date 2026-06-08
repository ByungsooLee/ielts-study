import { useCallback } from "react";
import { GrammarClozePanel } from "./GrammarClozePanel";
import { PlaybackSpeedPicker } from "../PlaybackSpeedPicker";
import { playPronunciation } from "../../lib/pronunciation";
import { daysUntilDue } from "../../lib/sm2";
import { todayDay } from "../../lib/srs";
import { useSettingsStore } from "../../stores/settingsStore";
import type { ContentRecord, Grade, PlaybackRate, Sched } from "../../types";

interface Props {
  record: ContentRecord;
  revealed: boolean;
  playbackRate: PlaybackRate;
  sched?: Sched;
  quizOpen: boolean;
  onPlaybackRate: (rate: PlaybackRate) => void;
  onReveal: () => void;
  onGrade: (grade: Grade) => void;
  onPrev: () => void;
  onNext: () => void;
  onQuizOpen: (open: boolean) => void;
  canPrev: boolean;
}

export function GrammarCard({
  record,
  revealed,
  playbackRate,
  sched,
  quizOpen,
  onPlaybackRate,
  onReveal,
  onGrade,
  onPrev,
  onNext,
  onQuizOpen,
  canPrev,
}: Props) {
  const settings = useSettingsStore((s) => s.settings);
  const { item } = record;
  const today = todayDay();
  const nextDays = sched ? daysUntilDue(sched, today) : null;
  const wrapText = "min-w-0 break-words [overflow-wrap:anywhere]";

  const playText = useCallback(
    async (text: string) => {
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
        alert(e instanceof Error ? e.message : "発音再生に失敗しました");
      }
    },
    [item, settings, playbackRate],
  );

  const hasCloze = (item.cloze?.length ?? 0) > 0;

  return (
    <div className="grid min-w-0 gap-4 md:grid-cols-2">
      <section
        className="min-w-0 max-w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        aria-label="問題"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">問題</h2>
        <div className="mt-3 min-w-0">
          <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-800 dark:bg-violet-900 dark:text-violet-200">
            {item.themeName ?? "文法"}
          </span>
          <p className={`mt-4 text-xl font-bold leading-snug text-slate-900 dark:text-slate-50 md:text-2xl ${wrapText}`}>
            {item.front}
          </p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">ルールの意味を思い出してから答えを開いてください</p>
        </div>
      </section>

      <section
        className="relative min-w-0 max-w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        aria-label="答え"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">答え</h2>
        {!revealed ? (
          <div className="mt-6 flex min-h-[200px] flex-col items-center justify-center">
            <button
              type="button"
              className="w-full max-w-xs rounded-xl bg-violet-600 px-6 py-3 text-lg font-medium text-white hover:bg-violet-700 md:w-auto"
              onClick={onReveal}
            >
              答えを見る
            </button>
          </div>
        ) : (
          <div className="mt-4 min-w-0 max-w-full space-y-3">
            <p className={`text-lg leading-relaxed text-slate-800 dark:text-slate-200 ${wrapText}`}>
              <span className="text-sm font-medium text-slate-500">説明: </span>
              {item.meaning}
            </p>
            {item.ielts && (
              <p className={`rounded-lg bg-blue-50 p-3 text-sm leading-relaxed text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 ${wrapText}`}>
                <span className="font-medium">IELTS活用: </span>
                {item.ielts}
              </p>
            )}
            {item.note && (
              <p className={`rounded-lg bg-rose-50 p-3 text-sm leading-relaxed text-rose-900 dark:bg-rose-950/40 dark:text-rose-200 ${wrapText}`}>
                <span className="font-medium">注意: </span>
                {item.note}
              </p>
            )}
            {item.examples?.map((ex, idx) => (
              <div key={idx} className="min-w-0 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
                <p className={`text-base leading-relaxed text-slate-800 dark:text-slate-200 ${wrapText}`}>{ex.en}</p>
                {ex.jp && (
                  <p className={`mt-1 text-sm text-slate-600 dark:text-slate-400 ${wrapText}`}>{ex.jp}</p>
                )}
                <button
                  type="button"
                  className="mt-2 rounded-lg border border-slate-300 px-3 py-1 text-sm dark:border-slate-600"
                  onClick={() => void playText(ex.en)}
                >
                  🔊 例文
                </button>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-2">
              <PlaybackSpeedPicker value={playbackRate} onChange={onPlaybackRate} />
              {item.pron?.tts && (
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
                  onClick={() => void playText(item.pron!.tts!)}
                >
                  🔊 TTS
                </button>
              )}
            </div>

            {hasCloze && (
              <button
                type="button"
                className="rounded-lg bg-violet-100 px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-200 dark:bg-violet-900 dark:text-violet-100"
                onClick={() => onQuizOpen(!quizOpen)}
              >
                {quizOpen ? "クイズを閉じる" : `クイズ (${item.cloze!.length}問)`}
              </button>
            )}

            {quizOpen && item.cloze?.[0] && (
              <GrammarClozePanel cloze={item.cloze[0]} onGrade={onGrade} compact />
            )}
            {quizOpen && item.cloze && item.cloze.length > 1 && (
              <div className="space-y-3">
                {item.cloze.slice(1).map((c, idx) => (
                  <GrammarClozePanel key={idx} cloze={c} onGrade={onGrade} compact />
                ))}
              </div>
            )}

            {sched && sched.status !== "new" && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                次回まで {nextDays} 日 / interval {sched.interval} 日
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
                onClick={() => onGrade("forgot")}
              >
                忘れた (1)
              </button>
              <button
                type="button"
                className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                onClick={() => onGrade("maybe")}
              >
                あいまい (2)
              </button>
              <button
                type="button"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                onClick={() => onGrade("remembered")}
              >
                覚えてた (3)
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!canPrev}
                className="rounded border px-3 py-1.5 text-sm disabled:opacity-40 dark:border-slate-600"
                onClick={onPrev}
              >
                ← 前へ
              </button>
              <button
                type="button"
                className="rounded border px-3 py-1.5 text-sm dark:border-slate-600"
                onClick={onNext}
              >
                次へ →
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
