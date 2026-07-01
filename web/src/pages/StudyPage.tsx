import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { FlashcardDeck } from "../components/FlashcardDeck";
import { ReviewForecast } from "../components/ReviewForecast";
import { SetCompletePanel } from "../components/SetCompletePanel";
import { StudyProgressBar } from "../components/StudyProgressBar";
import { StudyToolbar } from "../components/StudyToolbar";
import { SM2 } from "../lib/sm2";
import { buildDailyReviewDeck, buildStudyDeck } from "../lib/studyDeck";
import type { DailyQueueResult } from "../lib/dailyQueue";
import { getOrCreateSched } from "../lib/srs";
import { filterEnglishRecords } from "../lib/domain";
import { useContentStore } from "../stores/contentStore";
import { useProgressStore } from "../stores/progressStore";
import { useSettingsStore } from "../stores/settingsStore";
import { useStudySessionStore } from "../stores/studySessionStore";
import type { ContentRecord, ItemType } from "../types";

const ALL_CATEGORIES: ItemType[] = ["word", "phrase", "grammar", "conversation"];

export function StudyPage() {
  const [searchParams] = useSearchParams();
  const allItems = useContentStore((s) => s.items);
  const items = useMemo(() => filterEnglishRecords(allItems), [allItems]);
  const load = useContentStore((s) => s.load);
  const progress = useProgressStore((s) => s.progress);
  const gradeItem = useProgressStore((s) => s.gradeItem);
  const recordStudyDay = useProgressStore((s) => s.recordStudyDay);
  const introduceDailyNew = useProgressStore((s) => s.introduceDailyNew);
  const dailyNewLimit = useSettingsStore((s) => s.settings.dailyNewLimit);

  const session = useStudySessionStore(
    useShallow((s) => ({
      category: s.category,
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
      setCategory: s.setCategory,
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

  const playbackRate = useSettingsStore((s) => s.settings.playbackRate);
  const setPlaybackRate = useSettingsStore((s) => s.setPlaybackRate);
  const [requeueTail, setRequeueTail] = useState<ContentRecord[]>([]);
  const [reviewSnapshot, setReviewSnapshot] = useState<DailyQueueResult | null>(null);
  const requeueCounts = useRef(new Map<string, number>());
  const introducedRef = useRef<string | null>(null);
  const categoryFixed = useRef(false);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get("hardOnly") === "1") {
      const s = useStudySessionStore.getState();
      s.setHardOnly(true);
      s.setStudyMode("set");
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    const present = new Set(items.map((r) => r.item.type));
    return ALL_CATEGORIES.filter((c) => present.has(c));
  }, [items]);

  useEffect(() => {
    if (!categories.length || categoryFixed.current) return;
    if (!categories.includes(session.category)) {
      useStudySessionStore.getState().setCategory(categories[0]);
    }
    categoryFixed.current = true;
  }, [categories, session.category]);

  useEffect(() => {
    if (session.studyMode !== "review" || items.length === 0) {
      setReviewSnapshot(null);
      return;
    }
    const result = buildDailyReviewDeck(
      items,
      useProgressStore.getState().progress,
      dailyNewLimit,
    );
    setReviewSnapshot(result);
    if (introducedRef.current !== session.deckKey) {
      if (result.newCount > 0) introduceDailyNew(result.newCount);
      introducedRef.current = session.deckKey;
    }
  }, [session.studyMode, session.deckKey, items, dailyNewLimit, introduceDailyNew]);

  const setDeck = useMemo(
    () =>
      buildStudyDeck(items, progress, {
        category: session.category,
        themeFilter: "all",
        themeRange: null,
        dueOnly: session.dueOnly,
        hardOnly: session.hardOnly,
        unlearnedOnly: session.unlearnedOnly,
        setSize: session.setSize,
        sort: session.sort,
      }),
    [
      items,
      progress,
      session.category,
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
      <StudyToolbar
        categories={categories}
        category={session.category}
        studyMode={session.studyMode}
        direction={session.direction}
        contentMode={session.contentMode}
        setSize={session.setSize}
        sort={session.sort}
        dueOnly={session.dueOnly}
        hardOnly={session.hardOnly}
        unlearnedOnly={session.unlearnedOnly}
        onCategory={session.setCategory}
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

      {session.studyMode === "review" && (
        <ReviewForecast records={items} progress={progress} />
      )}

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
