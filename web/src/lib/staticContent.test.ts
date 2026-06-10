import { describe, expect, it } from "vitest";
import {
  engineeringThemeChipsFromIndex,
  themeVocabStatsFromIndex,
  type CollectionIndexEntry,
} from "./staticContent";

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

describe("engineeringThemeChipsFromIndex", () => {
  it("flattens themes across engineering collections", () => {
    const collections: CollectionIndexEntry[] = [
      {
        id: "system-design",
        domain: "engineering",
        name: "システム設計",
        kind: "concept",
        themes: [
          {
            theme: 1,
            themeName: "基礎",
            count: 7,
            file: "engineering/system-design/theme-1.json",
            version: "abc",
          },
        ],
      },
      {
        id: "de-sql",
        domain: "engineering",
        name: "SQL",
        kind: "concept",
        themes: [
          {
            theme: 1,
            themeName: "最適化",
            count: 6,
            file: "engineering/sql-optimization/theme-1.json",
            version: "def",
          },
        ],
      },
    ];
    expect(engineeringThemeChipsFromIndex(collections)).toEqual([
      {
        collectionId: "system-design",
        collectionName: "システム設計",
        theme: 1,
        themeName: "基礎",
        count: 7,
      },
      {
        collectionId: "de-sql",
        collectionName: "SQL",
        theme: 1,
        themeName: "最適化",
        count: 6,
      },
    ]);
  });
});
