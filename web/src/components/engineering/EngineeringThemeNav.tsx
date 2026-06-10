import { useState } from "react";
import type { EngineeringSelection, EngineeringThemeChip } from "../../lib/staticContent";

interface Props {
  chips: EngineeringThemeChip[];
  selected: EngineeringSelection;
  onSelect: (selection: EngineeringSelection) => void;
}

function chipKey(chip: EngineeringThemeChip): string {
  return `${chip.collectionId}:${chip.theme}`;
}

export function EngineeringThemeNav({ chips, selected, onSelect }: Props) {
  const [open, setOpen] = useState(true);
  const allCount = chips.reduce((sum, c) => sum + c.count, 0);
  const allActive = selected === null;

  if (!chips.length) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">ジャンルがありません</p>
        <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
          index.json に engineering コレクションの themes を追加してください。
        </p>
      </div>
    );
  }

  const activeLabel = selected
    ? chips.find((c) => c.collectionId === selected.collectionId && c.theme === selected.theme)?.themeName ??
      "選択中"
    : `全部（${allCount}件）`;

  const panel = (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{activeLabel}</p>
      <div
        className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
        role="group"
        aria-label="ジャンル"
      >
        <button
          type="button"
          aria-pressed={allActive}
          className={`relative flex shrink-0 flex-col items-center rounded-xl px-3 py-3 transition-colors min-w-[5rem] ${
            allActive
              ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
              : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900"
          }`}
          onClick={() => onSelect(null)}
        >
          <span className="text-lg font-bold leading-none">全部</span>
          <span
            className={`mt-1 rounded-full px-1.5 py-0.5 text-xs ${
              allActive ? "bg-white/20 text-white" : "bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100"
            }`}
          >
            {allCount}
          </span>
        </button>

        {chips.map((chip) => {
          const pressed =
            selected?.collectionId === chip.collectionId && selected.theme === chip.theme;
          return (
            <button
              key={chipKey(chip)}
              type="button"
              aria-pressed={pressed}
              title={chip.collectionName}
              className={`relative flex shrink-0 flex-col items-center rounded-xl px-2 py-3 transition-colors min-w-[5.5rem] max-w-[10rem] ${
                pressed
                  ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900"
              }`}
              onClick={() => onSelect({ collectionId: chip.collectionId, theme: chip.theme })}
            >
              <span
                className={`absolute right-1 top-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  pressed ? "bg-white/20 text-white" : "bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100"
                }`}
              >
                {chip.count}
              </span>
              <span className="px-1 text-center text-sm font-bold leading-tight">{chip.themeName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">ジャンル</p>
        <button
          type="button"
          className="rounded-lg border px-3 py-1.5 text-sm md:hidden dark:border-slate-600"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "閉じる" : "ジャンル選択"}
        </button>
      </div>
      <div className={`mt-3 ${open ? "block" : "hidden md:block"}`}>{panel}</div>
    </div>
  );
}
