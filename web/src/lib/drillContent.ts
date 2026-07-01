/**
 * ドリル系コレクション (task1 / writing / speaking) の共通ローダー。
 * 各セクションのシャードは `ensureCollectionTheme` 経由で取得し、items は既存の
 * SRS 経路に載る（ContentRecord として IndexedDB に取り込まれる）。ドリル固有
 * フィールド (chart / drills / model_answer など) はここで正規化して返す。
 */
import {
  ensureCollectionTheme,
  fetchContentIndex,
  findCollection,
  type CollectionIndexEntry,
  type ThemeIndexEntry,
} from "./staticContent";
import type { DrillChart, DrillDef, DrillKind, DrillSection, StudyItem } from "../types";

export const DRILL_COLLECTION_IDS: Record<DrillKind, string> = {
  task1: "ielts-task1",
  writing: "ielts-writing",
  speaking: "ielts-speaking",
};

export interface DrillSectionEntry {
  section: number;
  title: string;
  file: string;
  version: string;
  itemCount: number;
  drillCount?: number;
}

export interface DrillCollectionMeta {
  id: string;
  name: string;
  kind: DrillKind;
  sections: DrillSectionEntry[];
}

/** index.json から drill 系コレクションの目次を取り出す。 */
export async function fetchDrillCollection(kind: DrillKind): Promise<DrillCollectionMeta | null> {
  const id = DRILL_COLLECTION_IDS[kind];
  const index = await fetchContentIndex();
  const col = findCollection(index, id);
  if (!col) return null;
  return {
    id: col.id,
    name: col.name,
    kind,
    sections: col.themes.map((t) => themeEntryToSection(t)),
  };
}

function themeEntryToSection(t: ThemeIndexEntry): DrillSectionEntry {
  const drillCount = (t as ThemeIndexEntry & { drillCount?: number }).drillCount;
  return {
    section: t.theme,
    title: t.themeName,
    file: t.file,
    version: t.version,
    itemCount: t.count,
    ...(typeof drillCount === "number" ? { drillCount } : {}),
  };
}

interface DrillShardRaw {
  section?: number;
  title?: string;
  version: string;
  themeName?: string;
  items?: StudyItem[];
  drills?: DrillDef[];
  chart?: DrillChart;
  model_paragraph?: string;
  prompt?: string;
  prompt_jp?: string;
  outline_jp?: string[];
  model_answer?: string[];
}

/** section を1つ取得。取得した item は IndexedDB / contentStore にも反映される。 */
export async function ensureDrillSection(
  kind: DrillKind,
  section: number,
): Promise<DrillSection | null> {
  const collectionId = DRILL_COLLECTION_IDS[kind];
  const shard = (await ensureCollectionTheme(collectionId, section)) as unknown as DrillShardRaw | null;
  if (!shard) return null;
  return {
    kind,
    collection: collectionId,
    section: shard.section ?? section,
    title: shard.title ?? shard.themeName ?? `セクション${section}`,
    version: shard.version,
    items: shard.items ?? [],
    drills: shard.drills ?? [],
    chart: shard.chart,
    model_paragraph: shard.model_paragraph,
    prompt: shard.prompt,
    prompt_jp: shard.prompt_jp,
    outline_jp: shard.outline_jp,
    model_answer: shard.model_answer,
  };
}

/** English 入室時などにバックグラウンドで全セクションを prefetch する。 */
export async function prefetchDrillCollection(kind: DrillKind): Promise<void> {
  const meta = await fetchDrillCollection(kind);
  if (!meta) return;
  await Promise.all(
    meta.sections.map((s) =>
      ensureDrillSection(kind, s.section).catch(() => {
        /* prefetch 失敗は無視 */
      }),
    ),
  );
}

/**
 * 全ドリルコレクションを prefetch し、完了後に contentStore を再ロード。
 * これで今日の復習キューに t1-/w2-/sp- item が並ぶようになる。
 */
export async function prefetchAllDrillCollectionsAndReload(
  reload: () => Promise<void>,
): Promise<void> {
  await Promise.all(
    (Object.keys(DRILL_COLLECTION_IDS) as DrillKind[]).map((k) =>
      prefetchDrillCollection(k),
    ),
  );
  await reload();
}

/** target_ids から対応する StudyItem を引く。 */
export function resolveTargets(items: StudyItem[], targetIds: string[]): StudyItem[] {
  const byId = new Map(items.map((it) => [it.id, it] as const));
  return targetIds.map((id) => byId.get(id)).filter((it): it is StudyItem => Boolean(it));
}

export function isDrillCollection(id: string | undefined): boolean {
  if (!id) return false;
  return id === "ielts-task1" || id === "ielts-writing" || id === "ielts-speaking";
}

/**
 * contentStore.items と progress から、指定 collection の section 別
 * 「今日期限の item 件数」を計算する。今日の復習合流を UI で見せる用。
 */
export function computeDrillDueCounts(
  records: { item: StudyItem }[],
  srs: Record<string, { due: number; status: string }>,
  collectionId: string,
  today: number,
): Record<number, number> {
  const counts: Record<number, number> = {};
  for (const r of records) {
    const { item } = r;
    if (item.collection !== collectionId) continue;
    if (item.theme == null) continue;
    const sched = srs[item.id];
    if (!sched) continue;
    if (sched.status === "suspended" || sched.status === "new") continue;
    if (sched.due > today) continue;
    counts[item.theme] = (counts[item.theme] ?? 0) + 1;
  }
  return counts;
}

// re-export で呼び出し側の import を短く保つ
export type { CollectionIndexEntry };
