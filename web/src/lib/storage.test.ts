import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readJson, writeJson, readString } from "./storage";

/** node テスト環境の localStorage shim は clear/key 未対応のことがあるため完全なモックを注入。 */
function installFakeStorage() {
  const map = new Map<string, string>();
  const fake: Storage = {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k),
    key: (i: number) => [...map.keys()][i] ?? null,
  };
  vi.stubGlobal("localStorage", fake);
  return map;
}

function allKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) keys.push(k);
  }
  return keys;
}

describe("storage safe JSON", () => {
  beforeEach(() => installFakeStorage());
  afterEach(() => vi.unstubAllGlobals());

  it("round-trips JSON", () => {
    writeJson("k1", { a: 1, b: [2, 3] });
    expect(readJson("k1", null)).toEqual({ a: 1, b: [2, 3] });
  });

  it("returns fallback for a missing key", () => {
    expect(readJson("missing", { fallback: true })).toEqual({ fallback: true });
  });

  it("quarantines corrupt JSON and returns the fallback (does not throw)", () => {
    localStorage.setItem("bad", "{not valid json");
    const result = readJson("bad", { ok: true });
    expect(result).toEqual({ ok: true });
    expect(localStorage.getItem("bad")).toBeNull();
    expect(allKeys().some((k) => k.startsWith("bad.corrupt."))).toBe(true);
  });

  it("migrates from a legacy key to the new key", () => {
    localStorage.setItem("old-key", JSON.stringify({ migrated: true }));
    const result = readJson("new-key", null, { legacyKeys: ["old-key"] });
    expect(result).toEqual({ migrated: true });
    expect(localStorage.getItem("new-key")).toBe(JSON.stringify({ migrated: true }));
  });

  it("readString migrates legacy string keys", () => {
    localStorage.setItem("legacy-token", "abc123");
    expect(readString("token", { legacyKeys: ["legacy-token"] })).toBe("abc123");
    expect(localStorage.getItem("token")).toBe("abc123");
  });
});
