/** テスト用の最小 KVNamespace モック（必要なメソッドのみ）。 */
export function createFakeKv(initial: Record<string, unknown> = {}) {
  const store = new Map<string, unknown>(Object.entries(initial));
  const kv = {
    store,
    async get(key: string, type?: "text" | "arrayBuffer" | "json") {
      if (!store.has(key)) return null;
      const value = store.get(key);
      if (type === "arrayBuffer") return value as ArrayBuffer;
      if (type === "json") return typeof value === "string" ? JSON.parse(value) : value;
      return value as string;
    },
    async put(key: string, value: unknown) {
      store.set(key, value);
    },
    async delete(key: string) {
      store.delete(key);
    },
  };
  return kv as unknown as KVNamespace & { store: Map<string, unknown> };
}

export interface FakeEnvOptions {
  syncToken?: string;
  googleKey?: string;
  allowedOrigin?: string;
  ttsMonthlyLimit?: string;
  kv?: KVNamespace;
}

export function createFakeEnv(opts: FakeEnvOptions = {}) {
  return {
    IELTS_KV: opts.kv ?? createFakeKv(),
    SYNC_TOKEN: opts.syncToken ?? "secret-token",
    GOOGLE_TTS_KEY: opts.googleKey ?? "",
    ALLOWED_ORIGIN: opts.allowedOrigin ?? "*",
    TTS_MONTHLY_LIMIT: opts.ttsMonthlyLimit,
  };
}

export function authHeaders(token = "secret-token"): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}
