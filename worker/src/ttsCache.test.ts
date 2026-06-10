import { describe, expect, it } from "vitest";
import { MAX_TTS_CACHE_BYTES, shouldCache, ttsHash, type TtsCacheParts } from "./ttsCache";

const base: TtsCacheParts = {
  text: "hello world",
  languageCode: "en-GB",
  voiceName: "en-GB-Neural2-A",
  speakingRate: 1,
  audioEncoding: "MP3",
};

describe("ttsHash", () => {
  it("is deterministic for identical input", async () => {
    expect(await ttsHash(base)).toBe(await ttsHash({ ...base }));
  });
  it("changes when any part changes", async () => {
    const h = await ttsHash(base);
    expect(await ttsHash({ ...base, text: "hello world!" })).not.toBe(h);
    expect(await ttsHash({ ...base, voiceName: "en-US-Neural2-D" })).not.toBe(h);
    expect(await ttsHash({ ...base, speakingRate: 1.25 })).not.toBe(h);
    expect(await ttsHash({ ...base, audioEncoding: "OGG_OPUS" })).not.toBe(h);
  });
  it("returns a 32-char hex string", async () => {
    expect(await ttsHash(base)).toMatch(/^[0-9a-f]{32}$/);
  });
});

describe("shouldCache", () => {
  it("rejects empty and oversized payloads", () => {
    expect(shouldCache(0)).toBe(false);
    expect(shouldCache(1024)).toBe(true);
    expect(shouldCache(MAX_TTS_CACHE_BYTES)).toBe(true);
    expect(shouldCache(MAX_TTS_CACHE_BYTES + 1)).toBe(false);
  });
});
