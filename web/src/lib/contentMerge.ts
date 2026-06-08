import type { ContentData, ContentRecord } from "../types";

export function normalizeContentData(data: Partial<ContentData>): ContentData {
  return {
    records: Array.isArray(data.records) ? data.records : [],
    updatedAt: data.updatedAt ?? 0,
  };
}

export function recordsToContentData(records: ContentRecord[]): ContentData {
  return {
    records,
    updatedAt: Date.now(),
  };
}

export function mergeContent(local: ContentData, remote: ContentData): ContentData {
  const map = new Map<string, ContentRecord>();
  for (const record of local.records) map.set(record.id, record);
  for (const record of remote.records) {
    const existing = map.get(record.id);
    if (!existing || record.importedAt >= existing.importedAt) {
      map.set(record.id, record);
    }
  }
  return {
    records: [...map.values()],
    updatedAt: Math.max(local.updatedAt, remote.updatedAt, Date.now()),
  };
}
