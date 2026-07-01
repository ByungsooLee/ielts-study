import { afterEach, describe, expect, it, vi } from "vitest";
import worker from "./index";
import { createFakeEnv, createFakeKv, authHeaders } from "./testUtils";
import { LEGACY_PROGRESS_KEY, progressKey, ttsCacheKey } from "./keys";
import { ttsHash } from "./ttsCache";

function req(path: string, init?: RequestInit) {
  return new Request(`https://worker.test${path}`, init);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("/app-bootstrap", () => {
  it("returns public info and NEVER leaks SYNC_TOKEN", async () => {
    const env = createFakeEnv({ syncToken: "top-secret", googleKey: "g" });
    const res = await worker.fetch(req("/app-bootstrap"), env);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      apiVersion: "v1",
      authMode: "manual-token",
      requiresToken: true,
      features: { progressSync: true, tts: true, legacyContentKv: false },
    });
    expect(JSON.stringify(body)).not.toContain("top-secret");
  });
  it("reflects tts feature flag from GOOGLE_TTS_KEY", async () => {
    const res = await worker.fetch(req("/app-bootstrap"), createFakeEnv({ googleKey: "" }));
    const body = (await res.json()) as { features: { tts: boolean } };
    expect(body.features.tts).toBe(false);
  });
});

describe("auth + routing", () => {
  it("401 with unified error shape when unauthenticated", async () => {
    const res = await worker.fetch(req("/progress"), createFakeEnv());
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } });
  });
  it("404 for unknown authenticated route", async () => {
    const res = await worker.fetch(req("/nope", { headers: authHeaders() }), createFakeEnv());
    expect(res.status).toBe(404);
    expect(((await res.json()) as { error: { code: string } }).error.code).toBe("NOT_FOUND");
  });
  it("204 for OPTIONS preflight", async () => {
    const res = await worker.fetch(req("/progress", { method: "OPTIONS" }), createFakeEnv());
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeTruthy();
  });
});

describe("/progress", () => {
  it("GET falls back to the legacy key", async () => {
    const kv = createFakeKv({ [LEGACY_PROGRESS_KEY]: JSON.stringify({ schemaVersion: 2, srs: {} }) });
    const env = createFakeEnv({ kv });
    const res = await worker.fetch(req("/progress", { headers: authHeaders() }), env);
    expect(res.status).toBe(200);
    expect(((await res.json()) as { schemaVersion: number }).schemaVersion).toBe(2);
  });
  it("PUT writes to the new namespaced key", async () => {
    const kv = createFakeKv();
    const env = createFakeEnv({ kv });
    const res = await worker.fetch(
      req("/progress", { method: "PUT", headers: authHeaders(), body: JSON.stringify({ srs: {} }) }),
      env,
    );
    expect(res.status).toBe(200);
    expect(kv.store.has(progressKey("default"))).toBe(true);
  });
  it("PUT rejects invalid JSON with 400", async () => {
    const env = createFakeEnv();
    const res = await worker.fetch(
      req("/progress", { method: "PUT", headers: authHeaders(), body: "{oops" }),
      env,
    );
    expect(res.status).toBe(400);
    expect(((await res.json()) as { error: { code: string } }).error.code).toBe("BAD_REQUEST");
  });
  it("PUT rejects non-object body with 400", async () => {
    const env = createFakeEnv();
    const res = await worker.fetch(
      req("/progress", { method: "PUT", headers: authHeaders(), body: "[1,2,3]" }),
      env,
    );
    expect(res.status).toBe(400);
  });
});

describe("/tts", () => {
  it("returns 429 when the monthly limit would be exceeded", async () => {
    const env = createFakeEnv({ googleKey: "g", ttsMonthlyLimit: "5" });
    const res = await worker.fetch(
      req("/tts", { method: "POST", headers: authHeaders(), body: JSON.stringify({ text: "abcdef" }) }),
      env,
    );
    expect(res.status).toBe(429);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("RATE_LIMITED");
    expect(res.headers.get("X-TTS-Blocked")).toBeTruthy();
  });

  it("503 when generating without GOOGLE_TTS_KEY", async () => {
    const env = createFakeEnv({ googleKey: "" });
    const res = await worker.fetch(
      req("/tts", { method: "POST", headers: authHeaders(), body: JSON.stringify({ text: "hi" }) }),
      env,
    );
    expect(res.status).toBe(503);
    expect(((await res.json()) as { error: { code: string } }).error.code).toBe("TTS_NOT_CONFIGURED");
  });

  it("400 when text is missing", async () => {
    const env = createFakeEnv({ googleKey: "g" });
    const res = await worker.fetch(
      req("/tts", { method: "POST", headers: authHeaders(), body: JSON.stringify({}) }),
      env,
    );
    expect(res.status).toBe(400);
  });

  it("serves cache hit without calling Google or adding usage", async () => {
    const hash = await ttsHash({
      text: "cached",
      languageCode: "en-GB",
      voiceName: "en-GB-Neural2-B",
      speakingRate: 1,
      audioEncoding: "MP3",
    });
    const mp3 = new Uint8Array([1, 2, 3]).buffer;
    const kv = createFakeKv({ [ttsCacheKey(hash)]: mp3 });
    const env = createFakeEnv({ kv, googleKey: "g" });
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const res = await worker.fetch(
      req("/tts", { method: "POST", headers: authHeaders(), body: JSON.stringify({ text: "cached" }) }),
      env,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("X-TTS-Cache")).toBe("hit");
    expect(res.headers.get("Content-Type")).toBe("audio/mpeg");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("generates, counts usage, and caches on a miss", async () => {
    const kv = createFakeKv();
    const env = createFakeEnv({ kv, googleKey: "g" });
    const audioContent = btoa("hello-mp3-bytes");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ audioContent }), { status: 200 }),
    );

    const res = await worker.fetch(
      req("/tts", { method: "POST", headers: authHeaders(), body: JSON.stringify({ text: "hello" }) }),
      env,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("X-TTS-Cache")).toBe("miss");
    expect(Number(res.headers.get("X-TTS-Chars-Used"))).toBe(5);
    const hash = await ttsHash({
      text: "hello",
      languageCode: "en-GB",
      voiceName: "en-GB-Neural2-B",
      speakingRate: 1,
      audioEncoding: "MP3",
    });
    expect(kv.store.has(ttsCacheKey(hash))).toBe(true);
  });
});
