/**
 * SM-2 の3段階採点ボタン（忘れた/あいまい/覚えてた）。
 * ラベル/色は既存 Flashcard と揃える（rose/amber/emerald）。
 * onGrade は grade を受け取る callback。同期でも非同期でもよい。
 */
import { useProgressStore } from "../../stores/progressStore";
import { srsColor, type SrsColor } from "../../lib/srs";
import type { Grade } from "../../types";

interface Props {
  itemId: string;
  size?: "sm" | "md";
  onGraded?: (grade: Grade) => void;
  /** ボタンだけでなく現状色バッジも表示する（false ならボタンだけ） */
  showState?: boolean;
}

const STATE_LABEL: Record<SrsColor, string> = {
  neutral: "未学習",
  red: "忘れた",
  yellow: "あいまい",
  green: "覚えてた",
};

const STATE_STYLE: Record<SrsColor, string> = {
  neutral: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  red: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-100",
  yellow: "bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100",
  green: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100",
};

export function SrsGradeButtons({ itemId, size = "sm", onGraded, showState = false }: Props) {
  const gradeItem = useProgressStore((s) => s.gradeItem);
  const sched = useProgressStore((s) => s.progress.srs[itemId]);
  const color = srsColor(sched);

  const padding = size === "md" ? "px-3 py-1.5 text-sm" : "px-2 py-1 text-xs";

  function handle(grade: Grade) {
    gradeItem(itemId, grade);
    onGraded?.(grade);
  }

  return (
    <div className="inline-flex items-center gap-1">
      {showState && (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATE_STYLE[color]}`}
          aria-label={`定着度: ${STATE_LABEL[color]}`}
          title={`定着度: ${STATE_LABEL[color]}`}
        >
          {STATE_LABEL[color]}
        </span>
      )}
      <button
        type="button"
        className={`rounded-md font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 ${padding}`}
        onClick={() => handle("forgot")}
        aria-label="忘れた"
      >
        忘れた
      </button>
      <button
        type="button"
        className={`rounded-md font-semibold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 ${padding}`}
        onClick={() => handle("maybe")}
        aria-label="あいまい"
      >
        あいまい
      </button>
      <button
        type="button"
        className={`rounded-md font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 ${padding}`}
        onClick={() => handle("remembered")}
        aria-label="覚えてた"
      >
        覚えてた
      </button>
    </div>
  );
}
