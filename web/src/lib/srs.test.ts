import { describe, expect, it } from "vitest";
import { applyGrade } from "./srs";
import { createNewSched } from "./sm2";

const TODAY = 20_000;

describe("applyGrade maybeCount", () => {
  it("increments maybeCount only for maybe grade", () => {
    const sched = createNewSched(TODAY);
    const afterMaybe = applyGrade(sched, "maybe", TODAY);
    expect(afterMaybe.maybeCount).toBe(1);

    const afterRemembered = applyGrade(afterMaybe, "remembered", TODAY);
    expect(afterRemembered.maybeCount).toBe(1);

    const afterForgot = applyGrade(afterRemembered, "forgot", TODAY);
    expect(afterForgot.maybeCount).toBe(1);
  });

  it("starts from zero for new sched", () => {
    expect(createNewSched(TODAY).maybeCount).toBe(0);
  });
});
