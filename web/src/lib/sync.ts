import type { ProgressData } from "../types";
import { mergeProgress } from "./merge";
import { normalizeProgress } from "./progress";
import { STORAGE_KEYS, readJson, writeJson } from "./storage";

const DEBOUNCE_MS = 1200;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function loadLocalProgress(): ProgressData {
  const parsed = readJson<Partial<ProgressData> | null>(STORAGE_KEYS.progress, null);
  return normalizeProgress(parsed ?? {});
}

export function saveLocalProgress(progress: ProgressData): void {
  writeJson(STORAGE_KEYS.progress, progress);
}

async function workerFetch(
  workerUrl: string,
  syncToken: string,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const base = workerUrl.replace(/\/$/, "");
  return fetch(`${base}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${syncToken}`,
      ...(init?.headers ?? {}),
    },
  });
}

export async function fetchRemoteProgress(
  workerUrl: string,
  syncToken: string,
): Promise<ProgressData> {
  const res = await workerFetch(workerUrl, syncToken, "/progress");
  if (!res.ok) throw new Error(`進捗取得失敗 (${res.status})`);
  const data = (await res.json()) as Partial<ProgressData>;
  return normalizeProgress({ ...data, updatedAt: data.updatedAt ?? 0 });
}

export async function putRemoteProgress(
  workerUrl: string,
  syncToken: string,
  progress: ProgressData,
): Promise<void> {
  const res = await workerFetch(workerUrl, syncToken, "/progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(progress),
  });
  if (!res.ok) throw new Error(`進捗保存失敗 (${res.status})`);
}

export async function syncOnStartup(
  workerUrl: string,
  syncToken: string,
  local: ProgressData,
): Promise<ProgressData> {
  if (!workerUrl || !syncToken) return local;
  try {
    const remote = await fetchRemoteProgress(workerUrl, syncToken);
    const merged = mergeProgress(local, remote);
    saveLocalProgress(merged);
    if (JSON.stringify(merged) !== JSON.stringify(remote)) {
      await putRemoteProgress(workerUrl, syncToken, merged);
    }
    return merged;
  } catch {
    return local;
  }
}

export function scheduleSyncPut(
  workerUrl: string,
  syncToken: string,
  progress: ProgressData,
  onStatus?: (status: "syncing" | "ok" | "error") => void,
): void {
  saveLocalProgress(progress);
  if (!workerUrl || !syncToken) return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    onStatus?.("syncing");
    try {
      await putRemoteProgress(workerUrl, syncToken, progress);
      onStatus?.("ok");
    } catch {
      onStatus?.("error");
    }
  }, DEBOUNCE_MS);
}
