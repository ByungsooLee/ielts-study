import type { ContentRecord, ProgressData, SchedStatus } from "../types";

export interface MaybeWordStat {
  id: string;
  front: string;
  meaning: string;
  maybeCount: number;
  status: SchedStatus | "unseen";
  reps: number;
  lapses: number;
}

export function getMaybeCount(progress: ProgressData, itemId: string): number {
  return progress.srs[itemId]?.maybeCount ?? 0;
}

export function collectMaybeWordStats(
  records: ContentRecord[],
  progress: ProgressData,
): MaybeWordStat[] {
  return records
    .filter((r) => r.item.type === "word")
    .map((record) => {
      const sched = progress.srs[record.id];
      return {
        id: record.id,
        front: record.item.front,
        meaning: record.item.meaning,
        maybeCount: sched?.maybeCount ?? 0,
        status: sched?.status ?? "unseen",
        reps: sched?.reps ?? 0,
        lapses: sched?.lapses ?? 0,
      };
    })
    .sort((a, b) => {
      if (b.maybeCount !== a.maybeCount) return b.maybeCount - a.maybeCount;
      return a.front.localeCompare(b.front, "en");
    });
}

export function summarizeMaybeStats(stats: MaybeWordStat[]) {
  const withMaybe = stats.filter((s) => s.maybeCount > 0);
  const totalMaybe = withMaybe.reduce((sum, s) => sum + s.maybeCount, 0);
  const unlearned = stats.filter((s) => s.status === "unseen" || s.status === "new");
  return {
    wordCount: stats.length,
    withMaybeCount: withMaybe.length,
    totalMaybePresses: totalMaybe,
    unlearnedCount: unlearned.length,
    maxMaybe: stats[0]?.maybeCount ?? 0,
  };
}
