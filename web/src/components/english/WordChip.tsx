/**
 * 単語チップ。
 * - タップ本体 = WordDetailSheet を開く（意味/例文/音声/SRSを詳細シートで扱う）
 * - 色 = SRS の lastGrade から自動決定（未学習=slate / 忘れた=rose / あいまい=amber / 覚えてた=emerald）
 * - 音声・SRSはチップ本体に紐付けない（誤操作防止）
 */
import { srsColor, type SrsColor } from "../../lib/srs";
import { useProgressStore } from "../../stores/progressStore";
import { useWordPopoverStore } from "../../stores/wordPopoverStore";

interface Props {
  itemId: string;
  label: string;
  size?: "sm" | "md";
  /** インラインの `<em>` 相当。model_en 中でハイライトしたい語向け。 */
  inline?: boolean;
}

const COLOR_STYLE: Record<SrsColor, string> = {
  neutral:
    "border-slate-300 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:bg-blue-950",
  red:
    "border-rose-400 bg-rose-100 text-rose-900 hover:bg-rose-200 dark:border-rose-500 dark:bg-rose-900/50 dark:text-rose-100",
  yellow:
    "border-amber-400 bg-amber-100 text-amber-900 hover:bg-amber-200 dark:border-amber-500 dark:bg-amber-900/50 dark:text-amber-100",
  green:
    "border-emerald-400 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:border-emerald-500 dark:bg-emerald-900/50 dark:text-emerald-100",
};

const INLINE_STYLE: Record<SrsColor, string> = {
  neutral: "bg-yellow-100 text-slate-900 dark:bg-yellow-500/30 dark:text-slate-50",
  red: "bg-rose-200 text-rose-900 dark:bg-rose-800/60 dark:text-rose-100",
  yellow: "bg-amber-200 text-amber-900 dark:bg-amber-800/60 dark:text-amber-100",
  green: "bg-emerald-200 text-emerald-900 dark:bg-emerald-800/60 dark:text-emerald-100",
};

export function WordChip({ itemId, label, size = "sm", inline = false }: Props) {
  const open = useWordPopoverStore((s) => s.open);
  const sched = useProgressStore((s) => s.progress.srs[itemId]);
  const color = srsColor(sched);

  if (inline) {
    // モデル文中のハイライト用（<em>のような表示）
    return (
      <button
        type="button"
        className={`rounded px-1 not-italic font-semibold underline decoration-dotted underline-offset-2 ${INLINE_STYLE[color]}`}
        onClick={() => open(itemId)}
        title={`${label} — タップで意味`}
      >
        {label}
      </button>
    );
  }

  const padding = size === "md" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";
  return (
    <button
      type="button"
      className={`rounded-full border font-medium ${padding} ${COLOR_STYLE[color]}`}
      onClick={() => open(itemId)}
      aria-label={`${label} の意味を表示`}
    >
      {label}
    </button>
  );
}
