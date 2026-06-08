import { useEffect, useMemo, useState } from "react";
import type { ContentRecord, ItemType, ThemeRange } from "../types";
import {
  CATEGORY_STYLES,
  THEME_OTHER,
  collectThemeStats,
  countOtherThemeItems,
  getThemeSelectionLabel,
  getVisibleThemes,
  needsThemeRangeNav,
  type ThemeFilter,
} from "../lib/themes";

interface Props {
  category: ItemType;
  records: ContentRecord[];
  ranges: ThemeRange[];
  themeFilter: ThemeFilter;
  themeRangeMin: number | null;
  hasOther: boolean;
  onThemeFilter: (filter: ThemeFilter) => void;
  onThemeRange: (range: ThemeRange | null) => void;
}

type SelectionItem = { kind: "all" } | { kind: "theme"; num: number } | { kind: "other" };

export function ThemeNav({
  category,
  records,
  ranges,
  themeFilter,
  themeRangeMin,
  hasOther,
  onThemeFilter,
  onThemeRange,
}: Props) {
  const [open, setOpen] = useState(true);
  const style = CATEGORY_STYLES[category];

  const stats = useMemo(() => collectThemeStats(records, category), [records, category]);
  const showRangeNav = needsThemeRangeNav(stats);
  const visibleStats = useMemo(
    () => getVisibleThemes(stats, ranges, themeRangeMin),
    [stats, ranges, themeRangeMin],
  );
  const otherCount = useMemo(() => countOtherThemeItems(records, category), [records, category]);
  const selectionLabel = getThemeSelectionLabel(themeFilter, stats, visibleStats, otherCount);

  const activeRange = themeRangeMin != null ? ranges.find((r) => r.min === themeRangeMin) : null;

  const selectionItems = useMemo((): SelectionItem[] => {
    const items: SelectionItem[] = [{ kind: "all" }];
    for (const t of visibleStats) {
      items.push({ kind: "theme", num: t.num });
    }
    if (hasOther) items.push({ kind: "other" });
    return items;
  }, [visibleStats, hasOther]);

  function applySelection(item: SelectionItem) {
    if (item.kind === "all") {
      onThemeFilter("all");
      return;
    }
    if (item.kind === "other") {
      onThemeRange(null);
      onThemeFilter(THEME_OTHER);
      return;
    }
    onThemeFilter(item.num);
  }

  function moveSelection(delta: number) {
    const currentIdx = selectionItems.findIndex((item) => {
      if (themeFilter === "all" && item.kind === "all") return true;
      if (themeFilter === THEME_OTHER && item.kind === "other") return true;
      if (typeof themeFilter === "number" && item.kind === "theme" && item.num === themeFilter) return true;
      return false;
    });
    const base = currentIdx >= 0 ? currentIdx : 0;
    const next = (base + delta + selectionItems.length) % selectionItems.length;
    applySelection(selectionItems[next]);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const numKey = e.key === "0" ? 10 : parseInt(e.key, 10);
      if (numKey >= 1 && numKey <= 9) {
        const target = visibleStats.find((t) => t.num === numKey);
        if (target) {
          e.preventDefault();
          onThemeFilter(numKey);
        }
        return;
      }
      if (e.key === "0") {
        const target = visibleStats.find((t) => t.num === 10);
        if (target) {
          e.preventDefault();
          onThemeFilter(10);
        }
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        moveSelection(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveSelection(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visibleStats, selectionItems, themeFilter, onThemeFilter, onThemeRange]);

  const allActive = themeFilter === "all";
  const allCount = visibleStats.reduce((sum, t) => sum + t.count, 0);

  if (!stats.length) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">テーマ番号がありません</p>
        <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
          教材に <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">theme</code> /{" "}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">themeName</code>{" "}
          が含まれていません。設定の「今すぐ同期」または{" "}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">npm run content:push</code>{" "}
          で最新教材を反映してください。
        </p>
      </div>
    );
  }

  const panel = (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectionLabel}</p>

      {showRangeNav && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="テーマレンジ">
          {ranges.map((range) => (
            <button
              key={range.label}
              type="button"
              role="tab"
              aria-selected={activeRange?.min === range.min}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                activeRange?.min === range.min ? style.active : style.inactive
              }`}
              onClick={() => onThemeRange(range)}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      <div
        className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible lg:grid-cols-6"
        role="group"
        aria-label="テーマ番号"
      >
        <button
          type="button"
          aria-pressed={allActive}
          aria-label={`全部 ${allCount}語`}
          className={`relative flex min-w-[4.5rem] shrink-0 flex-col items-center rounded-xl px-3 py-3 transition-colors ${
            allActive ? `${style.active} ${style.ring}` : style.inactive
          }`}
          onClick={() => onThemeFilter("all")}
        >
          <span className="text-lg font-bold leading-none">全部</span>
          <span className={`mt-1 rounded-full px-1.5 py-0.5 text-xs ${style.badge}`}>{allCount}</span>
        </button>

        {visibleStats.map((t) => {
          const pressed = themeFilter === t.num;
          return (
            <button
              key={t.num}
              type="button"
              aria-pressed={pressed}
              aria-label={`テーマ${t.num} ${t.name} ${t.count}語`}
              title={t.name}
              className={`relative flex min-w-[4.5rem] shrink-0 flex-col items-center rounded-xl px-2 py-3 transition-colors ${
                pressed ? `${style.active} ${style.ring}` : style.inactive
              }`}
              onClick={() => onThemeFilter(t.num)}
            >
              <span
                className={`absolute right-1 top-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  pressed ? "bg-white/20 text-white" : style.badge
                }`}
              >
                {t.count}
              </span>
              <span className="text-2xl font-bold leading-none">{t.num}</span>
              <span
                className={`mt-1 max-w-full truncate text-center text-[10px] leading-tight ${
                  pressed ? "text-white/90" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {t.name}
              </span>
            </button>
          );
        })}
      </div>

      {hasOther && (
        <button
          type="button"
          aria-pressed={themeFilter === THEME_OTHER}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            themeFilter === THEME_OTHER ? style.active : style.inactive
          }`}
          onClick={() => {
            onThemeRange(null);
            onThemeFilter(THEME_OTHER);
          }}
        >
          その他（{otherCount}語）
        </button>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        数字キー 1–9・0（10）で選択、←→ で移動
      </p>
    </div>
  );

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
      <div className={`mt-3 ${open ? "block" : "hidden md:block"}`}>{panel}</div>
    </div>
  );
}
