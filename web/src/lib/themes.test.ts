import { describe, expect, it } from "vitest";
import {
  collectThemeStats,
  collectThemeVocabStats,
  getThemeSelectionLabel,
  getVisibleThemes,
  needsThemeRangeNav,
  buildThemeRanges,
  collectThemes,
} from "./themes";
import type { ContentRecord } from "../types";

function record(
  id: string,
  type: "word" | "phrase" | "grammar",
  theme?: number,
  themeName?: string,
): ContentRecord {
  return {
    id,
    item: {
      id,
      type,
      front: id,
      meaning: "m",
      theme,
      themeName,
    },
    source: { added: "2026-01-01" },
    importedAt: 0,
  };
}

describe("collectThemeVocabStats", () => {
  it("counts word and phrase together per theme", () => {
    const records = [
      record("w1", "word", 1, "A"),
      record("w2", "word", 1, "A"),
      record("p1", "phrase", 1, "A"),
      record("g1", "grammar", 1, "A"),
    ];
    expect(collectThemeVocabStats(records)).toEqual([
      { num: 1, name: "A", count: 3 },
    ]);
  });
});

describe("collectThemeStats", () => {
  it("counts items per theme in ascending order", () => {
    const records = [
      record("w1", "word", 2, "B"),
      record("w2", "word", 1, "A"),
      record("w3", "word", 1, "A"),
      record("g1", "grammar"),
    ];
    const stats = collectThemeStats(records, "word");
    expect(stats).toEqual([
      { num: 1, name: "A", count: 2 },
      { num: 2, name: "B", count: 1 },
    ]);
  });

  it("excludes items without theme", () => {
    const stats = collectThemeStats([record("g1", "grammar")], "grammar");
    expect(stats).toEqual([]);
  });
});

describe("getVisibleThemes", () => {
  const stats = Array.from({ length: 12 }, (_, i) => ({
    num: i + 1,
    name: `T${i + 1}`,
    count: 1,
  }));
  const themes = collectThemes(
    stats.map((s) => record(`w${s.num}`, "word", s.num, s.name)),
    "word",
  );
  const ranges = buildThemeRanges(themes);

  it("returns all themes when max <= 10", () => {
    const small = stats.slice(0, 10);
    expect(getVisibleThemes(small, buildThemeRanges(collectThemes(
      small.map((s) => record(`w${s.num}`, "word", s.num, s.name)),
      "word",
    )), null)).toHaveLength(10);
    expect(needsThemeRangeNav(small)).toBe(false);
  });

  it("returns range subset when max >= 11", () => {
    expect(needsThemeRangeNav(stats)).toBe(true);
    const visible = getVisibleThemes(stats, ranges, 1);
    expect(visible.map((t) => t.num)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const visible11 = getVisibleThemes(stats, ranges, 11);
    expect(visible11.map((t) => t.num)).toEqual([11, 12]);
  });
});

describe("getThemeSelectionLabel", () => {
  const stats = [
    { num: 3, name: "タイタニック", count: 13 },
    { num: 5, name: "宇宙", count: 8 },
  ];

  it("labels all and single theme", () => {
    expect(getThemeSelectionLabel("all", stats, stats)).toBe("全部・21語");
    expect(getThemeSelectionLabel(3, stats, stats)).toBe("テーマ3 タイタニック・13語");
    expect(getThemeSelectionLabel("other", stats, stats, 3)).toBe("その他・3語");
  });
});
