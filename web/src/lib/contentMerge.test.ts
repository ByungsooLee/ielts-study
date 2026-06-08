import { describe, expect, it } from "vitest";
import { mergeContent } from "./contentMerge";
import type { ContentRecord } from "../types";

function record(id: string, importedAt: number, theme?: number): ContentRecord {
  return {
    id,
    item: {
      id,
      type: "word",
      front: id,
      meaning: "m",
      theme,
      themeName: theme ? `T${theme}` : undefined,
    },
    source: { added: "2026-01-01" },
    importedAt,
  };
}

describe("mergeContent theme enrich", () => {
  it("fills missing theme from remote when local is newer", () => {
    const local = { records: [record("w-a", 2000)], updatedAt: 2000 };
    const remote = { records: [record("w-a", 1000, 3)], updatedAt: 1000 };
    const merged = mergeContent(local, remote);
    expect(merged.records[0].item.theme).toBe(3);
    expect(merged.records[0].importedAt).toBe(2000);
  });
});
