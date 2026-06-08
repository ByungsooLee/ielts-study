import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { SynonymQuizCard } from "../components/SynonymQuizCard";
import { SynonymQuizToolbar } from "../components/SynonymQuizToolbar";
import { ThemeNav } from "../components/ThemeNav";
import { playPronunciation } from "../lib/pronunciation";
import {
  buildSynonymPool,
  filterGeneratablePool,
  getSynonymMcqQuestion,
} from "../lib/synonymQuiz";
import {
  collectThemeStats,
  collectThemes,
  buildThemeRanges,
  hasOtherThemeItems,
  needsThemeRangeNav,
} from "../lib/themes";
import { filterEnglishRecords } from "../lib/domain";
import { useContentStore } from "../stores/contentStore";
import { useProgressStore } from "../stores/progressStore";
import { useSettingsStore } from "../stores/settingsStore";
import {
  getSynonymThemeRangeFromPrefs,
  useSynonymSessionStore,
} from "../stores/synonymSessionStore";
import type { PlaybackRate } from "../types";

export function SynonymQuizPage() {
  const allItems = useContentStore((s) => s.items);
  const items = useMemo(() => filterEnglishRecords(allItems), [allItems]);
  const load = useContentStore((s) => s.load);
  const progress = useProgressStore((s) => s.progress);
  const gradeItem = useProgressStore((s) => s.gradeItem);
  const recordStudyDay = useProgressStore((s) => s.recordStudyDay);
  const settings = useSettingsStore((s) => s.settings);

  const session = useSynonymSessionStore(
    useShallow((s) => ({
      sort: s.sort,
      themeFilter: s.themeFilter,
      themeRangeMin: s.themeRangeMin,
      hardOnly: s.hardOnly,
      index: s.index,
      deckKey: s.deckKey,
      setSort: s.setSort,
      setThemeFilter: s.setThemeFilter,
      setThemeRange: s.setThemeRange,
      setHardOnly: s.setHardOnly,
      next: s.next,
      prev: s.prev,
      bumpDeckKey: s.bumpDeckKey,
    })),
  );

  const [playbackRate] = useState<PlaybackRate>(1);

  useEffect(() => {
    void load();
  }, [load]);

  const themeStats = useMemo(() => collectThemeStats(items, "word"), [items]);
  const themes = useMemo(() => collectThemes(items, "word"), [items]);
  const ranges = useMemo(() => buildThemeRanges(themes), [themes]);
  const themeRange = getSynonymThemeRangeFromPrefs(ranges, session.themeRangeMin);
  const hasOther = useMemo(() => hasOtherThemeItems(items, "word"), [items]);

  useEffect(() => {
    if (
      needsThemeRangeNav(themeStats) &&
      session.themeRangeMin == null &&
      ranges.length > 0
    ) {
      session.setThemeRange(ranges[0]);
    }
  }, [themeStats, ranges, session.themeRangeMin, session.setThemeRange]);

  const allWordItems = useMemo(
    () => items.filter((r) => r.item.type === "word").map((r) => r.item),
    [items],
  );

  const pool = useMemo(() => {
    const raw = buildSynonymPool(items, progress, {
      themeFilter: session.themeFilter,
      themeRange,
      hardOnly: session.hardOnly,
      sort: session.sort,
    });
    return filterGeneratablePool(raw, allWordItems);
  }, [
    items,
    progress,
    allWordItems,
    session.themeFilter,
    themeRange,
    session.hardOnly,
    session.sort,
    session.deckKey,
  ]);

  const currentRecord = pool.length > 0 ? pool[session.index % pool.length] : null;

  const currentQuestion = useMemo(() => {
    if (!currentRecord) return null;
    return getSynonymMcqQuestion(currentRecord, allWordItems);
  }, [currentRecord, allWordItems, session.index, session.deckKey]);

  const empty = pool.length === 0 || !currentQuestion;

  const playWord = useCallback(
    async (word: string) => {
      if (!currentQuestion) return;
      try {
        await playPronunciation({
          item: currentQuestion.record.item,
          text: word,
          source: "word",
          accent: settings.accent,
          workerUrl: settings.workerUrl,
          syncToken: settings.syncToken,
          playbackRate,
        });
      } catch (e) {
        alert(e instanceof Error ? e.message : "発音再生に失敗しました");
      }
    },
    [currentQuestion, settings, playbackRate],
  );

  const handleGrade = useCallback(
    (kind: "forgot" | "maybe" | "remembered") => {
      if (!currentQuestion) return;
      gradeItem(currentQuestion.itemId, kind);
      recordStudyDay();
      session.next();
    },
    [currentQuestion, gradeItem, recordStudyDay, session],
  );

  return (
    <div className="space-y-4">
      <SynonymQuizToolbar
        sort={session.sort}
        hardOnly={session.hardOnly}
        poolSize={pool.length}
        onSort={session.setSort}
        onHardOnly={session.setHardOnly}
        onShuffle={session.bumpDeckKey}
      />

      {themeStats.length > 0 && (
        <ThemeNav
          category="word"
          records={items}
          ranges={ranges}
          themeFilter={session.themeFilter}
          themeRangeMin={session.themeRangeMin}
          hasOther={hasOther}
          onThemeFilter={session.setThemeFilter}
          onThemeRange={session.setThemeRange}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600 dark:text-slate-400">
        <span>{session.index + 1} 問目</span>
        {progress.streak != null && progress.streak.count > 0 && (
          <span>🔥 {progress.streak.count} 日連続</span>
        )}
      </div>

      {empty && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-400">
          このテーマに類義語付きの単語がありません。テーマを変えるか、教材に synonyms を追加してください。
        </div>
      )}

      {currentQuestion && !empty && (
        <ErrorBoundary label="類義語クイズ">
          <SynonymQuizCard
            key={`${currentQuestion.itemId}-${session.index}-${session.deckKey}`}
            question={currentQuestion}
            playbackRate={playbackRate}
            onPlayWord={(word) => void playWord(word)}
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
