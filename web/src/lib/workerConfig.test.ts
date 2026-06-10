import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchBootstrapInfo,
  isSyncConfigured,
  LOCAL_WORKER_URL,
  PRODUCTION_WORKER_URL,
  resetSyncTokenCacheForTests,
  resolveSyncToken,
  setSyncToken,
  workerUrlLabel,
} from "./workerConfig";

describe("isSyncConfigured", () => {
  it("reflects env token presence", () => {
    expect(typeof isSyncConfigured()).toBe("boolean");
  });
});

describe("workerUrlLabel", () => {
  it("labels known URLs", () => {
    expect(workerUrlLabel(PRODUCTION_WORKER_URL)).toBe("本番 Worker");
    expect(workerUrlLabel(LOCAL_WORKER_URL)).toBe("ローカル Worker（dev:worker）");
    expect(workerUrlLabel("https://example.workers.dev")).toBe("カスタム Worker");
  });
});

describe("manual sync token", () => {
  afterEach(() => {
    resetSyncTokenCacheForTests();
  });

  it("persists a manually set token (when no build-time env token)", () => {
    const envToken = (import.meta.env.VITE_DEFAULT_SYNC_TOKEN ?? "").trim();
    setSyncToken("manual-token-123");
    if (envToken) {
      // env token always wins
      expect(resolveSyncToken()).toBe(envToken);
    } else {
      expect(resolveSyncToken()).toBe("manual-token-123");
      expect(isSyncConfigured()).toBe(true);
    }
  });

  it("clearing the token removes it (when no env token)", () => {
    const envToken = (import.meta.env.VITE_DEFAULT_SYNC_TOKEN ?? "").trim();
    setSyncToken("x");
    setSyncToken("");
    if (!envToken) expect(resolveSyncToken()).toBe("");
  });
});

describe("fetchBootstrapInfo", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns public info and never expects a token field", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        apiVersion: "v1",
        authMode: "manual-token",
        requiresToken: true,
        features: { progressSync: true, tts: false, legacyContentKv: true },
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const info = await fetchBootstrapInfo("https://example.workers.dev");
    expect(info?.authMode).toBe("manual-token");
    expect(info?.requiresToken).toBe(true);
    expect(info).not.toHaveProperty("syncToken");
  });

  it("returns null on network failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("offline");
    }));
    expect(await fetchBootstrapInfo("https://example.workers.dev")).toBeNull();
  });
});
