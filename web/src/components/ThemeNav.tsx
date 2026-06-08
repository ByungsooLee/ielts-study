import { useState } from "react";
import type { ItemType, ThemeRange } from "../types";
import { CATEGORY_STYLES, THEME_OTHER, type ThemeFilter } from "../lib/themes";

interface Props {
  category: ItemType;
  ranges: ThemeRange[];
  themeFilter: ThemeFilter;
  themeRangeMin: number | null;
  hasOther: boolean;
  onThemeFilter: (filter: ThemeFilter) => void;
  onThemeRange: (range: ThemeRange | null) => void;
}

export function ThemeNav({
  category,
  ranges,
  themeFilter,
  themeRangeMin,
  hasOther,
  onThemeFilter,
  onThemeRange,
}: Props) {
  const [open, setOpen] = useState(false);
  const style = CATEGORY_STYLES[category];

  const activeRange = themeRangeMin != null ? ranges.find((r) => r.min === themeRangeMin) : null;

  const rangeButtons = (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className={`rounded-lg px-3 py-1.5 text-sm ${themeFilter === "all" && !activeRange ? style.active : style.inactive}`}
        onClick={() => {
          onThemeRange(null);
          onThemeFilter("all");
        }}
      >
        全テーマ
      </button>
      {ranges.map((range) => (
        <button
          key={range.label}
          type="button"
          className={`rounded-lg px-3 py-1.5 text-sm ${activeRange?.min === range.min ? style.active : style.inactive}`}
          onClick={() => onThemeRange(range)}
        >
          {range.label}
        </button>
      ))}
      {hasOther && (
        <button
          type="button"
          className={`rounded-lg px-3 py-1.5 text-sm ${themeFilter === THEME_OTHER ? style.active : style.inactive}`}
          onClick={() => onThemeFilter(THEME_OTHER)}
        >
          その他
        </button>
      )}
    </div>
  );

  const themeButtons = activeRange ? (
    <div className="mt-2 flex flex-wrap gap-2">
      <button
        type="button"
        className={`rounded-lg px-3 py-1.5 text-sm ${themeFilter === "all" ? style.active : style.inactive}`}
        onClick={() => onThemeFilter("all")}
      >
        {activeRange.label} すべて
      </button>
      {activeRange.themes.map((t) => (
        <button
          key={t.num}
          type="button"
          title={t.name}
          className={`rounded-lg px-3 py-1.5 text-sm ${themeFilter === t.num ? style.active : style.inactive}`}
          onClick={() => onThemeFilter(t.num)}
        >
          {t.num}. {t.name}
        </button>
      ))}
    </div>
  ) : themeFilter !== "all" && themeFilter !== THEME_OTHER && typeof themeFilter === "number" ? (
    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
      テーマ {themeFilter} を選択中
    </p>
  ) : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">テーマ</p>
        <button
          type="button"
          className="rounded-lg border px-3 py-1.5 text-sm md:hidden dark:border-slate-600"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "閉じる" : "テーマ選択"}
        </button>
      </div>
      <div className={`${open ? "block" : "hidden"} mt-3 md:block`}>
        {rangeButtons}
        {themeButtons}
      </div>
    </div>
  );
}
