import type { ContentRecord, ItemType, ThemeInfo, ThemeRange } from "../types";

export const THEME_OTHER = "other" as const;
export type ThemeFilter = number | typeof THEME_OTHER | "all";

export const CATEGORY_LABELS: Record<ItemType, string> = {
  word: "単語",
  phrase: "構文",
  grammar: "文法",
  conversation: "会話",
};

export const CATEGORY_STYLES: Record<
  ItemType,
  { active: string; inactive: string; ring: string; badge: string }
> = {
  word: {
    active: "bg-blue-600 text-white",
    inactive: "bg-blue-50 text-blue-800 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900",
    ring: "ring-blue-400",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  phrase: {
    active: "bg-emerald-600 text-white",
    inactive: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900",
    ring: "ring-emerald-400",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  grammar: {
    active: "bg-violet-600 text-white",
    inactive: "bg-violet-50 text-violet-800 hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-200 dark:hover:bg-violet-900",
    ring: "ring-violet-400",
    badge: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  },
  conversation: {
    active: "bg-orange-600 text-white",
    inactive: "bg-orange-50 text-orange-800 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-200 dark:hover:bg-orange-900",
    ring: "ring-orange-400",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
};

export function collectThemes(records: ContentRecord[], category: ItemType): ThemeInfo[] {
  const map = new Map<number, string>();
  for (const { item } of records) {
    if (item.type !== category || !item.theme) continue;
    map.set(item.theme, item.themeName ?? `テーマ${item.theme}`);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([num, name]) => ({ num, name }));
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
  return records.some((r) => r.item.type === category && !r.item.theme);
}
