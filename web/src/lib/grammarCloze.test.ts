import { describe, expect, it } from "vitest";
import { matchClozeAnswer, parseAcceptedAnswers } from "./grammarCloze";

describe("grammarCloze", () => {
  it("matches case-insensitively with trimmed whitespace", () => {
    expect(matchClozeAnswer("  Turn  ", "turn")).toBe(true);
  });

  it("accepts slash-separated alternatives", () => {
    expect(matchClozeAnswer("did", "did / finish")).toBe(true);
    expect(matchClozeAnswer("finish", "did / finish")).toBe(true);
    expect(matchClozeAnswer("done", "did / finish")).toBe(false);
  });

  it("treats (なし) as empty answer", () => {
    expect(parseAcceptedAnswers("(なし)")).toEqual([""]);
    expect(matchClozeAnswer("", "(なし)")).toBe(true);
    expect(matchClozeAnswer("the", "(なし)")).toBe(false);
  });

  it("matches multi-word answers", () => {
    expect(matchClozeAnswer("has been snowing", "has been snowing")).toBe(true);
  });
});
