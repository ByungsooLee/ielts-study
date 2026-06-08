import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  AudioCacheEntry,
  ContentRecord,
  DictCacheEntry,
  Domain,
  Recording,
} from "../types";

export interface ShardMeta {
  key: string;
  collectionId: string;
  domain: Domain;
  theme: number;
  file: string;
  version: string;
  syncedAt: number;
}

interface IeltsDB extends DBSchema {
  content: {
    key: string;
    value: ContentRecord;
  };
  shardMeta: {
    key: string;
    value: ShardMeta;
  };
  audioCache: {
    key: string;
    value: AudioCacheEntry;
  };
  dictCache: {
    key: string;
    value: DictCacheEntry;
  };
  recordings: {
    key: string;
    value: Recording;
    indexes: { "by-itemId": string };
  };
}

const DB_NAME = "ielts-study";
const DB_VERSION = 3;

let dbPromise: Promise<IDBPDatabase<IeltsDB>> | null = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<IeltsDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("content")) {
          db.createObjectStore("content", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("audioCache")) {
          db.createObjectStore("audioCache", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("dictCache")) {
          db.createObjectStore("dictCache", { keyPath: "word" });
        }
        if (!db.objectStoreNames.contains("recordings")) {
          const store = db.createObjectStore("recordings", { keyPath: "id" });
          store.createIndex("by-itemId", "itemId");
        }
        if (!db.objectStoreNames.contains("shardMeta")) {
          db.createObjectStore("shardMeta", { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

export function shardMetaKey(collectionId: string, theme: number): string {
  return `${collectionId}:theme-${theme}`;
}

export async function getShardMeta(collectionId: string, theme: number): Promise<ShardMeta | null> {
  const db = await getDb();
  return (await db.get("shardMeta", shardMetaKey(collectionId, theme))) ?? null;
}

export async function setShardMeta(meta: ShardMeta): Promise<void> {
  const db = await getDb();
  await db.put("shardMeta", meta);
}

export async function replaceThemeContent(
  collection: string,
  theme: number,
  records: ContentRecord[],
): Promise<void> {
  const db = await getDb();
  const all = await db.getAll("content");
  const toDelete = all
    .filter((r) => r.item.collection === collection && r.item.theme === theme)
    .map((r) => r.id);
  const tx = db.transaction("content", "readwrite");
  await Promise.all([
    ...toDelete.map((id) => tx.store.delete(id)),
    ...records.map((record) => tx.store.put(record)),
    tx.done,
  ]);
}

export async function getAllContent(): Promise<ContentRecord[]> {
  const db = await getDb();
  return db.getAll("content");
}

export async function upsertContent(records: ContentRecord[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("content", "readwrite");
  await Promise.all([
    ...records.map((record) => tx.store.put(record)),
    tx.done,
  ]);
}

export async function getAudioCache(key: string): Promise<Blob | null> {
  const db = await getDb();
  const entry = await db.get("audioCache", key);
  return entry?.blob ?? null;
}

export async function setAudioCache(key: string, blob: Blob): Promise<void> {
  const db = await getDb();
  await db.put("audioCache", { key, blob, cachedAt: Date.now() });
}

export async function getDictCache(word: string): Promise<DictCacheEntry | null> {
  const db = await getDb();
  return (await db.get("dictCache", word.toLowerCase())) ?? null;
}

export async function setDictCache(entry: DictCacheEntry): Promise<void> {
  const db = await getDb();
  await db.put("dictCache", { ...entry, word: entry.word.toLowerCase() });
}

export async function getRecordingsByItemId(itemId: string): Promise<Recording[]> {
  const db = await getDb();
  const list = await db.getAllFromIndex("recordings", "by-itemId", itemId);
  return list.sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveRecording(recording: Recording): Promise<void> {
  const db = await getDb();
  await db.put("recordings", recording);
}

export async function deleteRecording(id: string): Promise<void> {
  const db = await getDb();
  await db.delete("recordings", id);
}

export async function trimRecordings(itemId: string, max = 5): Promise<void> {
  const recordings = await getRecordingsByItemId(itemId);
  const excess = recordings.slice(max);
  await Promise.all(excess.map((r) => deleteRecording(r.id)));
}
