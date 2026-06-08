import { describe, expect, it } from "vitest";
import { themeVocabStatsFromIndex, type CollectionIndexEntry } from "./staticContent";

describe("themeVocabStatsFromIndex", () => {
  const collection: CollectionIndexEntry = {
    id: "ielts-vocab",
    domain: "english",
    name: "IELTS単語帳",
    kind: "vocab",
    themes: [
      { theme: 0, themeName: "汎用", count: 3, file: "english/ielts-vocab/theme-0.json", version: "a" },
      { theme: 1, themeName: "テーマ1", count: 20, file: "english/ielts-vocab/theme-1.json", version: "b" },
      { theme: 2, themeName: "テーマ2", count: 22, file: "english/ielts-vocab/theme-2.json", version: "c" },
    ],
  };

  it("excludes theme 0 and maps index entries to stats", () => {
    expect(themeVocabStatsFromIndex(collection)).toEqual([
      { num: 1, name: "テーマ1", count: 20 },
      { num: 2, name: "テーマ2", count: 22 },
    ]);
  });
});
