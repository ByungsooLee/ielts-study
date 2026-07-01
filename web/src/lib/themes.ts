import type { ContentRecord, ItemType, ThemeInfo, ThemeRange, ThemeStat } from "../types";

export const THEME_OTHER = "other" as const;
export type ThemeFilter = number | typeof THEME_OTHER | "all";

export const CATEGORY_LABELS: Record<ItemType, string> = {
  word: "単語",
  phrase: "構文",
  grammar: "文法",
  conversation: "会話",
  concept: "概念",
  interview: "面接",
  "task1-word": "図解描写",
  "writing-word": "意見(W)",
  "speaking-word": "意見(S)",
};

export const CATEGORY_STYLES: Record<
  ItemType,
  { active: string; inactive: string; ring: string; badge: string }
> = {
  word: {
    active: "bg-blue-600 text-white",
    inactive: "bg-blue-50 text-blue-800 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900",
    ring: "ring-2 ring-blue-400",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  phrase: {
    active: "bg-emerald-600 text-white",
    inactive: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900",
    ring: "ring-2 ring-emerald-400",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  grammar: {
    active: "bg-violet-600 text-white",
    inactive: "bg-violet-50 text-violet-800 hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-200 dark:hover:bg-violet-900",
    ring: "ring-2 ring-violet-400",
    badge: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  },
  conversation: {
    active: "bg-orange-600 text-white",
    inactive: "bg-orange-50 text-orange-800 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-200 dark:hover:bg-orange-900",
    ring: "ring-2 ring-orange-400",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  concept: {
    active: "bg-teal-600 text-white",
    inactive: "bg-teal-50 text-teal-800 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-200 dark:hover:bg-teal-900",
    ring: "ring-2 ring-teal-400",
    badge: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  },
  interview: {
    active: "bg-rose-600 text-white",
    inactive: "bg-rose-50 text-rose-800 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-200 dark:hover:bg-rose-900",
    ring: "ring-2 ring-rose-400",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
  },
  "task1-word": {
    active: "bg-sky-600 text-white",
    inactive: "bg-sky-50 text-sky-800 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-200 dark:hover:bg-sky-900",
    ring: "ring-2 ring-sky-400",
    badge: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  },
  "writing-word": {
    active: "bg-indigo-600 text-white",
    inactive: "bg-indigo-50 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-200 dark:hover:bg-indigo-900",
    ring: "ring-2 ring-indigo-400",
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  "speaking-word": {
    active: "bg-fuchsia-600 text-white",
    inactive: "bg-fuchsia-50 text-fuchsia-800 hover:bg-fuchsia-100 dark:bg-fuchsia-950 dark:text-fuchsia-200 dark:hover:bg-fuchsia-900",
    ring: "ring-2 ring-fuchsia-400",
    badge: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200",
  },
};

function isVocabType(type: ItemType) {
  return type === "word" || type === "phrase";
}

/** 単語ページ用：word + phrase をテーマごとに集計 */
export function collectThemeVocabStats(records: ContentRecord[]): ThemeStat[] {
  const map = new Map<number, { name: string; count: number }>();
  for (const { item } of records) {
    if (!isVocabType(item.type) || !item.theme) continue;
    const existing = map.get(item.theme);
    if (existing) {
      existing.count += 1;
      if (item.themeName) existing.name = item.themeName;
    } else {
      map.set(item.theme, {
        name: item.themeName ?? `テーマ${item.theme}`,
        count: 1,
      });
    }
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([num, { name, count }]) => ({ num, name, count }));
}

export function collectThemeVocabThemes(records: ContentRecord[]): ThemeInfo[] {
  return collectThemeVocabStats(records).map(({ num, name }) => ({ num, name }));
}

export function countOtherVocabItems(records: ContentRecord[]): number {
  return records.filter((r) => isVocabType(r.item.type) && !r.item.theme).length;
}

export function hasOtherVocabItems(records: ContentRecord[]): boolean {
  return countOtherVocabItems(records) > 0;
}

export function collectThemeStats(records: ContentRecord[], category: ItemType): ThemeStat[] {
  const map = new Map<number, { name: string; count: number }>();
  for (const { item } of records) {
    if (item.type !== category || !item.theme) continue;
    const existing = map.get(item.theme);
    if (existing) {
      existing.count += 1;
      if (item.themeName) existing.name = item.themeName;
    } else {
      map.set(item.theme, {
        name: item.themeName ?? `テーマ${item.theme}`,
        count: 1,
      });
    }
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([num, { name, count }]) => ({ num, name, count }));
}

export function collectThemes(records: ContentRecord[], category: ItemType): ThemeInfo[] {
  return collectThemeStats(records, category).map(({ num, name }) => ({ num, name }));
}

export function buildThemeRanges(themes: ThemeInfo[]): ThemeRange[] {
  if (!themes.length) return [];
  const max = themes[themes.length - 1].num;
  const ranges: ThemeRange[] = [];
  for (let start = 1; start <= max; start += 10) {
    const end = start + 9;
    const inRange = themes.filter((t) => t.num >= start && t.num <= end);
    if (!inRange.length) continue;
    ranges.push({
      min: start,
      max: end,
      label: `${start}–${end}`,
      themes: inRange,
    });
  }
  return ranges;
}

export function needsThemeRangeNav(stats: ThemeStat[]): boolean {
  if (!stats.length) return false;
  return stats[stats.length - 1].num >= 11;
}

export function getVisibleThemes(
  stats: ThemeStat[],
  ranges: ThemeRange[],
  themeRangeMin: number | null,
): ThemeStat[] {
  if (!stats.length) return [];
  if (!needsThemeRangeNav(stats)) return stats;

  const activeRange =
    themeRangeMin != null ? ranges.find((r) => r.min === themeRangeMin) : ranges[0];
  if (!activeRange) return stats;

  return stats.filter((t) => t.num >= activeRange.min && t.num <= activeRange.max);
}

export function countOtherThemeItems(records: ContentRecord[], category: ItemType): number {
  return records.filter((r) => r.item.type === category && !r.item.theme).length;
}

export function getThemeSelectionLabel(
  themeFilter: ThemeFilter,
  stats: ThemeStat[],
  visibleStats: ThemeStat[],
  otherCount = 0,
): string {
  if (themeFilter === THEME_OTHER) {
    return `その他・${otherCount}語`;
  }
  if (themeFilter === "all") {
    const pool = visibleStats.length ? visibleStats : stats;
    const total = pool.reduce((sum, t) => sum + t.count, 0);
    if (needsThemeRangeNav(stats) && visibleStats.length) {
      const min = visibleStats[0].num;
      const max = visibleStats[visibleStats.length - 1].num;
      return `テーマ${min}–${max} 全部・${total}語`;
    }
    return `全部・${total}語`;
  }
  if (typeof themeFilter === "number") {
    const stat = stats.find((t) => t.num === themeFilter);
    if (stat) {
      return `テーマ${stat.num} ${stat.name}・${stat.count}語`;
    }
    return `テーマ${themeFilter}`;
  }
  return "テーマ";
}

export function matchesThemeFilter(item: ContentRecord["item"], themeFilter: ThemeFilter): boolean {
  if (themeFilter === "all") return true;
  if (themeFilter === THEME_OTHER) return !item.theme;
  return item.theme === themeFilter;
}

export function matchesThemeRange(item: ContentRecord["item"], range: ThemeRange | null): boolean {
  if (!range) return true;
  if (!item.theme) return false;
  return item.theme >= range.min && item.theme <= range.max;
}

export function hasOtherThemeItems(records: ContentRecord[], category: ItemType): boolean {
  return countOtherThemeItems(records, category) > 0;
}
