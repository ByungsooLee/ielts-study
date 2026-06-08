import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { FlashcardDeck } from "../../components/FlashcardDeck";
import { PassagePanel } from "../../components/PassagePanel";
import { SetCompletePanel } from "../../components/SetCompletePanel";
import { StudyProgressBar } from "../../components/StudyProgressBar";
import { ThemeNav } from "../../components/ThemeNav";
import { ThemeStudyToolbar } from "../../components/ThemeStudyToolbar";
import { filterEnglishRecords } from "../../lib/domain";
import { buildThemeVocabDeck } from "../../lib/studyDeck";
import { getOrCreateSched } from "../../lib/srs";
import {
  ensureEnglishVocabTheme,
  fetchContentIndex,
  findCollection,
  prefetchEnglishVocabThemes,
  themeVocabStatsFromIndex,
} from "../../lib/staticContent";
import {
  buildThemeRanges,
  collectThemeVocabStats,
  collectThemeVocabThemes,
  hasOtherVocabItems,
  needsThemeRangeNav,
} from "../../lib/themes";
import { useContentStore } from "../../stores/contentStore";
import { useProgressStore } from "../../stores/progressStore";
import { isThemeSelected, useWordSessionStore } from "../../stores/wordSessionStore";
import type { ContentRecord, Passage, PlaybackRate, ThemeStat } from "../../types";

const ENGLISH_VOCAB = "ielts-vocab";

function isThemeVocab(record: ContentRecord, themeNum: number) {
  const { type, theme } = record.item;
  return (type === "word" || type === "phrase") && theme === themeNum;
}

export function WordsPage() {
  const allItems = useContentStore((s) => s.items);
  const items = useMemo(() => filterEnglishRecords(allItems), [allItems]);
  const load = useContentStore((s) => s.load);
  const progress = useProgressStore((s) => s.progress);
  const gradeItem = useProgressStore((s) => s.gradeItem);
  const recordStudyDay = useProgressStore((s) => s.recordStudyDay);

  const session = useWordSessionStore(
    useShallow((s) => ({
      direction: s.direction,
      contentMode: s.contentMode,
      sort: s.sort,
      themeFilter: s.themeFilter,
      themeRangeMin: s.themeRangeMin,
      vocabTypeFilter: s.vocabTypeFilter,
      revealed: s.revealed,
      index: s.index,
      deckKey: s.deckKey,
      setDirection: s.setDirection,
      setContentMode: s.setContentMode,
      setSort: s.setSort,
      setThemeFilter: s.setThemeFilter,
      setThemeRange: s.setThemeRange,
      setVocabTypeFilter: s.setVocabTypeFilter,
      reveal: s.reveal,
      next: s.next,
      prev: s.prev,
      bumpDeckKey: s.bumpDeckKey,
    })),
  );

  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const [passageLoading, setPassageLoading] = useState(false);
  const [indexThemeStats, setIndexThemeStats] = useState<ThemeStat[]>([]);

  useEffect(() => {
    void load();
    void fetchContentIndex()
      .then((index) => {
        const collection = findCollection(index, ENGLISH_VOCAB);
        if (collection) setIndexThemeStats(themeVocabStatsFromIndex(collection));
      })
      .catch(() => {
        /* オフライン時はロード済み items から集計 */
      });
  }, [load]);

  const loadedThemeStats = useMemo(() => collectThemeVocabStats(items), [items]);
  const themeStats = indexThemeStats.length > 0 ? indexThemeStats : loadedThemeStats;
  const themes = useMemo(
    () =>
      indexThemeStats.length > 0
        ? indexThemeStats.map(({ num, name }) => ({ num, name }))
        : collectThemeVocabThemes(items),
    [indexThemeStats, items],
  );
  const ranges = useMemo(() => buildThemeRanges(themes), [themes]);
  const hasOther = useMemo(() => hasOtherVocabItems(items), [items]);
  const themeSelected = isThemeSelected(session.themeFilter);

  useEffect(() => {
    if (needsThemeRangeNav(themeStats) && session.themeRangeMin == null && ranges.length > 0) {
      session.setThemeRange(ranges[0]);
    }
  }, [themeStats, ranges, session.themeRangeMin, session.setThemeRange]);

  const themeNum = isThemeSelected(session.themeFilter) ? session.themeFilter : null;
  const [passage, setPassage] = useState<Passage | undefined>(undefined);

  useEffect(() => {
    if (themeNum == null) {
      setPassage(undefined);
      return;
    }

    let cancelled = false;
    setPassageLoading(true);

    void (async () => {
      try {
        const shard = await ensureEnglishVocabTheme(themeNum);
        if (cancelled) return;
        setPassage(shard?.passage);
        await load();
        void prefetchEnglishVocabThemes(themeNum);
      } finally {
        if (!cancelled) setPassageLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [themeNum, load]);

  const themeRecords = useMemo(() => {
    if (themeNum == null) return [];
    return items.filter((r) => {
      if (!isThemeVocab(r, themeNum)) return false;
      if (session.vocabTypeFilter === "word") return r.item.type === "word";
      if (session.vocabTypeFilter === "phrase") return r.item.type === "phrase";
      return true;
    });
  }, [items, themeNum, session.vocabTypeFilter]);

  const deck = useMemo(
    () =>
      themeNum != null
        ? buildThemeVocabDeck(themeRecords, progress, {
            themeFilter: themeNum,
            themeRange: null,
            dueOnly: false,
            hardOnly: false,
            unlearnedOnly: false,
            sort: session.sort,
          })
        : [],
    [themeNum, themeRecords, progress, session.sort, session.deckKey],
  );

  const current = deck[session.index];
  const complete = session.index >= deck.length && deck.length > 0;
  const empty = themeNum != null && deck.length === 0 && !passageLoading;

  const currentSched = current
    ? progress.srs[current.item.id] ?? getOrCreateSched(progress, current.item.id)
    : undefined;

  const handleGrade = useCallback(
    (kind: "forgot" | "maybe" | "remembered") => {
      if (!current) return;
      gradeItem(current.item.id, kind);
      recordStudyDay();
      useWordSessionStore.getState().next();
    },
    [current, gradeItem, recordStudyDay],
  );

  useEffect(() => {
    if (themeNum == null) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const s = useWordSessionStore.getState();
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
  }, [themeNum, handleGrade]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">単語</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          テーマを選び、長文で文脈をつかんでから単語・構文カードで覚えます。
        </p>
      </div>

      {themeStats.length > 0 && (
        <ThemeNav
          category="word"
          records={items}
          ranges={ranges}
          themeFilter={session.themeFilter}
          themeRangeMin={session.themeRangeMin}
          hasOther={hasOther}
          themeStats={themeStats}
          onThemeFilter={session.setThemeFilter}
          onThemeRange={session.setThemeRange}
        />
      )}

      {!themeSelected && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-400">
          テーマ番号を選ぶと、長文と語彙カードの学習が始まります。
        </div>
      )}

      {themeNum != null && (
        <>
          {passageLoading && !passage && (
            <p className="text-sm text-slate-500">テーマデータを読み込み中…</p>
          )}
          {passage && (
            <PassagePanel
              passage={passage}
              records={themeRecords}
              playbackRate={playbackRate}
              onPlaybackRate={setPlaybackRate}
            />
          )}
          {!passage && !passageLoading && (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              このテーマには長文データがありません。語彙カードから学習できます。
            </p>
          )}

          <ThemeStudyToolbar
            direction={session.direction}
            contentMode={session.contentMode}
            sort={session.sort}
            vocabTypeFilter={session.vocabTypeFilter}
            onDirection={session.setDirection}
            onContentMode={session.setContentMode}
            onSort={session.setSort}
            onVocabTypeFilter={session.setVocabTypeFilter}
            onShuffle={session.bumpDeckKey}
          />

          <StudyProgressBar
            current={Math.min(session.index, deck.length)}
            total={deck.length}
            streak={progress.streak?.count}
          />

          {empty && (
            <div className="rounded-xl bg-white p-8 text-center text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-400">
              このテーマに該当する語彙がありません。
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
            <ErrorBoundary label="語彙カード">
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
        </>
      )}
    </div>
  );
}
