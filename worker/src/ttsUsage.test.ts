import { describe, expect, it } from "vitest";
import { createFakeKv } from "./testUtils";
import { ttsUsageKey, LEGACY_TTS_USAGE_KEY } from "./keys";
import {
  addTtsUsage,
  buildTtsUsageStatus,
  countChars,
  getTtsUsage,
  resolveMonthlyLimit,
  wouldExceedLimit,
} from "./ttsUsage";

const MONTH = "2026-06";

describe("countChars", () => {
  it("counts unicode code points", () => {
    expect(countChars("abc")).toBe(3);
    expect(countChars("あ🙂")).toBe(2);
  });
});

describe("resolveMonthlyLimit", () => {
  it("defaults to free limit", () => {
    expect(resolveMonthlyLimit(undefined)).toBe(1_000_000);
    expect(resolveMonthlyLimit("0")).toBe(1_000_000);
    expect(resolveMonthlyLimit("abc")).toBe(1_000_000);
  });
  it("honors a valid override", () => {
    expect(resolveMonthlyLimit("500")).toBe(500);
  });
});

describe("getTtsUsage", () => {
  it("returns zero when empty", async () => {
    const kv = createFakeKv();
    expect(await getTtsUsage(kv, "default", MONTH)).toEqual({ month: MONTH, charsUsed: 0 });
  });
  it("reads the per-month-per-user key", async () => {
    const kv = createFakeKv({ [ttsUsageKey(MONTH, "default")]: JSON.stringify({ month: MONTH, charsUsed: 42 }) });
    expect(await getTtsUsage(kv, "default", MONTH)).toEqual({ month: MONTH, charsUsed: 42 });
  });
  it("falls back to the legacy single key for the same month", async () => {
    const kv = createFakeKv({ [LEGACY_TTS_USAGE_KEY]: JSON.stringify({ month: MONTH, charsUsed: 7 }) });
    expect(await getTtsUsage(kv, "default", MONTH)).toEqual({ month: MONTH, charsUsed: 7 });
  });
  it("ignores legacy data from a different month", async () => {
    const kv = createFakeKv({ [LEGACY_TTS_USAGE_KEY]: JSON.stringify({ month: "2025-01", charsUsed: 99 }) });
    expect(await getTtsUsage(kv, "default", MONTH)).toEqual({ month: MONTH, charsUsed: 0 });
  });
});

describe("addTtsUsage", () => {
  it("accumulates into the new key", async () => {
    const kv = createFakeKv();
    await addTtsUsage(kv, 10, "default", MONTH);
    const after = await addTtsUsage(kv, 5, "default", MONTH);
    expect(after.charsUsed).toBe(15);
    expect(kv.store.has(ttsUsageKey(MONTH, "default"))).toBe(true);
  });
});

describe("wouldExceedLimit", () => {
  it("blocks when sum exceeds limit", () => {
    expect(wouldExceedLimit(999_999, 2, 1_000_000)).toBe(true);
    expect(wouldExceedLimit(900_000, 100, 1_000_000)).toBe(false);
  });
});

describe("buildTtsUsageStatus", () => {
  it("flags warning at 80% and blocked at limit", () => {
    expect(buildTtsUsageStatus({ month: MONTH, charsUsed: 850_000 }).warning).toBe(true);
    expect(buildTtsUsageStatus({ month: MONTH, charsUsed: 1_000_000 }).blocked).toBe(true);
    expect(buildTtsUsageStatus({ month: MONTH, charsUsed: 100 }).warning).toBe(false);
  });
});
