import type { Grade, ProgressData, Sched, StudyItem } from "../types";
import { applyGrade as applySm2Grade, createNewSched, SM2 } from "./sm2";

/** 旧移行用に残す */
export const INTERVALS = [0, 1, 3, 7, 16, 40] as const;

export function todayDay(): number {
  return Math.floor(Date.now() / 86400000);
}

export function emptyProgress(): ProgressData {
  return {
    srs: {},
    hard: {},
    userSentences: {},
    streak: { count: 0, lastDay: 0 },
    schemaVersion: 2,
    updatedAt: Date.now(),
  };
}

export function getOrCreateSched(progress: ProgressData, itemId: string, today = todayDay()): Sched {
  return progress.srs[itemId] ?? createNewSched(today);
}

export function applyGrade(record: Sched, grade: Grade, today = todayDay()): Sched {
  const next = applySm2Grade(record, grade, today);
  if (grade !== "maybe") return next;
  return { ...next, maybeCount: (record.maybeCount ?? 0) + 1 };
}

export function isDue(record: Sched | undefined, today = todayDay()): boolean {
  if (!record) return true;
  if (record.status === "suspended") return false;
  if (record.status === "new") return true;
  return record.due <= today;
}

export function isHard(itemId: string, progress: ProgressData): boolean {
  const sched = progress.srs[itemId];
  return progress.hard[itemId] === true || (sched?.lapses ?? 0) >= 2;
}

export function isReach(sched: Sched | undefined): boolean {
  return (sched?.lapses ?? 0) >= SM2.REACH_LAPSES || sched?.status === "suspended";
}

export function isUnlearned(progress: ProgressData, itemId: string): boolean {
  const sched = progress.srs[itemId];
  return !sched || sched.status === "new";
}

/** @deprecated セット学習の due フィルタ用。今日の復習は dailyQueue を使う */
export function getReviewQueue(
  items: StudyItem[],
  progress: ProgressData,
  typeFilter: StudyItem["type"] | "all" = "all",
): StudyItem[] {
  const today = todayDay();
  return items.filter((item) => {
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    const sched = progress.srs[item.id];
    if (sched?.status === "suspended") return false;
    return isDue(sched, today);
  });
}
