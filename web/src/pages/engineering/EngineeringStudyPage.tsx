import { useCallback, useEffect, useMemo, useState } from "react";
import { ConceptExplainCard } from "../../components/engineering/ConceptExplainCard";
import { DiagramConceptCard } from "../../components/engineering/DiagramConceptCard";
import { EngineeringThemeNav } from "../../components/engineering/EngineeringThemeNav";
import {
  buildEngineeringReviewDeck,
  buildEngineeringStudyDeck,
  filterEngineeringPool,
} from "../../lib/engineeringDeck";
import { filterEngineeringRecords, hasEngineeringDiagram } from "../../lib/domain";
import { getOrCreateSched } from "../../lib/srs";
import {
  collectionsForDomain,
  ensureCollectionTheme,
  engineeringThemeChipsFromIndex,
  fetchContentIndex,
  prefetchEngineeringThemes,
  type EngineeringSelection,
  type EngineeringThemeChip,
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
  const [themeChips, setThemeChips] = useState<EngineeringThemeChip[]>([]);
  const [shardLoading, setShardLoading] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const [step, setStep] = useState<EngineeringStep>("understand");

  const themeSelection: EngineeringSelection = useMemo(() => {
    if (session.collectionId != null && session.theme != null) {
      return { collectionId: session.collectionId, theme: session.theme };
    }
    return null;
  }, [session.collectionId, session.theme]);

  useEffect(() => {
    void load();
    void fetchContentIndex()
      .then((index) => {
        // 面接(interview)は専用モード（/engineering/interview）。概念学習のチップからは除外
        const cols = collectionsForDomain(index, "engineering").filter(
          (c) => c.kind !== "interview",
        );
        setThemeChips(engineeringThemeChipsFromIndex(cols));
        const s = useEngineeringSessionStore.getState();
        if (s.collectionId == null && s.theme == null && cols[0]?.themes[0]) {
          s.setThemeSelection({
            collectionId: cols[0].id,
            theme: cols[0].themes[0].theme,
          });
        }
      })
      .catch(() => {});
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    setShardLoading(true);

    void (async () => {
      try {
        if (themeSelection) {
          await ensureCollectionTheme(themeSelection.collectionId, themeSelection.theme);
          if (!cancelled) void prefetchEngineeringThemes();
        } else {
          const index = await fetchContentIndex();
          const cols = collectionsForDomain(index, "engineering");
          await Promise.all(
            cols.flatMap((col) =>
              col.themes.map((t) =>
                ensureCollectionTheme(col.id, t.theme).catch(() => null),
              ),
            ),
          );
          if (!cancelled) void prefetchEngineeringThemes();
        }
        if (!cancelled) await load();
      } finally {
        if (!cancelled) setShardLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [themeSelection, session.studyMode, load]);

  const pool = useMemo(
    () =>
      filterEngineeringPool(engineeringItems, {
        collectionId: session.collectionId,
        theme: session.theme,
        tagFilter: "",
      }),
    [engineeringItems, session.collectionId, session.theme, session.deckKey],
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
  const isDiagramCard = current ? hasEngineeringDiagram(current.item) : false;

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

      <EngineeringThemeNav
        chips={themeChips}
        selected={themeSelection}
        onSelect={(selection) => session.setThemeSelection(selection)}
      />

      {shardLoading && (
        <p className="text-sm text-slate-500 dark:text-slate-400">教材を読み込み中…</p>
      )}

      <p className="text-sm text-slate-600 dark:text-slate-400">
        {session.index + 1} / {deck.length} 件
        {session.studyMode === "review" && "（Engineering のみ）"}
      </p>

      {deck.length === 0 && !shardLoading && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm dark:bg-slate-900">
          該当する概念がありません。ジャンルを変更するか、教材の同期を確認してください。
        </div>
      )}

      {current && isDiagramCard && (
        <DiagramConceptCard
          record={current}
          playbackRate={playbackRate}
          onPlaybackRate={setPlaybackRate}
          onGrade={handleGrade}
          onPrev={session.prev}
          onNext={session.next}
          canPrev={session.index > 0}
          sched={sched}
        />
      )}

      {current && !isDiagramCard && (
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
