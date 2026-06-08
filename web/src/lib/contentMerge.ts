import type { ContentData, ContentRecord, StudyItem } from "../types";

function enrichItemFromRemote(local: StudyItem, remote: StudyItem): StudyItem {
  if (local.theme || !remote.theme) return local;
  return {
    ...local,
    theme: remote.theme,
    themeName: remote.themeName ?? local.themeName,
  };
}

function mergeRecordPair(local: ContentRecord, remote: ContentRecord): ContentRecord {
  if (remote.importedAt >= local.importedAt) {
    const item = enrichItemFromRemote(remote.item, local.item);
    return { ...remote, item };
  }
  const item = enrichItemFromRemote(local.item, remote.item);
  return { ...local, item };
}

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
    if (!existing) {
      map.set(record.id, record);
    } else {
      map.set(record.id, mergeRecordPair(existing, record));
    }
  }
  return {
    records: [...map.values()],
    updatedAt: Math.max(local.updatedAt, remote.updatedAt, Date.now()),
  };
}
