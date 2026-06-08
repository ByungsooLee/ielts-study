import { describe, expect, it } from "vitest";
import { createNewSched } from "./sm2";
import {
  applySessionNewLimit,
  buildDistractorPool,
  buildSynonymPool,
  checkProductionAnswer,
  generateQuestion,
  isSynonymCandidate,
  isSynonymEligible,
  spaceClusters,
} from "./synonymQuiz";
import type { ContentRecord, ProgressData, StudyItem } from "../types";

function makeItem(
  id: string,
  front: string,
  synonyms: string[],
  extras: Partial<StudyItem> = {},
): StudyItem {
  return {
    id,
    type: "word",
    front,
    meaning: `${front} meaning`,
    synonyms,
    ...extras,
  };
}

function makeRecord(item: StudyItem): ContentRecord {
  return {
    id: item.id,
    item,
    source: { added: "2026-01-01" },
    importedAt: 0,
  };
}

const progress: ProgressData = {
  srs: {
    "w-a": { ...createNewSched(0), reps: 2, status: "review" },
    "w-b": { ...createNewSched(0), reps: 1, status: "review" },
    "w-c": { ...createNewSched(0), reps: 0, status: "new" },
  },
  hard: {},
  userSentences: {},
  updatedAt: 0,
};

describe("isSynonymEligible", () => {
  it("requires synonyms and reps >= 1", () => {
    const item = makeItem("w-a", "concern", ["worry"]);
    expect(isSynonymEligible(item, progress.srs["w-a"])).toBe(true);
    expect(isSynonymEligible(item, progress.srs["w-c"])).toBe(false);
    expect(isSynonymEligible(makeItem("w-x", "x", []), progress.srs["w-a"])).toBe(false);
  });
});

describe("isSynonymCandidate", () => {
  it("includes unlearned words with synonyms", () => {
    const item = makeItem("w-c", "newword", ["alt"]);
    expect(isSynonymCandidate(item, progress.srs["w-c"])).toBe(true);
    expect(isSynonymCandidate(item, { ...progress.srs["w-a"], status: "suspended" })).toBe(false);
    expect(isSynonymCandidate({ ...item, type: "phrase" }, progress.srs["w-c"])).toBe(false);
  });
});

describe("buildSynonymPool", () => {
  it("returns all synonym words without reps gate", () => {
    const records = [
      makeRecord(makeItem("w-a", "a", ["a1"])),
      makeRecord(makeItem("w-c", "c", ["c1"])),
      makeRecord(makeItem("w-p", "p", ["p1"], { type: "phrase" })),
    ];
    const pool = buildSynonymPool(records, progress, {
      themeFilter: "all",
      themeRange: null,
      hardOnly: false,
      sort: "asc",
    });
    expect(pool.map((r) => r.item.id)).toEqual(["w-a", "w-c"]);
  });
});

describe("buildDistractorPool", () => {
  it("excludes target cluster and overlapping clusters", () => {
    const target = makeItem("w-a", "concern", ["worry"]);
    const all = [
      target,
      makeItem("w-b", "worry", ["fret"]),
      makeItem("w-c", "apple", ["fruit"]),
      makeItem("w-d", "house", ["home"]),
      makeItem("w-e", "car", ["vehicle"]),
      makeItem("w-f", "dog", ["pet"]),
    ];
    const pool = buildDistractorPool(all, target);
    expect(pool).not.toContain("concern");
    expect(pool).not.toContain("worry");
    expect(pool.some((w) => ["apple", "house", "car", "dog"].includes(w))).toBe(true);
  });
});

describe("generateQuestion paraphrase", () => {
  it("does not use sibling synonyms as distractors", () => {
    const item = makeItem("w-a", "alter", ["change", "modify"], {
      examples: [{ en: "We need to alter the plan." }],
    });
    const others = [
      makeItem("w-b", "apple", ["fruit"]),
      makeItem("w-c", "house", ["home"]),
      makeItem("w-d", "car", ["vehicle"]),
      makeItem("w-e", "dog", ["pet"]),
    ];
    const record = makeRecord(item);
    const q = generateQuestion(record, "paraphrase", [item, ...others]);
    expect(q).not.toBeNull();
    const wrong = q!.options!.filter((_, i) => i !== q!.correctIndex);
    expect(wrong).not.toContain("modify");
    expect(wrong).not.toContain("change");
  });
});

describe("applySessionNewLimit", () => {
  it("caps reps===1 items", () => {
    const records = [
      makeRecord(makeItem("w-a", "a", ["a1"])),
      makeRecord(makeItem("w-b", "b", ["b1"])),
      makeRecord(makeItem("w-c", "c", ["c1"])),
    ];
    const result = applySessionNewLimit(records, progress, 5);
    const freshCount = result.filter((r) => progress.srs[r.item.id]?.reps === 1).length;
    expect(freshCount).toBe(1);
    expect(result.some((r) => r.item.id === "w-a")).toBe(true);
  });
});

describe("spaceClusters", () => {
  it("keeps same item ids apart when duplicates exist", () => {
    const a = makeRecord(makeItem("w-a", "a", ["a1"]));
    const b = makeRecord(makeItem("w-b", "b", ["b1"]));
    const c = makeRecord(makeItem("w-c", "c", ["c1"]));
    const d = makeRecord(makeItem("w-d", "d", ["d1"]));
    const deck = [a, a, b, c, d];
    const spaced = spaceClusters(deck, 3);
    const positions = spaced
      .map((r, i) => (r.item.id === "w-a" ? i : -1))
      .filter((i) => i >= 0);
    expect(positions).toHaveLength(2);
    expect(positions[1] - positions[0]).toBeGreaterThan(3);
  });
});

describe("checkProductionAnswer", () => {
  it("accepts front and synonyms case-insensitively", () => {
    expect(checkProductionAnswer("Change", ["alter", "change", "modify"])).toBe(true);
    expect(checkProductionAnswer("ALTER", ["alter", "change"])).toBe(true);
    expect(checkProductionAnswer("apple", ["alter", "change"])).toBe(false);
  });
});
