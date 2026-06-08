import type { Passage, StudyItem } from "../types";
import { fetchContentIndex } from "./staticContent";

const ENGLISH_VOCAB = "ielts-vocab";

export interface ThemeShard {
  domain: string;
  collection: string;
  collectionName?: string;
  theme: number;
  themeName: string;
  version: string;
  items: StudyItem[];
  passage?: Passage;
}

const shardCache = new Map<number, ThemeShard>();

export async function fetchThemeShard(themeNum: number): Promise<ThemeShard | null> {
  if (shardCache.has(themeNum)) return shardCache.get(themeNum)!;

  const index = await fetchContentIndex();
  const collection = index.collections.find((c) => c.id === ENGLISH_VOCAB);
  const entry = collection?.themes.find((t) => t.theme === themeNum);
  if (!entry) return null;

  const res = await fetch(`/content/${entry.file}`, { cache: "no-cache" });
  if (!res.ok) return null;

  const shard = (await res.json()) as ThemeShard;
  shardCache.set(themeNum, shard);
  return shard;
}

export function clearThemeShardCache() {
  shardCache.clear();
}
