import { describe, expect, it } from "vitest";
import { buildHighlightedParts, findTargetSpans } from "./passageHighlight";

describe("passageHighlight", () => {
  it("matches inflected word forms via targets.text", () => {
    const en = "Some believe bold pioneers, skilled seafarers, sailed east.";
    const spans = findTargetSpans(en, [
      { id: "w-pioneer", text: "pioneers" },
      { id: "w-seafarer", text: "seafarers" },
    ]);
    expect(spans.map((s) => s.text)).toEqual(["pioneers", "seafarers"]);
    expect(spans.map((s) => s.id)).toEqual(["w-pioneer", "w-seafarer"]);
  });

  it("matches multi-word phrases without word boundaries", () => {
    const en = "Later explorers chose to follow in his footsteps.";
    const spans = findTargetSpans(en, [
      { id: "p-follow", text: "follow in his footsteps" },
    ]);
    expect(spans).toHaveLength(1);
    expect(spans[0].id).toBe("p-follow");
  });

  it("builds parts with id for gloss lookup", () => {
    const parts = buildHighlightedParts("He dubbed the raft Kon-Tiki.", [
      { id: "w-dub", text: "dubbed" },
    ]);
    const hit = parts.find((p) => p.highlight);
    expect(hit?.text).toBe("dubbed");
    expect(hit?.id).toBe("w-dub");
  });
});
