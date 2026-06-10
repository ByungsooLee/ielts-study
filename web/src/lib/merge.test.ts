import { describe, expect, it } from "vitest";
import { mergeProgress } from "./merge";
import type { ProgressData, Sched } from "../types";

function sched(partial: Partial<Sched>): Sched {
  return {
    ef: 2.5,
    reps: 1,
    interval: 1,
    due: 100,
    lapses: 0,
    maybeCount: 0,
    last: 0,
    status: "review",
    ...partial,
  };
}

function progress(partial: Partial<ProgressData>): ProgressData {
  return {
    srs: {},
    hard: {},
    userSentences: {},
    updatedAt: 0,
    ...partial,
  };
}

describe("mergeProgress srs (item-level by updatedAt)", () => {
  it("prefers the record with the newer updatedAt", () => {
    const local = progress({ srs: { a: sched({ reps: 1, updatedAt: 100 }) }, updatedAt: 100 });
    const remote = progress({ srs: { a: sched({ reps: 5, updatedAt: 200 }) }, updatedAt: 50 });
    const merged = mergeProgress(local, remote);
    expect(merged.srs.a.reps).toBe(5); // remote item newer despite older envelope
  });

  it("keeps the local record when it is newer", () => {
    const local = progress({ srs: { a: sched({ reps: 9, updatedAt: 300 }) } });
    const remote = progress({ srs: { a: sched({ reps: 1, updatedAt: 200 }) } });
    expect(mergeProgress(local, remote).srs.a.reps).toBe(9);
  });

  it("falls back to last when updatedAt is absent", () => {
    const local = progress({ srs: { a: sched({ reps: 1, last: 10 }) } });
    const remote = progress({ srs: { a: sched({ reps: 7, last: 20 }) } });
    expect(mergeProgress(local, remote).srs.a.reps).toBe(7);
  });

  it("unions items present on only one side", () => {
    const local = progress({ srs: { a: sched({}) } });
    const remote = progress({ srs: { b: sched({}) } });
    const merged = mergeProgress(local, remote);
    expect(Object.keys(merged.srs).sort()).toEqual(["a", "b"]);
  });
});

describe("mergeProgress streak", () => {
  it("preserves the longest streak across both sides", () => {
    const local = progress({ streak: { count: 3, lastDay: 5, longest: 10 } });
    const remote = progress({ streak: { count: 7, lastDay: 6, longest: 4 } });
    const merged = mergeProgress(local, remote);
    expect(merged.streak?.count).toBe(7); // newer lastDay wins for current
    expect(merged.streak?.longest).toBe(10); // never shrinks
  });

  it("derives longest from count when missing", () => {
    const local = progress({ streak: { count: 8, lastDay: 9 } });
    const remote = progress({ streak: { count: 2, lastDay: 3 } });
    expect(mergeProgress(local, remote).streak?.longest).toBe(8);
  });
});

describe("mergeProgress schemaVersion", () => {
  it("never drops below 3", () => {
    const merged = mergeProgress(progress({ schemaVersion: 2 }), progress({ schemaVersion: 1 }));
    expect(merged.schemaVersion).toBeGreaterThanOrEqual(3);
  });
});
