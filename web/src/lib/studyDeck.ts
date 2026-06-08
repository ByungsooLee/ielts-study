import type { ContentRecord, DeckSort, ItemType, ProgressData, SetSize, ThemeRange } from "../types";
import { buildDailyQueue, type DailyQueueResult } from "./dailyQueue";
import { isDue, isHard, todayDay } from "./srs";
import { matchesThemeFilter, type ThemeFilter } from "./themes";

export interface DeckFilters {
  category: ItemType;
  themeFilter: ThemeFilter;
  themeRange: ThemeRange | null;
  dueOnly: boolean;
  hardOnly: boolean;
  unlearnedOnly: boolean;
  setSize: SetSize;
  sort: DeckSort;
}

export function isUnlearned(itemId: string, progress: ProgressData): boolean {
  const sched = progress.srs[itemId];
  return !sched || sched.status === "new";
}

export function filterRecords(
  records: ContentRecord[],
  progress: ProgressData,
  filters: DeckFilters,
): ContentRecord[] {
  const today = todayDay();
  return records.filter((record) => {
    const { item } = record;
    if (item.type !== filters.category) return false;
    if (!matchesThemeFilter(item, filters.themeFilter)) return false;
    if (filters.themeRange && item.theme) {
      if (item.theme < filters.themeRange.min || item.theme > filters.themeRange.max) return false;
    }
    if (filters.dueOnly) {
      const sched = progress.srs[item.id];
      if (!sched || sched.status === "suspended" || sched.status === "new") return false;
      if (sched.due > today) return false;
    }
    if (filters.hardOnly && !isHard(item.id, progress)) return false;
    if (filters.unlearnedOnly && !isUnlearned(item.id, progress)) return false;
    return true;
  });
}

function sortRecords(records: ContentRecord[], sort: DeckSort): ContentRecord[] {
  const list = [...records];
  if (sort === "asc") {
    list.sort((a, b) => {
      const ta = a.item.theme ?? 999;
      const tb = b.item.theme ?? 999;
      if (ta !== tb) return ta - tb;
      return a.id.localeCompare(b.id);
    });
    return list;
  }
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export function buildStudyDeck(
  records: ContentRecord[],
  progress: ProgressData,
  filters: DeckFilters,
): ContentRecord[] {
  const filtered = filterRecords(records, progress, filters);
  const sorted = sortRecords(filtered, filters.sort);
  return sorted.slice(0, filters.setSize);
}

export function countDueInCategory(
  records: ContentRecord[],
  progress: ProgressData,
  category: ItemType,
): number {
  const today = todayDay();
  return records.filter(
    (r) => r.item.type === category && isDue(progress.srs[r.item.id], today),
  ).length;
}

/** 今日の復習：カテゴリ混在キュー（SM-2 dailyQueue） */
export function buildDailyReviewDeck(
  records: ContentRecord[],
  progress: ProgressData,
  newLimit: number,
): DailyQueueResult {
  return buildDailyQueue(records, progress, newLimit);
}
