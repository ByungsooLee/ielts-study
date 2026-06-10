import type { Env } from "./env";

export type Cors = Record<string, string>;

/** ルーティング中に投げる型付きエラー。トップレベルで errorJson に変換される。 */
export class HttpError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  BAD_REQUEST: "BAD_REQUEST",
  NOT_FOUND: "NOT_FOUND",
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  RATE_LIMITED: "RATE_LIMITED",
  TTS_NOT_CONFIGURED: "TTS_NOT_CONFIGURED",
  UPSTREAM_ERROR: "UPSTREAM_ERROR",
  INTERNAL: "INTERNAL",
} as const;

function isLocalDevOrigin(origin: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function getAllowedOrigins(env: Env): string[] {
  const raw = env.ALLOWED_ORIGIN || "*";
  if (raw === "*") return ["*"];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function resolveAllowOrigin(origin: string | null, env: Env): string {
  const allowedList = getAllowedOrigins(env);
  if (allowedList.includes("*")) return origin ?? "*";
  if (!origin) return allowedList[0] ?? "*";
  if (allowedList.includes(origin)) return origin;
  // localhost と 127.0.0.1 のポート違いも許可（Vite 開発用）
  if (isLocalDevOrigin(origin) && allowedList.some(isLocalDevOrigin)) return origin;
  return allowedList[0];
}

export function corsHeaders(origin: string | null, env: Env): Cors {
  return {
    "Access-Control-Allow-Origin": resolveAllowOrigin(origin, env),
    "Access-Control-Allow-Methods": "GET,PUT,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Expose-Headers":
      "X-TTS-Chars-Used, X-TTS-Monthly-Limit, X-TTS-Warning, X-TTS-Blocked, X-TTS-Cache",
    "Vary": "Origin",
  };
}

/** OPTIONS プリフライト応答。 */
export function handleOptions(cors: Cors): Response {
  return new Response(null, { status: 204, headers: cors });
}

/** 既存 Response に CORS ヘッダを足して返す（本文はそのまま）。 */
export function withCors(response: Response, cors: Cors): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(cors)) headers.set(k, v);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function json(
  data: unknown,
  status = 200,
  cors: Cors = {},
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors, ...extraHeaders },
  });
}

/** 統一エラー形式: { "error": { "code", "message", "details"? } } */
export function errorJson(
  code: string,
  message: string,
  status: number,
  cors: Cors = {},
  details?: unknown,
  extraHeaders: Record<string, string> = {},
): Response {
  const body: { error: { code: string; message: string; details?: unknown } } = {
    error: { code, message },
  };
  if (details !== undefined) body.error.details = details;
  return json(body, status, cors, extraHeaders);
}

/** Bearer 認証の共通検証。SYNC_TOKEN 未設定時は常に false（=401）。 */
export function requireAuth(request: Request, env: Pick<Env, "SYNC_TOKEN">): boolean {
  if (!env.SYNC_TOKEN) return false;
  const header = request.headers.get("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  return token.length > 0 && token === env.SYNC_TOKEN;
}

/** JSON ボディを安全に読む。不正な JSON は 400 を投げる（例外をそのまま出さない）。 */
export async function readJson<T>(request: Request): Promise<T> {
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    throw new HttpError(ERROR_CODES.BAD_REQUEST, "リクエストボディを読み取れませんでした", 400);
  }
  if (!raw.trim()) {
    throw new HttpError(ERROR_CODES.BAD_REQUEST, "リクエストボディが空です", 400);
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new HttpError(ERROR_CODES.BAD_REQUEST, "JSON 形式が不正です", 400);
  }
}
