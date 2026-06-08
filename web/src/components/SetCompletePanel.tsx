interface Props {
  total: number;
  streak: number;
  onRestart: () => void;
}

export function SetCompletePanel({ total, streak, onRestart }: Props) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-800 dark:bg-emerald-950/40">
      <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">セット完了！</p>
      <p className="mt-2 text-slate-700 dark:text-slate-300">{total} 枚を学習しました。</p>
      {streak > 0 && (
        <p className="mt-2 text-lg text-amber-700 dark:text-amber-300">🔥 {streak} 日連続学習中</p>
      )}
      <button
        type="button"
        className="mt-6 rounded-lg bg-emerald-600 px-6 py-2.5 text-white hover:bg-emerald-700"
        onClick={onRestart}
      >
        もう一度
      </button>
    </div>
  );
}
