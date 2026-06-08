import { useRef, useState, type TouchEvent } from "react";
import { FlashcardAnswer } from "./FlashcardAnswer";
import { FlashcardPrompt } from "./FlashcardPrompt";
import { playPronunciation, type PronunciationSource } from "../lib/pronunciation";
import { useSettingsStore } from "../stores/settingsStore";
import type { ContentRecord, Grade, PlaybackRate, Sched, StudyContentMode, StudyDirection } from "../types";

interface Props {
  record: ContentRecord;
  revealed: boolean;
  direction: StudyDirection;
  contentMode: StudyContentMode;
  playbackRate: PlaybackRate;
  onPlaybackRate: (rate: PlaybackRate) => void;
  onReveal: () => void;
  onGrade: (grade: Grade) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  sched?: Sched;
}

const INTERACTIVE_SELECTOR = "button, select, input, textarea, a, label, [role='tab']";

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && !!target.closest(INTERACTIVE_SELECTOR);
}

export function FlashcardDeck({
  record,
  revealed,
  direction,
  contentMode,
  playbackRate,
  onPlaybackRate,
  onReveal,
  onGrade,
  onPrev,
  onNext,
  canPrev,
  sched,
}: Props) {
  const settings = useSettingsStore((s) => s.settings);
  const touchStart = useRef<{ x: number; y: number; fromInteractive: boolean } | null>(null);
  const [coarsePointer] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );
  const { item } = record;

  async function playText(text: string, source: PronunciationSource) {
    try {
      await playPronunciation({
        item,
        text,
        source,
        accent: settings.accent,
        workerUrl: settings.workerUrl,
        syncToken: settings.syncToken,
        playbackRate,
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : "発音再生に失敗しました");
    }
  }

  function onTouchStart(e: TouchEvent) {
    if (coarsePointer) return;
    if (isInteractiveTarget(e.target)) return;
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      fromInteractive: false,
    };
  }

  function onTouchEnd(e: TouchEvent) {
    if (coarsePointer || !touchStart.current) return;
    if (isInteractiveTarget(e.target)) {
      touchStart.current = null;
      return;
    }

    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const minSwipe = 72;

    if (absDx < minSwipe && absDy < minSwipe) return;

    if (absDy > absDx * 1.5 && dy < -minSwipe && !revealed) {
      onReveal();
      return;
    }

    if (absDx > absDy * 1.5 && absDx >= minSwipe) {
      if (dx < 0) onNext();
      else if (canPrev) onPrev();
    }
  }

  const exampleText = item.examples?.[0]?.en;
  const promptAudio =
    direction === "jp-to-en"
      ? item.meaning
      : exampleText ?? item.pron?.tts ?? item.front;
  const promptSource: PronunciationSource =
    direction === "jp-to-en" || !exampleText || promptAudio === item.front
      ? "word"
      : "sentence";

  return (
    <div
      className="grid min-w-0 gap-4 md:grid-cols-2"
      style={{ touchAction: coarsePointer ? "pan-y" : "manipulation" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <section
        className="min-w-0 max-w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        aria-label="問題"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">問題</h2>
        <FlashcardPrompt
          record={record}
          direction={direction}
          contentMode={contentMode}
          onPlayAudio={() => void playText(promptAudio, promptSource)}
        />
      </section>

      <section
        className="relative min-w-0 max-w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        aria-label="答え"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">答え</h2>
        {!revealed ? (
          <div className="mt-6 flex min-h-[200px] flex-col items-center justify-center">
            <div className="pointer-events-none select-none blur-md">
              <p className="text-2xl font-bold text-slate-400">••••••••</p>
              <p className="mt-2 text-slate-400">答えは隠れています</p>
            </div>
            <button
              type="button"
              className="mt-6 w-full max-w-xs rounded-xl bg-blue-600 px-6 py-3 text-lg font-medium text-white hover:bg-blue-700 active:bg-blue-800 md:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                onReveal();
              }}
            >
              答えを見る
            </button>
            {!coarsePointer && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Space / 上スワイプでも開けます
              </p>
            )}
          </div>
        ) : (
          <div className="mt-4 min-w-0 max-w-full motion-safe:animate-[fadeIn_0.2s_ease-out]">
            <FlashcardAnswer
              record={record}
              direction={direction}
              playbackRate={playbackRate}
              sched={sched}
              onPlaybackRate={onPlaybackRate}
              onPlayFront={() => void playText(item.pron?.tts ?? item.front, "word")}
              onPlayExample={() => {
                const sentence = item.examples?.[0]?.en?.trim();
                if (!sentence) return;
                void playText(sentence, "sentence");
              }}
            />
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 active:bg-rose-800"
                onClick={() => onGrade("forgot")}
              >
                忘れた (1)
              </button>
              <button
                type="button"
                className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 active:bg-amber-800"
                onClick={() => onGrade("maybe")}
              >
                あいまい (2)
              </button>
              <button
                type="button"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 active:bg-emerald-800"
                onClick={() => onGrade("remembered")}
              >
                覚えてた (3)
              </button>
            </div>
            <div className="mt-3 flex gap-2">
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
