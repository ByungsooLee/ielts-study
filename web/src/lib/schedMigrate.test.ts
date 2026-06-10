import { describe, expect, it } from "vitest";
import { SCHEMA_VERSION, ensureSchemaVersion, migrateLegacyRecord } from "./schedMigrate";
import type { LegacySrsRecord, ProgressData } from "../types";

describe("migrateLegacyRecord", () => {
  it("converts a legacy box record to a Sched", () => {
    const legacy: LegacySrsRecord = { box: 2, due: 100, ts: 999, lapses: 0 };
    const sched = migrateLegacyRecord(legacy);
    expect(sched.status).toBeDefined();
    expect(sched.reps).toBe(2);
    expect(sched.maybeCount).toBe(0);
  });
});

describe("ensureSchemaVersion (v3)", () => {
  it("bumps to the latest schema version", () => {
    const out = ensureSchemaVersion({
      srs: {},
      hard: {},
      userSentences: {},
      updatedAt: 0,
      schemaVersion: 2,
    } as ProgressData);
    expect(out.schemaVersion).toBe(SCHEMA_VERSION);
    expect(SCHEMA_VERSION).toBe(3);
  });

  it("adds userId and deviceId envelope fields", () => {
    const out = ensureSchemaVersion({
      srs: {},
      hard: {},
      userSentences: {},
      updatedAt: 0,
    } as ProgressData);
    expect(out.userId).toBe("default");
    expect(typeof out.deviceId).toBe("string");
    expect(out.deviceId!.length).toBeGreaterThan(0);
  });

  it("backfills streak.longest without shrinking", () => {
    const out = ensureSchemaVersion({
      srs: {},
      hard: {},
      userSentences: {},
      updatedAt: 0,
      streak: { count: 6, lastDay: 3 },
    } as ProgressData);
    expect(out.streak?.longest).toBe(6);
  });

  it("is idempotent and still backfills envelope when already current", () => {
    const once = ensureSchemaVersion({
      srs: {},
      hard: {},
      userSentences: {},
      updatedAt: 0,
    } as ProgressData);
    const twice = ensureSchemaVersion(once);
    expect(twice.schemaVersion).toBe(SCHEMA_VERSION);
    expect(twice.userId).toBe("default");
  });
});
