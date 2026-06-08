import type { ContentRecord, ProgressData } from "../types";
import { buildDailyQueue } from "./dailyQueue";
import { isEngineeringRecord } from "./domain";
import { interleaveEvenly } from "./deckBalance";
import { isUnlearned } from "./studyDeck";

export function filterEngineeringPool(
  records: ContentRecord[],
  opts: {
    collectionId: string | null;
    theme: number | null;
    tagFilter: string;
  },
): ContentRecord[] {
  return records.filter((record) => {
    if (!isEngineeringRecord(record)) return false;
    const { item } = record;
    if (opts.collectionId && item.collection !== opts.collectionId) return false;
    if (opts.theme != null && item.theme !== opts.theme) return false;
    if (opts.tagFilter && !(item.tags ?? []).includes(opts.tagFilter)) return false;
    return true;
  });
}

export function buildEngineeringStudyDeck(
  progress: ProgressData,
  pool: ContentRecord[],
): ContentRecord[] {
  const unlearned = pool.filter((r) => isUnlearned(r.item.id, progress));
  const learned = pool.filter((r) => !isUnlearned(r.item.id, progress));
  if (unlearned.length === 0 || learned.length === 0) {
    return [...pool].sort(() => Math.random() - 0.5);
  }
  return interleaveEvenly(
    [...learned].sort(() => Math.random() - 0.5),
    [...unlearned].sort(() => Math.random() - 0.5),
    pool.length,
  );
}

export function buildEngineeringReviewDeck(
  records: ContentRecord[],
  progress: ProgressData,
  newLimit: number,
) {
  const engineering = records.filter(isEngineeringRecord);
  return buildDailyQueue(engineering, progress, newLimit);
}
