import { upsertContent } from "../db";
import type { ContentRecord, Domain, ImportSource, StudyItem } from "../types";

export interface ThemeIndexEntry {
  theme: number;
  themeName: string;
  count: number;
  file: string;
  version: string;
}

export interface CollectionIndexEntry {
  id: string;
  domain: Domain;
  name: string;
  kind: string;
  themes: ThemeIndexEntry[];
}

export interface ContentIndex {
  version: string;
  collections: CollectionIndexEntry[];
}

interface ThemeShard {
  domain: Domain;
  collection: string;
  collectionName?: string;
  theme: number;
  themeName: string;
  version: string;
  items: StudyItem[];
}

const INDEX_PATH = "/content/index.json";
let cachedIndex: ContentIndex | null = null;

export async function fetchContentIndex(): Promise<ContentIndex> {
  if (cachedIndex) return cachedIndex;
  const res = await fetch(INDEX_PATH, { cache: "no-cache" });
  if (!res.ok) throw new Error(`教材目次の取得に失敗 (${res.status})`);
  cachedIndex = (await res.json()) as ContentIndex;
  return cachedIndex;
}

export function collectionsForDomain(index: ContentIndex, domain: Domain): CollectionIndexEntry[] {
  return index.collections.filter((c) => c.domain === domain);
}

function shardToRecords(shard: ThemeShard, importedAt: number): ContentRecord[] {
  const source: ImportSource = {
    book: shard.collectionName ?? shard.collection,
    section: `theme-${shard.theme}`,
    added: new Date().toISOString().slice(0, 10),
  };
  return shard.items
    .filter((item) => item?.id && item?.front && item?.meaning)
    .map((item) => ({
      id: item.id,
      item: {
        ...item,
        domain: shard.domain,
        collection: shard.collection,
        theme: item.theme ?? shard.theme,
        themeName: item.themeName ?? shard.themeName,
      },
      source,
      importedAt,
    }));
}

/** 静的シャード（engineering 等）を IndexedDB に同期 */
export async function syncStaticDomainContent(domain: Domain): Promise<number> {
  const index = await fetchContentIndex();
  const collections = collectionsForDomain(index, domain);
  const importedAt = Date.now();
  const records: ContentRecord[] = [];

  for (const collection of collections) {
    for (const theme of collection.themes) {
      const res = await fetch(`/content/${theme.file}`, { cache: "no-cache" });
      if (!res.ok) throw new Error(`テーマ取得失敗: ${theme.file} (${res.status})`);
      const shard = (await res.json()) as ThemeShard;
      records.push(...shardToRecords(shard, importedAt));
    }
  }

  if (records.length > 0) {
    await upsertContent(records);
  }
  return records.length;
}
