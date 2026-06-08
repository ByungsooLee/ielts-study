import type { ContentRecord, ProgressData, Sched } from "../types";
import { interleaveEvenly } from "./deckBalance";
import { SM2 } from "./sm2";
import { todayDay } from "./srs";

export interface DailyQueueResult {
  queue: ContentRecord[];
  reviewCount: number;
  newCount: number;
  totalDue: number;
  totalNewAvailable: number;
}

function getSched(progress: ProgressData, itemId: string): Sched | undefined {
  return progress.srs[itemId];
}

function isDueForReview(sched: Sched | undefined, today: number): boolean {
  if (!sched) return false;
  if (sched.status === "suspended" || sched.status === "new") return false;
  return sched.due <= today;
}

function isNewItem(progress: ProgressData, itemId: string): boolean {
  const sched = getSched(progress, itemId);
  if (!sched) return true;
  return sched.status === "new";
}

export function getDailyNewIntroduced(progress: ProgressData, today = todayDay()): number {
  if (progress.dailyMeta?.day === today) return progress.dailyMeta.newIntroduced;
  return 0;
}

export function buildDailyQueue(
  records: ContentRecord[],
  progress: ProgressData,
  newLimit: number,
  maxTotal = SM2.DAILY_MAX_TOTAL,
): DailyQueueResult {
  const today = todayDay();
  const alreadyIntroduced = getDailyNewIntroduced(progress, today);
  const newSlots = Math.max(0, newLimit - alreadyIntroduced);

  const dueItems: ContentRecord[] = [];
  const newItems: ContentRecord[] = [];

  for (const record of records) {
    const sched = getSched(progress, record.id);
    if (sched?.status === "suspended") continue;

    if (isDueForReview(sched, today)) {
      dueItems.push(record);
    } else if (isNewItem(progress, record.id)) {
      newItems.push(record);
    }
  }

  dueItems.sort((a, b) => {
    const da = progress.srs[a.id]?.due ?? 0;
    const db = progress.srs[b.id]?.due ?? 0;
    if (da !== db) return da - db;
    return (a.item.n ?? 999999) - (b.item.n ?? 999999);
  });

  newItems.sort((a, b) => (a.item.n ?? 999999) - (b.item.n ?? 999999));

  const newSelected = newItems.slice(0, newSlots);
  const queue = interleaveEvenly(dueItems, newSelected, maxTotal);

  const newInQueue = queue.filter((r) => isNewItem(progress, r.id)).length;

  return {
    queue,
    reviewCount: dueItems.length,
    newCount: newInQueue,
    totalDue: dueItems.length,
    totalNewAvailable: newItems.length,
  };
}

export function markDailyNewIntroduced(
  progress: ProgressData,
  count: number,
  today = todayDay(),
): ProgressData {
  const prev = getDailyNewIntroduced(progress, today);
  return {
    ...progress,
    dailyMeta: { day: today, newIntroduced: prev + count },
    updatedAt: Date.now(),
  };
}

export function forecastDueCounts(
  records: ContentRecord[],
  progress: ProgressData,
  days = 14,
  today = todayDay(),
): { day: number; label: string; count: number }[] {
  const result: { day: number; label: string; count: number }[] = [];
  for (let offset = 0; offset < days; offset++) {
    const day = today + offset;
    const count = records.filter((r) => {
      const sched = progress.srs[r.id];
      if (!sched || sched.status === "suspended" || sched.status === "new") return false;
      return sched.due === day;
    }).length;
    const d = new Date(day * 86400000);
    result.push({
      day,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      count,
    });
  }
  return result;
}
