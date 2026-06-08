import { useState } from "react";
import { matchClozeAnswer } from "../../lib/grammarCloze";
import type { GrammarCloze, Grade } from "../../types";

interface Props {
  cloze: GrammarCloze;
  onGrade?: (grade: Grade) => void;
  compact?: boolean;
}

export function GrammarClozePanel({ cloze, onGrade, compact = false }: Props) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const correct = submitted && matchClozeAnswer(input, cloze.a);

  function submit() {
    if (submitted) return;
    setSubmitted(true);
    if (onGrade) {
      onGrade(matchClozeAnswer(input, cloze.a) ? "remembered" : "forgot");
    }
  }

  function reset() {
    setInput("");
    setSubmitted(false);
  }

  const displayQ = cloze.q.replace(/___/g, "______");

  return (
    <div
      className={`min-w-0 space-y-3 rounded-lg border border-violet-200 bg-violet-50/50 p-4 dark:border-violet-900 dark:bg-violet-950/30 ${
        compact ? "" : "mt-4"
      }`}
    >
      <p className="text-sm font-medium text-violet-900 dark:text-violet-200">穴埋めクイズ</p>
      <p className="break-words text-base leading-relaxed text-slate-800 [overflow-wrap:anywhere] dark:text-slate-200">
        {displayQ}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={input}
          disabled={submitted}
          placeholder="答えを入力"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base dark:border-slate-600 dark:bg-slate-800"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        {!submitted ? (
          <button
            type="button"
            className="rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700"
            onClick={submit}
          >
            送信
          </button>
        ) : (
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
            onClick={reset}
          >
            もう一度
          </button>
        )}
      </div>
      {submitted && (
        <div
          className={`rounded-lg p-3 text-sm ${
            correct
              ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
          }`}
        >
          {correct ? (
            <p>正解です。</p>
          ) : (
            <>
              <p>不正解です。</p>
              {cloze.hint && (
                <p className="mt-1">
                  <span className="font-medium">ヒント: </span>
                  {cloze.hint}
                </p>
              )}
              <p className="mt-1">
                <span className="font-medium">正解: </span>
                {cloze.a === "(なし)" ? "（空欄のまま）" : cloze.a}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
