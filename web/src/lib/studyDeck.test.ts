import { describe, expect, it } from "vitest";
import { buildStudyDeck } from "./studyDeck";
import type { ContentRecord, ProgressData } from "../types";

function word(id: string): ContentRecord {
  return {
    id,
    item: { id, type: "word", front: id, meaning: "m" },
    source: { added: "2026-01-01" },
    importedAt: 1,
  };
}

const records = Array.from({ length: 12 }, (_, i) => word(`w-${i}`));

const progress: ProgressData = {
  srs: {
    "w-0": {
      ef: 2.5,
      reps: 1,
      interval: 1,
      due: 1,
      lapses: 0,
      maybeCount: 0,
      last: 1,
      status: "review",
    },
    "w-1": {
      ef: 2.5,
      reps: 1,
      interval: 1,
      due: 1,
      lapses: 0,
      maybeCount: 0,
      last: 1,
      status: "review",
    },
  },
  hard: {},
  userSentences: {},
  updatedAt: 1,
};

describe("buildStudyDeck", () => {
  it("spreads unlearned words across the deck", () => {
    const deck = buildStudyDeck(records, progress, {
      category: "word",
      themeFilter: "all",
      themeRange: null,
      dueOnly: false,
      hardOnly: false,
      unlearnedOnly: false,
      setSize: 10,
      sort: "asc",
    });

    expect(deck).toHaveLength(10);
    const unlearnedPositions = deck
      .map((r, i) => (!progress.srs[r.id] ? i : -1))
      .filter((i) => i >= 0);
    expect(unlearnedPositions.length).toBeGreaterThan(0);
    if (unlearnedPositions.length >= 2) {
      const gaps = unlearnedPositions.slice(1).map((pos, i) => pos - unlearnedPositions[i]);
      expect(Math.min(...gaps)).toBeGreaterThan(0);
    }
  });
});
