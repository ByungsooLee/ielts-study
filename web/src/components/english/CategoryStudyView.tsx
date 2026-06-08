import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ErrorBoundary } from "../ErrorBoundary";
import { FlashcardDeck } from "../FlashcardDeck";
import { SetCompletePanel } from "../SetCompletePanel";
import { StudyProgressBar } from "../StudyProgressBar";
import { StudyToolbar } from "../StudyToolbar";
import { ThemeNav } from "../ThemeNav";
import { SM2 } from "../../lib/sm2";
import { buildDailyReviewDeck, buildStudyDeck, buildThemeDeck } from "../../lib/studyDeck";
import type { DailyQueueResult } from "../../lib/dailyQueue";
import { getOrCreateSched } from "../../lib/srs";
import {
  buildThemeRanges,
  collectThemeStats,
  collectThemes,
  hasOtherThemeItems,
  needsThemeRangeNav,
} from "../../lib/themes";
import { useProgressStore } from "../../stores/progressStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { getThemeRangeFromPrefs, useStudySessionStore } from "../../stores/studySessionStore";
import type { ContentRecord, ItemType, PlaybackRate } from "../../types";

interface Props {
  category: ItemType;
  items: ContentRecord[];
  showThemeNav?: boolean;
  /** 文法など少数項目向けの簡素ツールバー＋全件出題 */
  grammarMode?: boolean;
}

export function CategoryStudyView({ category, items, showThemeNav = false, grammarMode = false }: Props) {
  const progress = useProgressStore((s) => s.progress);
  const gradeItem = useProgressStore((s) => s.gradeItem);
  const recordStudyDay = useProgressStore((s) => s.recordStudyDay);
  const introduceDailyNew = useProgressStore((s) => s.introduceDailyNew);
  const dailyNewLimit = useSettingsStore((s) => s.settings.dailyNewLimit);

  const session = useStudySessionStore(
    useShallow((s) => ({
      studyMode: s.studyMode,
      direction: s.direction,
      contentMode: s.contentMode,
      setSize: s.setSize,
      sort: s.sort,
      themeFilter: s.themeFilter,
      themeRangeMin: s.themeRangeMin,
      dueOnly: s.dueOnly,
      hardOnly: s.hardOnly,
      unlearnedOnly: s.unlearnedOnly,
      revealed: s.revealed,
      index: s.index,
      deckKey: s.deckKey,
      setStudyMode: s.setStudyMode,
      setDirection: s.setDirection,
      setContentMode: s.setContentMode,
      setSetSize: s.setSetSize,
      setSort: s.setSort,
      setDueOnly: s.setDueOnly,
      setHardOnly: s.setHardOnly,
      setUnlearnedOnly: s.setUnlearnedOnly,
      setThemeFilter: s.setThemeFilter,
      setThemeRange: s.setThemeRange,
      reveal: s.reveal,
      next: s.next,
      prev: s.prev,
      bumpDeckKey: s.bumpDeckKey,
    })),
  );

  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const [requeueTail, setRequeueTail] = useState<ContentRecord[]>([]);
  const [reviewSnapshot, setReviewSnapshot] = useState<DailyQueueResult | null>(null);
  const requeueCounts = useRef(new Map<string, number>());
  const introducedRef = useRef<string | null>(null);
  const categoryFixed = useRef(false);

  useEffect(() => {
    if (!categoryFixed.current) {
      useStudySessionStore.getState().setCategory(category);
      categoryFixed.current = true;
    }
  }, [category]);

  useEffect(() => {
    if (!grammarMode) return;
    const s = useStudySessionStore.getState();
    if (s.contentMode !== "semantic") s.setContentMode("semantic");
    if (s.dueOnly) s.setDueOnly(false);
    if (s.hardOnly) s.setHardOnly(false);
    if (s.unlearnedOnly) s.setUnlearnedOnly(false);
  }, [grammarMode]);

  const categoryItems = useMemo(
    () => items.filter((r) => r.item.type === category),
    [items, category],
  );

  const themeStats = useMemo(() => collectThemeStats(items, category), [items, category]);
  const themes = useMemo(() => collectThemes(items, category), [items, category]);
  const ranges = useMemo(() => buildThemeRanges(themes), [themes]);
  const themeRange = getThemeRangeFromPrefs(ranges, session.themeRangeMin);
  const hasOther = useMemo(() => hasOtherThemeItems(items, category), [items, category]);

  useEffect(() => {
    if (
      showThemeNav &&
      needsThemeRangeNav(themeStats) &&
      session.themeRangeMin == null &&
      ranges.length > 0
    ) {
      session.setThemeRange(ranges[0]);
    }
  }, [showThemeNav, themeStats, ranges, session.themeRangeMin, session.setThemeRange]);

  useEffect(() => {
    if (session.studyMode !== "review" || categoryItems.length === 0) {
      setReviewSnapshot(null);
      return;
    }
    const result = buildDailyReviewDeck(
      categoryItems,
      useProgressStore.getState().progress,
      dailyNewLimit,
    );
    setReviewSnapshot(result);
    if (introducedRef.current !== session.deckKey) {
      if (result.newCount > 0) introduceDailyNew(result.newCount);
      introducedRef.current = session.deckKey;
    }
  }, [session.studyMode, session.deckKey, categoryItems, dailyNewLimit, introduceDailyNew]);

  const effectiveThemeFilter = showThemeNav ? session.themeFilter : "all";
  const effectiveThemeRange = showThemeNav ? themeRange : null;

  const setDeck = useMemo(
    () => {
      const filters = {
        category,
        themeFilter: effectiveThemeFilter,
        themeRange: effectiveThemeRange,
        dueOnly: grammarMode ? false : session.dueOnly,
        hardOnly: grammarMode ? false : session.hardOnly,
        unlearnedOnly: grammarMode ? false : session.unlearnedOnly,
        sort: session.sort,
      };
      if (grammarMode) {
        return buildThemeDeck(categoryItems, progress, filters);
      }
      return buildStudyDeck(categoryItems, progress, {
        ...filters,
        setSize: session.setSize,
      });
    },
    [
      categoryItems,
      progress,
      category,
      effectiveThemeFilter,
      effectiveThemeRange,
      grammarMode,
      session.dueOnly,
      session.hardOnly,
      session.unlearnedOnly,
      session.setSize,
      session.sort,
      session.deckKey,
    ],
  );

  useEffect(() => {
    setRequeueTail([]);
    requeueCounts.current = new Map();
  }, [session.deckKey, session.studyMode]);

  const deck =
    session.studyMode === "review"
      ? [...(reviewSnapshot?.queue ?? []), ...requeueTail]
      : setDeck;

  const current = deck[session.index];
  const complete = session.index >= deck.length && deck.length > 0;
  const empty = deck.length === 0;

  const currentSched = current
    ? progress.srs[current.item.id] ?? getOrCreateSched(progress, current.item.id)
    : undefined;

  const handleGrade = useCallback(
    (kind: "forgot" | "maybe" | "remembered") => {
      if (!current) return;
      gradeItem(current.item.id, kind);
      recordStudyDay();

      if (session.studyMode === "review" && kind === "forgot") {
        const id = current.item.id;
        const count = requeueCounts.current.get(id) ?? 0;
        if (count < SM2.MAX_REQUEUE_PER_DAY) {
          requeueCounts.current.set(id, count + 1);
          setRequeueTail((prev) => [...prev, current]);
        }
      }

      useStudySessionStore.getState().next();
    },
    [current, gradeItem, recordStudyDay, session.studyMode],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const s = useStudySessionStore.getState();
      if (e.code === "Space") {
        e.preventDefault();
        if (!s.revealed) s.reveal();
        return;
      }
      if (!s.revealed) return;
      if (e.key === "1") handleGrade("forgot");
      if (e.key === "2") handleGrade("maybe");
      if (e.key === "3") handleGrade("remembered");
      if (e.key === "ArrowRight") s.next();
      if (e.key === "ArrowLeft" && s.index > 0) s.prev();
      if (e.key === "s" || e.key === "S") s.bumpDeckKey();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleGrade]);

  return (
    <div className="space-y-4">
      {showThemeNav && themeStats.length > 0 && (
        <ThemeNav
          category={category}
          records={items}
          ranges={ranges}
          themeFilter={session.themeFilter}
          themeRangeMin={session.themeRangeMin}
          hasOther={hasOther}
          onThemeFilter={session.setThemeFilter}
          onThemeRange={session.setThemeRange}
        />
      )}

      <StudyToolbar
        categories={[category]}
        category={category}
        hideCategoryTabs
        variant={grammarMode ? "grammar" : "default"}
        studyMode={session.studyMode}
        direction={session.direction}
        contentMode={session.contentMode}
        setSize={session.setSize}
        sort={session.sort}
        dueOnly={session.dueOnly}
        hardOnly={session.hardOnly}
        unlearnedOnly={session.unlearnedOnly}
        onCategory={() => {}}
        onStudyMode={session.setStudyMode}
        onDirection={session.setDirection}
        onContentMode={session.setContentMode}
        onSetSize={session.setSetSize}
        onSort={session.setSort}
        onDueOnly={session.setDueOnly}
        onHardOnly={session.setHardOnly}
        onUnlearnedOnly={session.setUnlearnedOnly}
        onShuffle={session.bumpDeckKey}
      />

      <StudyProgressBar
        current={Math.min(session.index, deck.length)}
        total={deck.length}
        dueCount={session.studyMode === "review" ? deck.length : undefined}
        reviewCount={session.studyMode === "review" ? reviewSnapshot?.reviewCount : undefined}
        newCount={session.studyMode === "review" ? reviewSnapshot?.newCount : undefined}
        streak={progress.streak?.count}
      />

      {empty && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-400">
          {session.studyMode === "review"
            ? "今日の復習は完了です。お疲れさまでした。"
            : "条件に合う項目がありません。フィルタを変えてください。"}
        </div>
      )}

      {complete && (
        <SetCompletePanel
          total={deck.length}
          streak={progress.streak?.count ?? 0}
          onRestart={session.bumpDeckKey}
        />
      )}

      {current && !complete && (
        <ErrorBoundary label="学習カード">
          <FlashcardDeck
            key={`${current.id}-${session.index}`}
            record={current}
            revealed={session.revealed}
            direction={session.direction}
            contentMode={session.contentMode}
            playbackRate={playbackRate}
            sched={currentSched}
            onPlaybackRate={setPlaybackRate}
            onReveal={session.reveal}
            onGrade={handleGrade}
            onPrev={session.prev}
            onNext={session.next}
            canPrev={session.index > 0}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}
