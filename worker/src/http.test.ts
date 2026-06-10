import { describe, expect, it } from "vitest";
import { ERROR_CODES, HttpError, errorJson, readJson, requireAuth } from "./http";

describe("requireAuth", () => {
  const env = { SYNC_TOKEN: "secret" };
  it("rejects when no header", () => {
    expect(requireAuth(new Request("https://x/"), env)).toBe(false);
  });
  it("rejects wrong token", () => {
    const req = new Request("https://x/", { headers: { Authorization: "Bearer nope" } });
    expect(requireAuth(req, env)).toBe(false);
  });
  it("accepts correct bearer token", () => {
    const req = new Request("https://x/", { headers: { Authorization: "Bearer secret" } });
    expect(requireAuth(req, env)).toBe(true);
  });
  it("rejects everything when SYNC_TOKEN unset", () => {
    const req = new Request("https://x/", { headers: { Authorization: "Bearer secret" } });
    expect(requireAuth(req, { SYNC_TOKEN: "" })).toBe(false);
  });
});

describe("readJson", () => {
  it("parses valid json", async () => {
    const req = new Request("https://x/", { method: "PUT", body: JSON.stringify({ a: 1 }) });
    await expect(readJson<{ a: number }>(req)).resolves.toEqual({ a: 1 });
  });
  it("throws 400 on empty body", async () => {
    const req = new Request("https://x/", { method: "PUT", body: "" });
    await expect(readJson(req)).rejects.toMatchObject({ status: 400, code: ERROR_CODES.BAD_REQUEST });
  });
  it("throws 400 on invalid json", async () => {
    const req = new Request("https://x/", { method: "PUT", body: "{not json" });
    await expect(readJson(req)).rejects.toBeInstanceOf(HttpError);
  });
});

describe("errorJson", () => {
  it("uses the unified { error: { code, message } } shape", async () => {
    const res = errorJson(ERROR_CODES.UNAUTHORIZED, "Unauthorized", 401);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } });
  });
  it("includes details when provided", async () => {
    const res = errorJson(ERROR_CODES.RATE_LIMITED, "limit", 429, {}, { charsUsed: 5 });
    const body = (await res.json()) as { error: { details?: unknown } };
    expect(body.error.details).toEqual({ charsUsed: 5 });
  });
});
