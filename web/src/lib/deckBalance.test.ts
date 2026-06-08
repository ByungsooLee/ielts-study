import { describe, expect, it } from "vitest";
import { interleaveEvenly } from "./deckBalance";

describe("interleaveEvenly", () => {
  it("returns primary only when secondary is empty", () => {
    expect(interleaveEvenly(["a", "b", "c"], [], 2)).toEqual(["a", "b"]);
  });

  it("spreads secondary items across the deck", () => {
    const result = interleaveEvenly(
      ["L1", "L2", "L3", "L4", "L5", "L6", "L7"],
      ["U1", "U2", "U3"],
      10,
    );
    expect(result.filter((x) => x.startsWith("U"))).toEqual(["U1", "U2", "U3"]);
    const uPositions = result
      .map((x, i) => (x.startsWith("U") ? i : -1))
      .filter((i) => i >= 0);
    expect(uPositions).toHaveLength(3);
    expect(uPositions[1] - uPositions[0]).toBeGreaterThan(0);
    expect(uPositions[2] - uPositions[1]).toBeGreaterThan(0);
    expect(uPositions[0]).toBeGreaterThanOrEqual(0);
    expect(uPositions[2]).toBeLessThan(result.length);
  });

  it("respects limit", () => {
    expect(interleaveEvenly(["a", "b", "c"], ["x", "y"], 3)).toHaveLength(3);
  });
});
