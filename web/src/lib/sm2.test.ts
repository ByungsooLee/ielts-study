import { describe, expect, it } from "vitest";
import { applySm2, createNewSched, gradeToQuality, SM2 } from "./sm2";

const TODAY = 20_000;

describe("gradeToQuality", () => {
  it("maps grades to SM-2 quality", () => {
    expect(gradeToQuality("forgot")).toBe(1);
    expect(gradeToQuality("maybe")).toBe(3);
    expect(gradeToQuality("remembered")).toBe(5);
  });
});

describe("applySm2", () => {
  it("first success → interval 1 day", () => {
    const sched = createNewSched(TODAY);
    const next = applySm2(sched, 5, TODAY);
    expect(next.reps).toBe(1);
    expect(next.interval).toBe(SM2.FIRST_INTERVAL);
    expect(next.due).toBe(TODAY + 1);
    expect(next.status).toBe("review");
  });

  it("second success → interval 6 days", () => {
    let sched = createNewSched(TODAY);
    sched = applySm2(sched, 5, TODAY);
    const next = applySm2(sched, 5, TODAY);
    expect(next.reps).toBe(2);
    expect(next.interval).toBe(SM2.SECOND_INTERVAL);
    expect(next.due).toBe(TODAY + 6);
  });

  it("failure resets reps and sets due today", () => {
    let sched = createNewSched(TODAY);
    sched = applySm2(sched, 5, TODAY);
    sched = applySm2(sched, 5, TODAY);
    const next = applySm2(sched, 1, TODAY + 6);
    expect(next.reps).toBe(0);
    expect(next.due).toBe(TODAY + 6);
    expect(next.lapses).toBe(1);
    expect(next.status).toBe("learning");
  });

  it("enforces EF floor", () => {
    let sched = createNewSched(TODAY);
    for (let i = 0; i < 20; i++) {
      sched = applySm2(sched, 3, TODAY + i);
    }
    expect(sched.ef).toBeGreaterThanOrEqual(SM2.MIN_EF);
  });

  it("suspends at reach lapses", () => {
    let sched = createNewSched(TODAY);
    for (let i = 0; i < SM2.REACH_LAPSES; i++) {
      sched = applySm2(sched, 1, TODAY + i);
    }
    expect(sched.status).toBe("suspended");
    expect(sched.lapses).toBe(SM2.REACH_LAPSES);
  });
});
