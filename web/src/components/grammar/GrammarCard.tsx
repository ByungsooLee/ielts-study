import { useCallback } from "react";
import { GrammarClozePanel } from "./GrammarClozePanel";
import { GrammarDrillPanel } from "./GrammarDrillPanel";
import { PlaybackSpeedPicker } from "../PlaybackSpeedPicker";
import { playPronunciation } from "../../lib/pronunciation";
import { daysUntilDue } from "../../lib/sm2";
import { todayDay } from "../../lib/srs";
import { useSettingsStore } from "../../stores/settingsStore";
import type { ContentRecord, Grade, PlaybackRate, Sched } from "../../types";

interface Props {
  record: ContentRecord;
  drillIndex: number;
  drillRevealed: boolean;
  moreOpen: boolean;
  clozeOpen: boolean;
  playbackRate: PlaybackRate;
  sched?: Sched;
  onPlaybackRate: (rate: PlaybackRate) => void;
  onRevealDrill: () => void;
  onGrade: (grade: Grade) => void;
  onPrev: () => void;
  onNext: () => void;
  onMoreOpen: (open: boolean) => void;
  onClozeOpen: (open: boolean) => void;
  canPrev: boolean;
}

export function GrammarCard({
  record,
  drillIndex,
  drillRevealed,
  moreOpen,
  clozeOpen,
  playbackRate,
  sched,
  onPlaybackRate,
  onRevealDrill,
  onGrade,
  onPrev,
  onNext,
  onMoreOpen,
  onClozeOpen,
  canPrev,
}: Props) {
  const settings = useSettingsStore((s) => s.settings);
  const { item } = record;
  const today = todayDay();
  const nextDays = sched ? daysUntilDue(sched, today) : null;
  const wrap = "min-w-0 break-words [overflow-wrap:anywhere]";

  const drills = item.drill ?? [];
  const currentDrill = drills[drillIndex];
  const hasCloze = (item.cloze?.length ?? 0) > 0;

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

  return (
    <div className="min-w-0 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="min-w-0">
        <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-800 dark:bg-violet-900 dark:text-violet-200">
          {item.themeName ?? "文法"}
        </span>
        <p className={`mt-3 text-lg font-bold leading-snug text-slate-900 dark:text-slate-50 md:text-xl ${wrap}`}>
          {item.front}
        </p>
        {item.tip && (
          <p className={`mt-2 rounded-lg bg-amber-50 p-3 text-sm leading-relaxed text-amber-950 dark:bg-amber-950/30 dark:text-amber-100 ${wrap}`}>
            <span className="font-medium">コツ: </span>
            {item.tip}
          </p>
        )}
      </div>

      {currentDrill ? (
        <GrammarDrillPanel
          key={`${item.id}-${drillIndex}`}
          drill={currentDrill}
          drillNum={drillIndex + 1}
          drillTotal={drills.length}
          revealed={drillRevealed}
          onReveal={onRevealDrill}
          onGrade={onGrade}
        />
      ) : (
        <div className={`rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-400 ${wrap}`}>
          ドリルがありません。「もっと知る」で参照情報を確認してください。
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
          onClick={() => onMoreOpen(!moreOpen)}
        >
          {moreOpen ? "もっと知るを閉じる" : "もっと知る"}
        </button>
        {hasCloze && (
          <button
            type="button"
            className="rounded-lg bg-violet-100 px-3 py-1.5 text-sm font-medium text-violet-900 dark:bg-violet-900 dark:text-violet-100"
            onClick={() => onClozeOpen(!clozeOpen)}
          >
            {clozeOpen ? "穴埋めを閉じる" : `穴埋めクイズ (${item.cloze!.length})`}
          </button>
        )}
      </div>

      {moreOpen && (
        <div className="min-w-0 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
          {item.meaning && (
            <p className={`text-sm leading-relaxed text-slate-800 dark:text-slate-200 ${wrap}`}>
              <span className="font-medium text-slate-500">説明: </span>
              {item.meaning}
            </p>
          )}
          {item.ielts && (
            <p className={`rounded-lg bg-blue-50 p-3 text-sm leading-relaxed text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 ${wrap}`}>
              <span className="font-medium">IELTS活用: </span>
              {item.ielts}
            </p>
          )}
          {item.note && (
            <p className={`rounded-lg bg-rose-50 p-3 text-sm leading-relaxed text-rose-900 dark:bg-rose-950/40 dark:text-rose-200 ${wrap}`}>
              <span className="font-medium">注意: </span>
              {item.note}
            </p>
          )}
          {item.examples?.map((ex, idx) => (
            <div key={idx} className="min-w-0 rounded-lg bg-white p-3 dark:bg-slate-900/60">
              <p className={`text-sm leading-relaxed text-slate-800 dark:text-slate-200 ${wrap}`}>{ex.en}</p>
              {ex.jp && <p className={`mt-1 text-xs text-slate-600 dark:text-slate-400 ${wrap}`}>{ex.jp}</p>}
              <button
                type="button"
                className="mt-2 rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
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
        </div>
      )}

      {clozeOpen && item.cloze && (
        <div className="space-y-3">
          {item.cloze.map((c, idx) => (
            <GrammarClozePanel key={idx} cloze={c} compact />
          ))}
        </div>
      )}

      {sched && sched.status !== "new" && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          次回まで {nextDays} 日 / interval {sched.interval} 日
        </p>
      )}

      <div className="flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
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
  );
}
