import { useState } from "react";
import type { GrammarDrill, Grade } from "../../types";

interface Props {
  drill: GrammarDrill;
  drillNum: number;
  drillTotal: number;
  revealed: boolean;
  onReveal: () => void;
  onGrade: (grade: Grade) => void;
}

export function GrammarDrillPanel({
  drill,
  drillNum,
  drillTotal,
  revealed,
  onReveal,
  onGrade,
}: Props) {
  const [draft, setDraft] = useState("");
  const wrap = "min-w-0 break-words [overflow-wrap:anywhere]";

  return (
    <div className="min-w-0 space-y-4 rounded-xl border border-violet-200 bg-violet-50/40 p-4 dark:border-violet-900/60 dark:bg-violet-950/20">
      <p className="text-xs font-medium text-violet-800 dark:text-violet-300">
        ドリル {drillNum} / {drillTotal}
      </p>
      <p className={`text-xl font-bold leading-relaxed text-slate-900 dark:text-slate-50 md:text-2xl ${wrap}`}>
        {drill.jp}
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-400">英語にすると？（頭の中でもOK）</p>

      <textarea
        value={draft}
        rows={2}
        placeholder="任意：ここに英作文を入力"
        className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-base dark:border-slate-600 dark:bg-slate-800"
        onChange={(e) => setDraft(e.target.value)}
      />

      {!revealed ? (
        <button
          type="button"
          className="w-full rounded-xl bg-violet-600 px-6 py-3 text-lg font-medium text-white hover:bg-violet-700 sm:w-auto"
          onClick={onReveal}
        >
          モデル訳を見る
        </button>
      ) : (
        <div className="space-y-3 motion-safe:animate-[fadeIn_0.2s_ease-out]">
          <div className={`rounded-lg bg-white p-3 dark:bg-slate-900 ${wrap}`}>
            <p className="text-sm text-slate-500">モデル英訳</p>
            <p className="mt-1 text-lg font-medium leading-relaxed text-slate-900 dark:text-slate-100">
              {drill.en}
            </p>
          </div>
          <p className={`text-sm text-slate-700 dark:text-slate-300 ${wrap}`}>
            <span className="font-medium text-violet-700 dark:text-violet-300">ポイント: </span>
            {drill.point}
          </p>
          {drill.ng && (
            <p className={`rounded-lg bg-rose-50 p-3 text-sm text-rose-900 dark:bg-rose-950/40 dark:text-rose-200 ${wrap}`}>
              <span className="font-medium">やりがち: </span>
              {drill.ng}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              className="rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
              onClick={() => onGrade("forgot")}
            >
              言えなかった
            </button>
            <button
              type="button"
              className="rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
              onClick={() => onGrade("maybe")}
            >
              あいまい
            </button>
            <button
              type="button"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              onClick={() => onGrade("remembered")}
            >
              言えた
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
