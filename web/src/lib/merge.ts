import type { ProgressData, SrsRecord, UserSentence } from "../types";

function mergeSrs(local: Record<string, SrsRecord>, remote: Record<string, SrsRecord>) {
  const merged: Record<string, SrsRecord> = { ...local };
  for (const [id, remoteRecord] of Object.entries(remote)) {
    const localRecord = merged[id];
    if (!localRecord || remoteRecord.ts > localRecord.ts) {
      merged[id] = remoteRecord;
    }
  }
  return merged;
}

function mergeHard(
  local: Record<string, boolean>,
  remote: Record<string, boolean>,
  localUpdatedAt: number,
  remoteUpdatedAt: number,
) {
  const merged: Record<string, boolean> = { ...local };
  const preferRemote = remoteUpdatedAt > localUpdatedAt;
  const ids = new Set([...Object.keys(local), ...Object.keys(remote)]);
  for (const id of ids) {
    const l = local[id];
    const r = remote[id];
    if (l === undefined) merged[id] = r;
    else if (r === undefined) merged[id] = l;
    else if (preferRemote) merged[id] = r;
    else if (localUpdatedAt === remoteUpdatedAt) merged[id] = l || r;
    else merged[id] = l;
  }
  return merged;
}

function mergeSentences(
  local: Record<string, UserSentence[]>,
  remote: Record<string, UserSentence[]>,
) {
  const merged: Record<string, UserSentence[]> = { ...local };
  for (const [itemId, remoteList] of Object.entries(remote)) {
    const map = new Map<string, UserSentence>();
    for (const sentence of merged[itemId] ?? []) map.set(sentence.id, sentence);
    for (const sentence of remoteList) {
      const existing = map.get(sentence.id);
      if (!existing || sentence.createdAt >= existing.createdAt) {
        map.set(sentence.id, sentence);
      }
    }
    merged[itemId] = [...map.values()].sort((a, b) => b.createdAt - a.createdAt);
  }
  return merged;
}

export function mergeProgress(local: ProgressData, remote: ProgressData): ProgressData {
  const localUpdatedAt = local.updatedAt ?? 0;
  const remoteUpdatedAt = remote.updatedAt ?? 0;
  return {
    srs: mergeSrs(local.srs ?? {}, remote.srs ?? {}),
    hard: mergeHard(local.hard ?? {}, remote.hard ?? {}, localUpdatedAt, remoteUpdatedAt),
    userSentences: mergeSentences(local.userSentences ?? {}, remote.userSentences ?? {}),
    updatedAt: Math.max(localUpdatedAt, remoteUpdatedAt, Date.now()),
  };
}

export function progressEquals(a: ProgressData, b: ProgressData): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
