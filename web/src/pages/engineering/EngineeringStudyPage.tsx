import { useCallback, useEffect, useMemo, useState } from "react";
import { ConceptExplainCard } from "../../components/engineering/ConceptExplainCard";
import {
  buildEngineeringReviewDeck,
  buildEngineeringStudyDeck,
  filterEngineeringPool,
} from "../../lib/engineeringDeck";
import { filterEngineeringRecords } from "../../lib/domain";
import { getOrCreateSched } from "../../lib/srs";
import {
  collectionsForDomain,
  fetchContentIndex,
  type CollectionIndexEntry,
} from "../../lib/staticContent";
import { useContentStore } from "../../stores/contentStore";
import { useEngineeringSessionStore } from "../../stores/engineeringSessionStore";
import { useProgressStore } from "../../stores/progressStore";
import { useSettingsStore } from "../../stores/settingsStore";
import type { EngineeringStep, PlaybackRate } from "../../types";

export function EngineeringStudyPage() {
  const allItems = useContentStore((s) => s.items);
  const load = useContentStore((s) => s.load);
  const engineeringItems = useMemo(() => filterEngineeringRecords(allItems), [allItems]);
  const progress = useProgressStore((s) => s.progress);
  const gradeItem = useProgressStore((s) => s.gradeItem);
  const recordStudyDay = useProgressStore((s) => s.recordStudyDay);
  const dailyNewLimit = useSettingsStore((s) => s.settings.dailyNewLimit);

  const session = useEngineeringSessionStore();
  const [collections, setCollections] = useState<CollectionIndexEntry[]>([]);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const [step, setStep] = useState<EngineeringStep>("understand");

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void fetchContentIndex().then((index) => {
      const cols = collectionsForDomain(index, "engineering");
      setCollections(cols);
      const s = useEngineeringSessionStore.getState();
      if (!s.collectionId && cols[0]) s.setCollection(cols[0].id);
      if (s.theme == null && cols[0]?.themes[0]) s.setTheme(cols[0].themes[0].theme);
    });
  }, []);

  const activeCollection = collections.find((c) => c.id === session.collectionId) ?? collections[0];
  const themes = activeCollection?.themes ?? [];

  const pool = useMemo(
    () =>
      filterEngineeringPool(engineeringItems, {
        collectionId: session.collectionId,
        theme: session.theme,
        tagFilter: session.tagFilter,
      }),
    [engineeringItems, session.collectionId, session.theme, session.tagFilter, session.deckKey],
  );

  const deck = useMemo(() => {
    if (session.studyMode === "review") {
      const poolIds = new Set(pool.map((p) => p.id));
      return buildEngineeringReviewDeck(engineeringItems, progress, dailyNewLimit).queue.filter(
        (r) => poolIds.has(r.id),
      );
    }
    return buildEngineeringStudyDeck(progress, pool);
  }, [
    session.studyMode,
    session.deckKey,
    engineeringItems,
    progress,
    pool,
    dailyNewLimit,
  ]);

  const current = deck[session.index];
  const sched = current
    ? progress.srs[current.item.id] ?? getOrCreateSched(progress, current.item.id)
    : undefined;

  useEffect(() => {
    setStep("understand");
  }, [session.index, session.deckKey, current?.id]);

  const handleGrade = useCallback(
    (kind: "forgot" | "maybe" | "remembered") => {
      if (!current) return;
      gradeItem(current.item.id, kind);
      recordStudyDay();
      session.next();
    },
    [current, gradeItem, recordStudyDay, session],
  );

  const allTags = useMemo(
    () => [...new Set(engineeringItems.flatMap((r) => r.item.tags ?? []))].sort(),
    [engineeringItems],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`rounded-lg px-3 py-1.5 text-sm ${session.studyMode === "study" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-800"}`}
          onClick={() => session.setStudyMode("study")}
        >
          学習
        </button>
        <button
          type="button"
          className={`rounded-lg px-3 py-1.5 text-sm ${session.studyMode === "review" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-800"}`}
          onClick={() => session.setStudyMode("review")}
        >
          今日の復習
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
          onClick={() => session.bumpDeckKey()}
        >
          シャッフル
        </button>
      </div>

      <div className="grid gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900 md:grid-cols-3">
        <label className="text-sm">
          <span className="font-medium">コレクション</span>
          <select
            className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-600 dark:bg-slate-800"
            value={session.collectionId ?? ""}
            onChange={(e) => session.setCollection(e.target.value || null)}
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="font-medium">テーマ</span>
          <select
            className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-600 dark:bg-slate-800"
            value={session.theme ?? ""}
            onChange={(e) => session.setTheme(e.target.value ? Number(e.target.value) : null)}
          >
            {themes.map((t) => (
              <option key={t.theme} value={t.theme}>
                {t.theme}: {t.themeName} ({t.count})
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="font-medium">タグ</span>
          <select
            className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-600 dark:bg-slate-800"
            value={session.tagFilter}
            onChange={(e) => session.setTagFilter(e.target.value)}
          >
            <option value="">すべて</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        {session.index + 1} / {deck.length} 件
        {session.studyMode === "review" && "（Engineering のみ）"}
      </p>

      {deck.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm dark:bg-slate-900">
          該当する概念がありません。コレクションやテーマを変更してください。
        </div>
      )}

      {current && (
        <ConceptExplainCard
          record={current}
          step={step}
          onStep={setStep}
          playbackRate={playbackRate}
          onPlaybackRate={setPlaybackRate}
          onGrade={handleGrade}
          onPrev={session.prev}
          onNext={session.next}
          canPrev={session.index > 0}
          sched={sched}
        />
      )}
    </div>
  );
}
