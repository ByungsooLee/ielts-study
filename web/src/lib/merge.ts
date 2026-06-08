import type { ProgressData, Sched, UserSentence } from "../types";

function mergeSched(local: Record<string, Sched>, remote: Record<string, Sched>) {
  const merged: Record<string, Sched> = { ...local };
  for (const [id, remoteRecord] of Object.entries(remote)) {
    const localRecord = merged[id];
    if (!localRecord || remoteRecord.last > localRecord.last) {
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

function mergeDailyMeta(
  local: ProgressData["dailyMeta"],
  remote: ProgressData["dailyMeta"],
): ProgressData["dailyMeta"] {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  if (local.day !== remote.day) return local.day > remote.day ? local : remote;
  return local.newIntroduced >= remote.newIntroduced ? local : remote;
}

function mergeStreak(local: ProgressData["streak"], remote: ProgressData["streak"]) {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.lastDay >= remote.lastDay ? local : remote;
}

export function mergeProgress(local: ProgressData, remote: ProgressData): ProgressData {
  const localUpdatedAt = local.updatedAt ?? 0;
  const remoteUpdatedAt = remote.updatedAt ?? 0;
  return {
    srs: mergeSched(local.srs ?? {}, remote.srs ?? {}),
    hard: mergeHard(local.hard ?? {}, remote.hard ?? {}, localUpdatedAt, remoteUpdatedAt),
    userSentences: mergeSentences(local.userSentences ?? {}, remote.userSentences ?? {}),
    streak: mergeStreak(local.streak, remote.streak),
    dailyMeta: mergeDailyMeta(local.dailyMeta, remote.dailyMeta),
    schemaVersion: Math.max(local.schemaVersion ?? 1, remote.schemaVersion ?? 1, 2),
    updatedAt: Math.max(localUpdatedAt, remoteUpdatedAt, Date.now()),
  };
}

export function progressEquals(a: ProgressData, b: ProgressData): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
