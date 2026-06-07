import type { Grade, ProgressData, SrsRecord, StudyItem } from "../types";

export const INTERVALS = [0, 1, 3, 7, 16, 40] as const;

export function todayDay(): number {
  return Math.floor(Date.now() / 86400000);
}

export function emptyProgress(): ProgressData {
  return { srs: {}, hard: {}, userSentences: {}, updatedAt: Date.now() };
}

export function getOrCreateSrs(progress: ProgressData, itemId: string): SrsRecord {
  return (
    progress.srs[itemId] ?? {
      box: 0,
      due: todayDay(),
      ts: Date.now(),
      lapses: 0,
    }
  );
}

export function applyGrade(record: SrsRecord, grade: Grade, today = todayDay()): SrsRecord {
  const next = { ...record, ts: Date.now() };
  if (grade === "forgot") {
    next.box = 0;
    next.lapses += 1;
    next.due = today;
  } else if (grade === "maybe") {
    next.due = today + INTERVALS[next.box];
  } else {
    next.box = Math.min(next.box + 1, 5);
    next.due = today + INTERVALS[next.box];
  }
  return next;
}

export function isDue(record: SrsRecord | undefined, today = todayDay()): boolean {
  if (!record) return true;
  return record.due <= today;
}

export function isHard(
  itemId: string,
  progress: ProgressData,
): boolean {
  const srs = progress.srs[itemId];
  return progress.hard[itemId] === true || (srs?.lapses ?? 0) >= 2;
}

export function getReviewQueue(
  items: StudyItem[],
  progress: ProgressData,
  typeFilter: StudyItem["type"] | "all" = "all",
): StudyItem[] {
  const today = todayDay();
  return items.filter((item) => {
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    const srs = progress.srs[item.id];
    return isDue(srs, today);
  });
}
