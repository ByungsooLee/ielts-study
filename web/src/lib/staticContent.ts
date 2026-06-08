import {
  getShardMeta,
  replaceThemeContent,
  setShardMeta,
  shardMetaKey,
  type ShardMeta,
} from "../db";
import type { ContentRecord, Domain, ImportSource, Passage, StudyItem, ThemeStat } from "../types";

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

export interface ThemeShardData {
  domain: Domain;
  collection: string;
  collectionName?: string;
  theme: number;
  themeName: string;
  version: string;
  items: StudyItem[];
  passage?: Passage;
}

const ENGLISH_VOCAB = "ielts-vocab";
const ENGLISH_GRAMMAR = "grammar";
const INDEX_PATH = "/content/index.json";

let cachedIndex: ContentIndex | null = null;
const shardDataCache = new Map<string, ThemeShardData>();
const inflight = new Map<string, Promise<ThemeShardData | null>>();

function cacheKey(collectionId: string, theme: number): string {
  return shardMetaKey(collectionId, theme);
}

function shardToRecords(shard: ThemeShardData, importedAt: number): ContentRecord[] {
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

async function fetchShardJson(file: string): Promise<ThemeShardData> {
  const res = await fetch(`/content/${file}`, { cache: "no-cache" });
  if (!res.ok) throw new Error(`テーマ取得失敗: ${file} (${res.status})`);
  return (await res.json()) as ThemeShardData;
}

export async function fetchContentIndex(): Promise<ContentIndex> {
  if (cachedIndex) return cachedIndex;
  const res = await fetch(INDEX_PATH, { cache: "no-cache" });
  if (!res.ok) throw new Error(`教材目次の取得に失敗 (${res.status})`);
  cachedIndex = (await res.json()) as ContentIndex;
  return cachedIndex;
}

export function clearContentIndexCache(): void {
  cachedIndex = null;
}

export function collectionsForDomain(index: ContentIndex, domain: Domain): CollectionIndexEntry[] {
  return index.collections.filter((c) => c.domain === domain);
}

export function findCollection(index: ContentIndex, collectionId: string): CollectionIndexEntry | undefined {
  return index.collections.find((c) => c.id === collectionId);
}

/** index.json からテーマ/ジャンルの件数一覧（未ロードでも表示可能） */
export function themeStatsFromIndex(
  collection: CollectionIndexEntry,
  options?: { minTheme?: number },
): ThemeStat[] {
  const minTheme = options?.minTheme ?? 0;
  return collection.themes
    .filter((t) => t.theme >= minTheme)
    .map((t) => ({ num: t.theme, name: t.themeName, count: t.count }))
    .sort((a, b) => a.num - b.num);
}

/** @deprecated themeStatsFromIndex を使用 */
export function themeVocabStatsFromIndex(collection: CollectionIndexEntry): ThemeStat[] {
  return themeStatsFromIndex(collection, { minTheme: 1 });
}

/**
 * 1テーマ分のシャードを version 付きで IndexedDB に同期（変化時のみネットワーク取得）
 */
export async function ensureThemeShard(
  collection: CollectionIndexEntry,
  themeEntry: ThemeIndexEntry,
): Promise<ThemeShardData | null> {
  const key = cacheKey(collection.id, themeEntry.theme);
  const cached = shardDataCache.get(key);
  const meta = await getShardMeta(collection.id, themeEntry.theme);
  if (cached && meta?.version === themeEntry.version) {
    return cached;
  }

  const existing = inflight.get(key);
  if (existing) return existing;

  const task = (async () => {
    if (meta?.version === themeEntry.version) {
      const local = shardDataCache.get(key);
      if (local) return local;
    }

    const shard = await fetchShardJson(themeEntry.file);
    const records = shardToRecords(shard, Date.now());
    await replaceThemeContent(collection.id, themeEntry.theme, records);

    const nextMeta: ShardMeta = {
      key,
      collectionId: collection.id,
      domain: collection.domain,
      theme: themeEntry.theme,
      file: themeEntry.file,
      version: themeEntry.version,
      syncedAt: Date.now(),
    };
    await setShardMeta(nextMeta);
    shardDataCache.set(key, shard);
    return shard;
  })().finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, task);
  return task;
}

export async function ensureCollectionTheme(
  collectionId: string,
  themeNum: number,
): Promise<ThemeShardData | null> {
  const index = await fetchContentIndex();
  const collection = findCollection(index, collectionId);
  const entry = collection?.themes.find((t) => t.theme === themeNum);
  if (!collection || !entry) return null;
  return ensureThemeShard(collection, entry);
}

export async function ensureEnglishVocabTheme(themeNum: number): Promise<ThemeShardData | null> {
  return ensureCollectionTheme(ENGLISH_VOCAB, themeNum);
}

export async function ensureGrammarGenre(genreNum: number): Promise<ThemeShardData | null> {
  return ensureCollectionTheme(ENGLISH_GRAMMAR, genreNum);
}

function prefetchThemes(
  collection: CollectionIndexEntry,
  themes: ThemeIndexEntry[],
  skipTheme?: number,
): void {
  for (const themeEntry of themes) {
    if (skipTheme != null && themeEntry.theme === skipTheme) continue;
    void ensureThemeShard(collection, themeEntry).catch(() => {
      /* バックグラウンド prefetch は失敗を無視 */
    });
  }
}

/** 選択テーマ以外の ielts-vocab をバックグラウンド先読み */
export async function prefetchEnglishVocabThemes(skipTheme?: number): Promise<void> {
  const index = await fetchContentIndex();
  const collection = findCollection(index, ENGLISH_VOCAB);
  if (!collection) return;
  prefetchThemes(collection, collection.themes, skipTheme);
}

/** 選択ジャンル以外の grammar をバックグラウンド先読み */
export async function prefetchGrammarGenres(skipGenre?: number): Promise<void> {
  const index = await fetchContentIndex();
  const collection = findCollection(index, ENGLISH_GRAMMAR);
  if (!collection) return;
  prefetchThemes(collection, collection.themes, skipGenre);
}

/** Engineering 分野の全テーマをバックグラウンド先読み（/engineering 入室時） */
export async function prefetchEngineeringThemes(): Promise<void> {
  const index = await fetchContentIndex();
  for (const collection of collectionsForDomain(index, "engineering")) {
    prefetchThemes(collection, collection.themes);
  }
}

/** @deprecated 一括同期。Engineering は prefetchEngineeringThemes を使う */
export async function syncStaticDomainContent(domain: Domain): Promise<number> {
  const index = await fetchContentIndex();
  const collections = collectionsForDomain(index, domain);
  let count = 0;
  for (const collection of collections) {
    for (const theme of collection.themes) {
      const shard = await ensureThemeShard(collection, theme);
      if (shard) count += shard.items.length;
    }
  }
  return count;
}
