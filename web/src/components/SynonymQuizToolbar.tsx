import type { ReactNode } from "react";
import type { DeckSort } from "../types";

interface Props {
  sort: DeckSort;
  hardOnly: boolean;
  poolSize: number;
  onSort: (s: DeckSort) => void;
  onHardOnly: (v: boolean) => void;
  onShuffle: () => void;
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`rounded-lg px-3 py-1.5 text-sm ${
        active
          ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function SynonymQuizToolbar({
  sort,
  hardOnly,
  poolSize,
  onSort,
  onHardOnly,
  onShuffle,
}: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-violet-700 dark:text-violet-300">類義語クイズ（単語・言い換え選択）</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          対象 {poolSize} 語 · エンドレス
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <ToggleBtn active={sort === "random"} onClick={() => onSort("random")}>
          ランダム
        </ToggleBtn>
        <ToggleBtn active={sort === "asc"} onClick={() => onSort("asc")}>
          昇順
        </ToggleBtn>
        <button
          type="button"
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          onClick={onShuffle}
        >
          シャッフル
        </button>
        <ToggleBtn active={hardOnly} onClick={() => onHardOnly(!hardOnly)}>
          苦手だけ
        </ToggleBtn>
      </div>
    </div>
  );
}
