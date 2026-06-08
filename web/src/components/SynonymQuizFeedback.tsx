import type { Grade, PlaybackRate, SynonymQuestion } from "../types";
import { getDisplaySynonyms } from "../lib/synonymQuiz";

interface Props {
  question: SynonymQuestion;
  isCorrect: boolean;
  userAnswer?: string;
  playbackRate: PlaybackRate;
  onPlayWord: (word: string) => void;
  onGrade: (grade: Grade) => void;
}

export function SynonymQuizFeedback({
  question,
  isCorrect,
  userAnswer,
  onPlayWord,
  onGrade,
}: Props) {
  const { item } = question.record;
  const correctWord =
    question.format === "production"
      ? question.correctAnswers.join(" / ")
      : question.options?.[question.correctIndex ?? 0] ?? "";

  return (
    <div className="mt-6 space-y-4">
      <div
        className={`rounded-lg px-4 py-3 text-lg font-semibold ${
          isCorrect
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
            : "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200"
        }`}
      >
        {isCorrect ? "正解！" : "不正解"}
        {!isCorrect && userAnswer && (
          <p className="mt-1 text-sm font-normal">あなたの回答: {userAnswer}</p>
        )}
      </div>

      <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
        <p className="text-sm text-slate-500 dark:text-slate-400">見出し語</p>
        <p className="text-xl font-bold">{item.front}</p>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{item.meaning}</p>
      </div>

      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">言い換え一覧</p>
        <p className="mt-1 font-medium">{getDisplaySynonyms(item)}</p>
      </div>

      {question.format !== "production" && correctWord && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">正解:</span>
          <span className="font-semibold">{correctWord}</span>
          <button
            type="button"
            className="rounded px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={() => onPlayWord(correctWord)}
            aria-label={`${correctWord} の発音`}
          >
            🔊
          </button>
        </div>
      )}

      {question.exampleEn && (
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">例文</p>
          <p className="mt-1 italic text-slate-700 dark:text-slate-300">{question.exampleEn}</p>
        </div>
      )}

      <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">覚えている度合いを選んでください</p>
        <div className="flex flex-wrap gap-2">
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
      </div>
    </div>
  );
}
