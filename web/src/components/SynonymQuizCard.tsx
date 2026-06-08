import { useCallback, useEffect, useRef, useState, type FormEvent, type TouchEvent } from "react";
import { SynonymQuizFeedback } from "./SynonymQuizFeedback";
import { isAnswerCorrect } from "../lib/synonymQuiz";
import type { Grade, PlaybackRate, SynonymQuestion } from "../types";

const FORMAT_LABELS: Record<SynonymQuestion["format"], string> = {
  mcq: "言い換え選択",
  paraphrase: "パラフレーズ穴埋め",
  oddOneOut: "仲間外れ",
  production: "産出",
};

interface Props {
  question: SynonymQuestion;
  playbackRate: PlaybackRate;
  onPlayWord: (word: string) => void;
  onGrade: (grade: Grade) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
}

export function SynonymQuizCard({
  question,
  playbackRate,
  onPlayWord,
  onGrade,
  onPrev,
  onNext,
  canPrev,
}: Props) {
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [productionInput, setProductionInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const { item } = question.record;

  const submitChoice = useCallback(
    (index: number) => {
      if (answered) return;
      setSelectedIndex(index);
      setIsCorrect(isAnswerCorrect(question, index));
      setAnswered(true);
    },
    [answered, question],
  );

  function submitProduction(e?: FormEvent) {
    e?.preventDefault();
    if (answered) return;
    const trimmed = productionInput.trim();
    if (!trimmed) return;
    setIsCorrect(isAnswerCorrect(question, trimmed));
    setAnswered(true);
  }

  const handleGrade = useCallback(
    (grade: Grade) => {
      onGrade(grade);
      setAnswered(false);
      setSelectedIndex(null);
      setProductionInput("");
      setIsCorrect(false);
    },
    [onGrade],
  );

  function onTouchStart(e: TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function onTouchEnd(e: TouchEvent) {
    if (!touchStart.current || answered) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) onNext();
      else if (canPrev) onPrev();
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (!answered && question.options) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < question.options.length) {
          e.preventDefault();
          submitChoice(idx);
        }
      }

      if (answered) {
        if (e.key === "1") handleGrade("forgot");
        if (e.key === "2") handleGrade("maybe");
        if (e.key === "3") handleGrade("remembered");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, question.options, question.options?.length, submitChoice, handleGrade]);

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800 dark:bg-violet-900/50 dark:text-violet-200">
          {FORMAT_LABELS[question.format]}
        </span>
        <button
          type="button"
          className="rounded px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => onPlayWord(item.front)}
          aria-label={`${item.front} の発音`}
        >
          🔊 {item.front}
        </button>
      </div>

      <p className="whitespace-pre-line text-lg font-medium text-slate-800 dark:text-slate-100">
        {question.prompt}
      </p>

      {question.clozeSentence && question.format !== "production" && (
        <p className="mt-4 rounded-lg bg-slate-50 p-4 text-base italic dark:bg-slate-800/50">
          {question.clozeSentence}
        </p>
      )}

      {!answered && question.format === "production" && (
        <form className="mt-6 space-y-3" onSubmit={submitProduction}>
          {question.hintLetter && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ヒント: {question.hintLetter}...
            </p>
          )}
          <input
            type="text"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg dark:border-slate-600 dark:bg-slate-800"
            value={productionInput}
            onChange={(e) => setProductionInput(e.target.value)}
            placeholder="言い換えを入力"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
          >
            回答する (Enter)
          </button>
        </form>
      )}

      {!answered && question.options && (
        <div className="mt-6 grid gap-2">
          {question.options.map((option, idx) => (
            <div
              key={`${option}-${idx}`}
              role="button"
              tabIndex={0}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-left hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
              onClick={() => submitChoice(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  submitChoice(idx);
                }
              }}
            >
              <span>
                <span className="mr-2 font-mono text-slate-400">{idx + 1}.</span>
                {option}
              </span>
              <button
                type="button"
                className="rounded px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayWord(option);
                }}
                aria-label={`${option} の発音`}
              >
                🔊
              </button>
            </div>
          ))}
          <p className="text-xs text-slate-500 dark:text-slate-400">1〜4 キーでも選択できます</p>
        </div>
      )}

      {answered && (
        <SynonymQuizFeedback
          question={question}
          isCorrect={isCorrect}
          userAnswer={
            question.format === "production"
              ? productionInput
              : selectedIndex != null
                ? question.options?.[selectedIndex]
                : undefined
          }
          playbackRate={playbackRate}
          onPlayWord={onPlayWord}
          onGrade={handleGrade}
        />
      )}

      {!answered && (
        <div className="mt-4 flex gap-2">
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
      )}
    </div>
  );
}
