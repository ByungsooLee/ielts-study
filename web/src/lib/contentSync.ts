import { upsertContent } from "../db";
import type { ContentData, ContentRecord } from "../types";
import { mergeContent, normalizeContentData, recordsToContentData } from "./contentMerge";

const CONTENT_DEBOUNCE_MS = 1500;

let contentDebounceTimer: ReturnType<typeof setTimeout> | null = null;

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

export async function fetchRemoteContent(
  workerUrl: string,
  syncToken: string,
): Promise<ContentData> {
  const res = await workerFetch(workerUrl, syncToken, "/content");
  if (!res.ok) throw new Error(`教材取得失敗 (${res.status})`);
  const data = (await res.json()) as Partial<ContentData>;
  return normalizeContentData(data);
}

export async function putRemoteContent(
  workerUrl: string,
  syncToken: string,
  content: ContentData,
): Promise<void> {
  const res = await workerFetch(workerUrl, syncToken, "/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
  if (!res.ok) throw new Error(`教材保存失敗 (${res.status})`);
}

export async function syncContentOnStartup(
  workerUrl: string,
  syncToken: string,
  localRecords: ContentRecord[],
): Promise<ContentRecord[]> {
  if (!workerUrl || !syncToken) return localRecords;
  try {
    const local = recordsToContentData(localRecords);
    const remote = await fetchRemoteContent(workerUrl, syncToken);
    const merged = mergeContent(local, remote);
    if (merged.records.length > 0) {
      await upsertContent(merged.records);
    }
    if (JSON.stringify(merged) !== JSON.stringify(remote)) {
      await putRemoteContent(workerUrl, syncToken, merged);
    }
    return merged.records;
  } catch {
    return localRecords;
  }
}

export function scheduleContentSyncPut(
  workerUrl: string,
  syncToken: string,
  records: ContentRecord[],
  onStatus?: (status: "syncing" | "ok" | "error") => void,
): void {
  if (!workerUrl || !syncToken) return;
  if (contentDebounceTimer) clearTimeout(contentDebounceTimer);
  contentDebounceTimer = setTimeout(async () => {
    onStatus?.("syncing");
    try {
      await putRemoteContent(workerUrl, syncToken, recordsToContentData(records));
      onStatus?.("ok");
    } catch {
      onStatus?.("error");
    }
  }, CONTENT_DEBOUNCE_MS);
}
