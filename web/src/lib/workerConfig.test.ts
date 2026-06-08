import { afterEach, describe, expect, it, vi } from "vitest";
import {
  bootstrapSyncToken,
  isSyncConfigured,
  LOCAL_WORKER_URL,
  PRODUCTION_WORKER_URL,
  resetSyncTokenCacheForTests,
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

describe("bootstrapSyncToken", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    resetSyncTokenCacheForTests();
  });

  it("fetches and caches token from Worker bootstrap endpoint", async () => {
    resetSyncTokenCacheForTests();
    const envToken = (import.meta.env.VITE_DEFAULT_SYNC_TOKEN ?? "").trim();
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ syncToken: "test-token-abc" }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const token = await bootstrapSyncToken("https://example.workers.dev");
    if (envToken) {
      expect(token).toBe(envToken);
      expect(fetchMock).not.toHaveBeenCalled();
    } else {
      expect(token).toBe("test-token-abc");
      expect(isSyncConfigured()).toBe(true);
    }
  });
});
