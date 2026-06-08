import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { GrammarCard } from "../../components/grammar/GrammarCard";
import { GrammarClozePanel } from "../../components/grammar/GrammarClozePanel";
import { SetCompletePanel } from "../../components/SetCompletePanel";
import { StudyProgressBar } from "../../components/StudyProgressBar";
import { ThemeNav } from "../../components/ThemeNav";
import {
  buildGrammarCardDeck,
  filterGrammarByGenre,
  flattenGenreCloze,
  grammarRecordsFromItems,
} from "../../lib/grammarCloze";
import { buildDailyReviewDeck } from "../../lib/studyDeck";
import { getOrCreateSched } from "../../lib/srs";
import {
  ensureGrammarGenre,
  fetchContentIndex,
  findCollection,
  prefetchGrammarGenres,
  themeStatsFromIndex,
} from "../../lib/staticContent";
import { buildThemeRanges } from "../../lib/themes";
import { useContentStore } from "../../stores/contentStore";
import { useGrammarSessionStore } from "../../stores/grammarSessionStore";
import { useProgressStore } from "../../stores/progressStore";
import { useSettingsStore } from "../../stores/settingsStore";
import type { PlaybackRate, ThemeStat } from "../../types";

const GRAMMAR_COLLECTION = "grammar";

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`rounded-lg px-3 py-1.5 text-sm ${
        active
          ? "bg-violet-600 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function GrammarPage() {
  const allItems = useContentStore((s) => s.items);
  const load = useContentStore((s) => s.load);
  const progress = useProgressStore((s) => s.progress);
  const gradeItem = useProgressStore((s) => s.gradeItem);
  const recordStudyDay = useProgressStore((s) => s.recordStudyDay);
  const introduceDailyNew = useProgressStore((s) => s.introduceDailyNew);
  const dailyNewLimit = useSettingsStore((s) => s.settings.dailyNewLimit);

  const session = useGrammarSessionStore(
    useShallow((s) => ({
      studyMode: s.studyMode,
      genreFilter: s.genreFilter,
      revealed: s.revealed,
      index: s.index,
      deckKey: s.deckKey,
      quizOpen: s.quizOpen,
      setStudyMode: s.setStudyMode,
      setGenreFilter: s.setGenreFilter,
      reveal: s.reveal,
      next: s.next,
      prev: s.prev,
      bumpDeckKey: s.bumpDeckKey,
      setQuizOpen: s.setQuizOpen,
    })),
  );

  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const [shardLoading, setShardLoading] = useState(false);
  const [indexGenreStats, setIndexGenreStats] = useState<ThemeStat[]>([]);
  const introducedRef = useRef<string | null>(null);

  const grammarItems = useMemo(() => grammarRecordsFromItems(allItems), [allItems]);

  useEffect(() => {
    void load();
    void fetchContentIndex()
      .then((index) => {
        const collection = findCollection(index, GRAMMAR_COLLECTION);
        if (collection) setIndexGenreStats(themeStatsFromIndex(collection));
      })
      .catch(() => {});
  }, [load]);

  const loadedGenreStats = useMemo(() => {
    const map = new Map<number, { name: string; count: number }>();
    for (const { item } of grammarItems) {
      if (!item.theme) continue;
      const existing = map.get(item.theme);
      if (existing) {
        existing.count += 1;
        if (item.themeName) existing.name = item.themeName;
      } else {
        map.set(item.theme, { name: item.themeName ?? `ジャンル${item.theme}`, count: 1 });
      }
    }
    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([num, { name, count }]) => ({ num, name, count }));
  }, [grammarItems]);

  const genreStats = indexGenreStats.length > 0 ? indexGenreStats : loadedGenreStats;
  const themes = useMemo(
    () => genreStats.map(({ num, name }) => ({ num, name })),
    [genreStats],
  );
  const ranges = useMemo(() => buildThemeRanges(themes), [themes]);

  const genreNum = typeof session.genreFilter === "number" ? session.genreFilter : null;

  useEffect(() => {
    let cancelled = false;
    setShardLoading(true);

    void (async () => {
      try {
        if (genreNum != null) {
          await ensureGrammarGenre(genreNum);
          if (!cancelled) void prefetchGrammarGenres(genreNum);
        } else if (
          session.genreFilter === "all" ||
          session.studyMode === "review" ||
          session.studyMode === "cloze"
        ) {
          const index = await fetchContentIndex();
          const collection = findCollection(index, GRAMMAR_COLLECTION);
          if (collection) {
            await Promise.all(
              collection.themes.map((t) => ensureGrammarGenre(t.theme).catch(() => null)),
            );
          }
        }
        if (!cancelled) await load();
      } finally {
        if (!cancelled) setShardLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [genreNum, session.genreFilter, session.studyMode, load]);

  const genreFilterForDeck: number | "all" =
    typeof session.genreFilter === "number" ? session.genreFilter : "all";

  const cardDeck = useMemo(
    () => buildGrammarCardDeck(grammarItems, genreFilterForDeck),
    [grammarItems, genreFilterForDeck, session.deckKey],
  );

  const reviewResult = useMemo(() => {
    if (session.studyMode !== "review") return null;
    return buildDailyReviewDeck(grammarItems, progress, dailyNewLimit);
  }, [session.studyMode, grammarItems, progress, dailyNewLimit, session.deckKey]);

  useEffect(() => {
    if (session.studyMode !== "review" || !reviewResult) return;
    if (introducedRef.current === session.deckKey) return;
    if (reviewResult.newCount > 0) introduceDailyNew(reviewResult.newCount);
    introducedRef.current = session.deckKey;
  }, [session.studyMode, session.deckKey, reviewResult, introduceDailyNew]);

  const clozeDeck = useMemo(() => {
    const scoped = filterGrammarByGenre(grammarItems, genreFilterForDeck);
    return flattenGenreCloze(scoped);
  }, [grammarItems, genreFilterForDeck, session.deckKey]);

  const activeDeck =
    session.studyMode === "review"
      ? (reviewResult?.queue ?? [])
      : session.studyMode === "cloze"
        ? []
        : cardDeck;

  const currentCard = session.studyMode === "card" || session.studyMode === "review"
    ? activeDeck[session.index]
    : undefined;

  const currentCloze = session.studyMode === "cloze" ? clozeDeck[session.index] : undefined;

  const total =
    session.studyMode === "cloze" ? clozeDeck.length : activeDeck.length;

  const complete = session.index >= total && total > 0;
  const empty = !shardLoading && total === 0 && session.studyMode !== "review";

  const currentSched = currentCard
    ? progress.srs[currentCard.item.id] ?? getOrCreateSched(progress, currentCard.item.id)
    : undefined;

  const handleGrade = useCallback(
    (kind: "forgot" | "maybe" | "remembered") => {
      const id = currentCard?.item.id ?? currentCloze?.record.item.id;
      if (!id) return;
      gradeItem(id, kind);
      recordStudyDay();
      useGrammarSessionStore.getState().next();
    },
    [currentCard, currentCloze, gradeItem, recordStudyDay],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (session.studyMode === "cloze") return;

      const s = useGrammarSessionStore.getState();
      if (e.code === "Space" && !s.revealed) {
        e.preventDefault();
        s.reveal();
        return;
      }
      if (!s.revealed) return;
      if (e.key === "1") handleGrade("forgot");
      if (e.key === "2") handleGrade("maybe");
      if (e.key === "3") handleGrade("remembered");
      if (e.key === "ArrowRight") s.next();
      if (e.key === "ArrowLeft" && s.index > 0) s.prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [session.studyMode, handleGrade]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">文法</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          ジャンルを選び、ルールの理解・IELTS活用・穴埋めクイズで学習します。
        </p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <ToggleBtn active={session.studyMode === "card"} onClick={() => session.setStudyMode("card")}>
          カード学習
        </ToggleBtn>
        <ToggleBtn active={session.studyMode === "review"} onClick={() => session.setStudyMode("review")}>
          今日の復習
        </ToggleBtn>
        <ToggleBtn active={session.studyMode === "cloze"} onClick={() => session.setStudyMode("cloze")}>
          まとめテスト
        </ToggleBtn>
      </div>

      {session.studyMode !== "review" && genreStats.length > 0 && (
        <ThemeNav
          category="grammar"
          records={grammarItems}
          ranges={ranges}
          themeFilter={session.genreFilter}
          themeRangeMin={null}
          hasOther={false}
          themeStats={genreStats}
          variant="genre"
          panelTitle="ジャンル"
          onThemeFilter={session.setGenreFilter}
          onThemeRange={() => {}}
        />
      )}

      {shardLoading && grammarItems.length === 0 && (
        <p className="text-sm text-slate-500">文法データを読み込み中…</p>
      )}

      {session.studyMode === "review" && reviewResult && (
        <StudyProgressBar
          current={Math.min(session.index, reviewResult.queue.length)}
          total={reviewResult.queue.length}
          streak={progress.streak?.count}
          dueCount={reviewResult.totalDue}
          reviewCount={reviewResult.reviewCount}
          newCount={reviewResult.newCount}
        />
      )}

      {(session.studyMode === "card" || session.studyMode === "cloze") && total > 0 && (
        <StudyProgressBar
          current={Math.min(session.index, total)}
          total={total}
          streak={progress.streak?.count}
        />
      )}

      {session.studyMode === "review" && reviewResult?.queue.length === 0 && !shardLoading && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-600 shadow-sm dark:bg-slate-900">
          今日の復習は完了です。お疲れさまでした。
        </div>
      )}

      {empty && session.studyMode !== "review" && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-600 shadow-sm dark:bg-slate-900">
          このジャンルに文法項目がありません。
        </div>
      )}

      {complete && session.studyMode !== "review" && (
        <SetCompletePanel
          total={total}
          streak={progress.streak?.count ?? 0}
          onRestart={session.bumpDeckKey}
        />
      )}

      {currentCard && !complete && (session.studyMode === "card" || session.studyMode === "review") && (
        <ErrorBoundary label="文法カード">
          <GrammarCard
            key={`${currentCard.id}-${session.index}`}
            record={currentCard}
            revealed={session.revealed}
            playbackRate={playbackRate}
            sched={currentSched}
            quizOpen={session.quizOpen}
            onPlaybackRate={setPlaybackRate}
            onReveal={session.reveal}
            onGrade={handleGrade}
            onPrev={session.prev}
            onNext={session.next}
            onQuizOpen={session.setQuizOpen}
            canPrev={session.index > 0}
          />
        </ErrorBoundary>
      )}

      {currentCloze && !complete && session.studyMode === "cloze" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="mb-2 text-sm text-slate-500">
            {currentCloze.record.item.front} — 問題 {session.index + 1} / {clozeDeck.length}
          </p>
          <GrammarClozePanel
            key={`${currentCloze.record.id}-${currentCloze.clozeIndex}-${session.index}`}
            cloze={currentCloze.cloze}
            onGrade={handleGrade}
          />
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={session.index === 0}
              className="rounded border px-3 py-1.5 text-sm disabled:opacity-40 dark:border-slate-600"
              onClick={session.prev}
            >
              ← 前へ
            </button>
            <button
              type="button"
              className="rounded border px-3 py-1.5 text-sm dark:border-slate-600"
              onClick={session.next}
            >
              次へ →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
