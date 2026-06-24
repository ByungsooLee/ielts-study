import { useEffect, useMemo, useState } from "react";
import { EngineeringThemeNav } from "../../components/engineering/EngineeringThemeNav";
import { InterviewQA } from "../../components/engineering/InterviewQA";
import {
  collectionsForDomain,
  engineeringThemeChipsFromIndex,
  ensureCollectionTheme,
  fetchContentIndex,
  type CollectionIndexEntry,
  type EngineeringSelection,
  type EngineeringThemeChip,
} from "../../lib/staticContent";
import type { InterviewItem, PlaybackRate } from "../../types";

/** index から面接コレクション（kind:"interview"）だけ抽出 */
function interviewCollections(
  index: Awaited<ReturnType<typeof fetchContentIndex>>,
): CollectionIndexEntry[] {
  return collectionsForDomain(index, "engineering").filter((c) => c.kind === "interview");
}

export function InterviewPage() {
  const [chips, setChips] = useState<EngineeringThemeChip[]>([]);
  const [selection, setSelection] = useState<EngineeringSelection>(null);
  const [items, setItems] = useState<InterviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);

  // ジャンルチップを index から自動生成（ハードコードなし）
  useEffect(() => {
    void fetchContentIndex()
      .then((idx) => {
        const cols = interviewCollections(idx);
        setChips(engineeringThemeChipsFromIndex(cols));
      })
      .catch(() => {});
  }, []);

  // 選択ジャンル（または全部）のシャードを直接読み込み（front/meaning が無いため
  // content store ではなく生シャードの items を使う）
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setIndex(0);

    void (async () => {
      try {
        const idx = await fetchContentIndex();
        const cols = interviewCollections(idx);
        const targets: Array<{ collectionId: string; theme: number }> = selection
          ? [{ collectionId: selection.collectionId, theme: selection.theme }]
          : cols.flatMap((c) => c.themes.map((t) => ({ collectionId: c.id, theme: t.theme })));

        const shards = await Promise.all(
          targets.map((t) => ensureCollectionTheme(t.collectionId, t.theme).catch(() => null)),
        );
        if (cancelled) return;

        const collected = shards
          .filter((s): s is NonNullable<typeof s> => Boolean(s))
          .flatMap((s) => (s.items as unknown as InterviewItem[]) ?? [])
          .filter((it) => it?.type === "interview" && it.question && it.answer)
          .sort((a, b) => (a.n ?? 0) - (b.n ?? 0));
        setItems(collected);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selection]);

  const current = useMemo(() => items[index], [items, index]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">面接Q&amp;A</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          まず日本語で要点を確認 → 英文を1文ずつ読む → 文をタップで構文・発音・語義
        </p>
      </div>

      <EngineeringThemeNav chips={chips} selected={selection} onSelect={setSelection} />

      {loading && <p className="text-sm text-slate-500 dark:text-slate-400">教材を読み込み中…</p>}

      {!loading && items.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm dark:bg-slate-900">
          Q&amp;A がありません。ジャンルを変更するか、教材の同期を確認してください。
        </div>
      )}

      {current && (
        <InterviewQA
          key={current.id}
          item={current}
          index={index}
          total={items.length}
          playbackRate={playbackRate}
          onPlaybackRate={setPlaybackRate}
          onPrev={() => setIndex((i) => Math.max(0, i - 1))}
          onNext={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
          canPrev={index > 0}
          canNext={index < items.length - 1}
        />
      )}
    </div>
  );
}
