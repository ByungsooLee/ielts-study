import { describe, expect, it } from "vitest";
import {
  isSyncConfigured,
  LOCAL_WORKER_URL,
  PRODUCTION_WORKER_URL,
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
