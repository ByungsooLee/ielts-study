import type { ContentRecord, DeckSort, ItemType, ProgressData, SetSize, ThemeRange } from "../types";
import { interleaveEvenly } from "./deckBalance";
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

function buildBalancedDeck(
  records: ContentRecord[],
  progress: ProgressData,
  setSize: number,
  sort: DeckSort,
): ContentRecord[] {
  const unlearned = records.filter((r) => isUnlearned(r.item.id, progress));
  const learned = records.filter((r) => !isUnlearned(r.item.id, progress));

  if (unlearned.length === 0 || learned.length === 0) {
    return sortRecords(records, sort).slice(0, setSize);
  }

  return interleaveEvenly(
    sortRecords(learned, sort),
    sortRecords(unlearned, sort),
    setSize,
  );
}

export function buildStudyDeck(
  records: ContentRecord[],
  progress: ProgressData,
  filters: DeckFilters,
): ContentRecord[] {
  const filtered = filterRecords(records, progress, filters);
  return buildBalancedDeck(filtered, progress, filters.setSize, filters.sort);
}

/** テーマ内の全項目を出題（枚数上限なし） */
export function buildThemeDeck(
  records: ContentRecord[],
  progress: ProgressData,
  filters: Omit<DeckFilters, "setSize">,
): ContentRecord[] {
  const filtered = filterRecords(records, progress, { ...filters, setSize: 50 });
  return buildBalancedDeck(filtered, progress, filtered.length, filters.sort);
}

function filterThemeVocabRecords(
  records: ContentRecord[],
  progress: ProgressData,
  filters: Omit<DeckFilters, "setSize" | "category">,
): ContentRecord[] {
  const today = todayDay();
  return records.filter((record) => {
    const { item } = record;
    if (item.type !== "word" && item.type !== "phrase") return false;
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

/** テーマ内の word+phrase を全件出題 */
export function buildThemeVocabDeck(
  records: ContentRecord[],
  progress: ProgressData,
  filters: Omit<DeckFilters, "setSize" | "category">,
): ContentRecord[] {
  const filtered = filterThemeVocabRecords(records, progress, filters);
  return buildBalancedDeck(filtered, progress, filtered.length, filters.sort);
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
