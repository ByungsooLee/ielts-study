import { describe, expect, it } from "vitest";
import { collectMaybeWordStats, summarizeMaybeStats } from "./maybeStats";
import type { ContentRecord, ProgressData } from "../types";

function word(id: string, front: string): ContentRecord {
  return {
    id,
    item: { id, type: "word", front, meaning: "意味" },
    source: { added: "2026-01-01" },
    importedAt: 1,
  };
}

const records = [word("w-a", "alpha"), word("w-b", "beta")];

const progress: ProgressData = {
  srs: {
    "w-a": {
      ef: 2.5,
      reps: 1,
      interval: 1,
      due: 1,
      lapses: 0,
      maybeCount: 3,
      last: 1,
      status: "review",
    },
    "w-b": {
      ef: 2.5,
      reps: 0,
      interval: 0,
      due: 1,
      lapses: 0,
      maybeCount: 1,
      last: 1,
      status: "new",
    },
  },
  hard: {},
  userSentences: {},
  updatedAt: 1,
};

describe("collectMaybeWordStats", () => {
  it("lists words sorted by maybe count", () => {
    const stats = collectMaybeWordStats(records, progress);
    expect(stats).toHaveLength(2);
    expect(stats[0].id).toBe("w-a");
    expect(stats[0].maybeCount).toBe(3);
    expect(stats[1].maybeCount).toBe(1);
  });

  it("summarizes counts", () => {
    const stats = collectMaybeWordStats(records, progress);
    const summary = summarizeMaybeStats(stats);
    expect(summary.wordCount).toBe(2);
    expect(summary.withMaybeCount).toBe(2);
    expect(summary.totalMaybePresses).toBe(4);
    expect(summary.unlearnedCount).toBe(1);
  });
});
