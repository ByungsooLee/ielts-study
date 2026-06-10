import { describe, expect, it } from "vitest";
import { hasEngineeringDiagram } from "./domain";
import type { StudyItem } from "../types";

describe("hasEngineeringDiagram", () => {
  it("returns true when diagram.mermaid is present", () => {
    const item = {
      id: "x",
      type: "concept",
      front: "Test",
      meaning: "m",
      diagram: { type: "flowchart", mermaid: "flowchart LR\n  A --> B" },
    } as StudyItem;
    expect(hasEngineeringDiagram(item)).toBe(true);
  });

  it("returns false when mermaid is empty or missing", () => {
    const item = {
      id: "x",
      type: "concept",
      front: "Test",
      meaning: "m",
      diagram: { type: "flowchart", mermaid: "  " },
    } as StudyItem;
    expect(hasEngineeringDiagram(item)).toBe(false);
    expect(hasEngineeringDiagram({ ...item, diagram: undefined })).toBe(false);
  });
});
