interface Props {
  current: number;
  total: number;
  dueCount?: number;
  reviewCount?: number;
  newCount?: number;
  streak?: number;
}

export function StudyProgressBar({ current, total, dueCount, reviewCount, newCount, streak }: Props) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  const dueLabel =
    reviewCount != null && newCount != null
      ? `今日の復習 ${dueCount ?? total}件（復習${reviewCount}＋新規${newCount}）`
      : dueCount != null
        ? `今日の復習 ${dueCount} 件`
        : null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600 dark:text-slate-400">
        <span>
          {current} / {total} 枚
        </span>
        <div className="flex gap-3">
          {dueLabel && <span>{dueLabel}</span>}
          {streak != null && streak > 0 && <span>🔥 {streak} 日連続</span>}
        </div>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300 motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
