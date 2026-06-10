import { describe, expect, it } from "vitest";
import type { ContentIndex } from "./staticContent";

/**
 * ビルド済み web/public/content/**.json を実際に読み込み（Vite glob）、
 * grammar コレクションが index に含まれ各シャードが存在・パースできることを保証する。
 * （`npm run content:build` 後に grammar が消えない回帰防止）
 */
const files = import.meta.glob("../../public/content/**/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

function shard(file: string): { items: { type: string }[]; version: string; schemaVersion?: number } {
  const key = Object.keys(files).find((k) => k.endsWith(`/content/${file}`));
  if (!key) throw new Error(`shard not found: ${file}`);
  return files[key] as { items: { type: string }[]; version: string; schemaVersion?: number };
}

const indexKey = Object.keys(files).find((k) => k.endsWith("/content/index.json"))!;
const index = files[indexKey] as ContentIndex;

describe("built content index", () => {
  it("has build metadata (schemaVersion / buildId / version)", () => {
    expect(index.schemaVersion).toBe(1);
    expect(typeof index.buildId).toBe("string");
    expect(typeof index.version).toBe("string");
  });

  it("includes the english/grammar collection", () => {
    const grammar = index.collections.find((c) => c.id === "grammar");
    expect(grammar, "grammar collection must exist in index.json").toBeTruthy();
    expect(grammar!.domain).toBe("english");
    expect(grammar!.themes.length).toBeGreaterThanOrEqual(1);
  });

  it("has grammar shards that exist, parse, and carry grammar items", () => {
    const grammar = index.collections.find((c) => c.id === "grammar")!;
    for (const theme of grammar.themes) {
      const data = shard(theme.file);
      expect(data.items.length).toBe(theme.count);
      expect(data.version).toBe(theme.version);
      expect(data.items.some((i) => i.type === "grammar")).toBe(true);
    }
  });

  it("still includes the ielts-vocab collection (no regression)", () => {
    expect(index.collections.some((c) => c.id === "ielts-vocab")).toBe(true);
  });
});
