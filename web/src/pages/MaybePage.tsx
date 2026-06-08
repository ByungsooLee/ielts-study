import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FlashcardDeck } from "../components/FlashcardDeck";
import {
  collectMaybeWordStats,
  summarizeMaybeStats,
  type MaybeWordStat,
} from "../lib/maybeStats";
import { filterEnglishRecords } from "../lib/domain";
import { playPronunciation } from "../lib/pronunciation";
import { isHard } from "../lib/srs";
import { useContentStore } from "../stores/contentStore";
import { useProgressStore } from "../stores/progressStore";
import { useSettingsStore } from "../stores/settingsStore";
import type { PlaybackRate } from "../types";

type FilterMode = "all" | "maybe" | "hard" | "unlearned";

const STATUS_LABEL: Record<MaybeWordStat["status"], string> = {
  unseen: "未学習",
  new: "未学習",
  learning: "学習中",
  review: "復習中",
  suspended: "保留",
};

export function MaybePage() {
  const allItems = useContentStore((s) => s.items);
  const items = useMemo(() => filterEnglishRecords(allItems), [allItems]);
  const load = useContentStore((s) => s.load);
  const progress = useProgressStore((s) => s.progress);
  const gradeItem = useProgressStore((s) => s.gradeItem);
  const recordStudyDay = useProgressStore((s) => s.recordStudyDay);
  const settings = useSettingsStore((s) => s.settings);
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>(
    searchParams.get("filter") === "hard" ? "hard" : "maybe",
  );
  const [studyId, setStudyId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => collectMaybeWordStats(items, progress), [items, progress]);
  const summary = useMemo(() => summarizeMaybeStats(stats), [stats]);

  const hardCount = useMemo(
    () => stats.filter((row) => isHard(row.id, progress)).length,
    [stats, progress],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stats.filter((row) => {
      if (filter === "maybe" && row.maybeCount === 0) return false;
      if (filter === "hard" && !isHard(row.id, progress)) return false;
      if (filter === "unlearned" && row.status !== "unseen" && row.status !== "new") return false;
      if (!q) return true;
      return `${row.front} ${row.meaning}`.toLowerCase().includes(q);
    });
  }, [stats, query, filter, progress]);

  const studyRecord = useMemo(
    () => (studyId ? items.find((r) => r.id === studyId) : undefined),
    [studyId, items],
  );

  const playWord = useCallback(
    async (row: MaybeWordStat) => {
      const record = items.find((r) => r.id === row.id);
      if (!record) return;
      try {
        await playPronunciation({
          item: record.item,
          accent: settings.accent,
          workerUrl: settings.workerUrl,
          syncToken: settings.syncToken,
          playbackRate,
        });
      } catch (e) {
        alert(e instanceof Error ? e.message : "発音再生に失敗しました");
      }
    },
    [items, settings, playbackRate],
  );

  const handleGrade = useCallback(
    (kind: "forgot" | "maybe" | "remembered") => {
      if (!studyId) return;
      gradeItem(studyId, kind);
      recordStudyDay();
      setRevealed(false);
      setStudyId(null);
    },
    [studyId, gradeItem, recordStudyDay],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">あいまい一覧</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          あいまい・苦手な語を横断で確認し、タップで即学習・発音できます。
        </p>
      </div>

      <div className="grid gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900 sm:grid-cols-5">
        <StatCard label="単語数" value={String(summary.wordCount)} />
        <StatCard label="あいまいあり" value={String(summary.withMaybeCount)} />
        <StatCard label="苦手" value={String(hardCount)} />
        <StatCard label="あいまい合計" value={String(summary.totalMaybePresses)} />
        <StatCard label="未学習" value={String(summary.unlearnedCount)} />
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900 md:flex-row">
        <input
          className="flex-1 rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          placeholder="単語・意味で検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterMode)}
        >
          <option value="maybe">あいまい 1 回以上</option>
          <option value="hard">苦手（lapses多・★）</option>
          <option value="unlearned">未学習のみ</option>
          <option value="all">すべての単語</option>
        </select>
      </div>

      {studyRecord && (
        <div className="rounded-xl border border-blue-200 bg-white p-4 dark:border-blue-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">即学習</p>
            <button
              type="button"
              className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              onClick={() => {
                setStudyId(null);
                setRevealed(false);
              }}
            >
              閉じる
            </button>
          </div>
          <FlashcardDeck
            record={studyRecord}
            revealed={revealed}
            direction="en-to-jp"
            contentMode="semantic"
            playbackRate={playbackRate}
            sched={progress.srs[studyRecord.id]}
            onPlaybackRate={setPlaybackRate}
            onReveal={() => setRevealed(true)}
            onGrade={handleGrade}
            onPrev={() => {}}
            onNext={() => setStudyId(null)}
            canPrev={false}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">単語</th>
                <th className="px-4 py-3 font-medium">意味</th>
                <th className="px-4 py-3 font-medium text-right">あいまい</th>
                <th className="px-4 py-3 font-medium">状態</th>
                <th className="px-4 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  onClick={() => {
                    setStudyId(row.id);
                    setRevealed(false);
                  }}
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {row.front}
                    {isHard(row.id, progress) && (
                      <span className="ml-1 text-amber-500" title="苦手">
                        ★
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.meaning}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={
                        row.maybeCount > 0
                          ? "rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                          : "text-slate-400"
                      }
                    >
                      {row.maybeCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {STATUS_LABEL[row.status]}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="rounded-lg bg-blue-100 px-2 py-1 text-sm hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
                      aria-label={`${row.front}の発音`}
                      onClick={(e) => {
                        e.stopPropagation();
                        void playWord(row);
                      }}
                    >
                      🔊
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
            該当する単語がありません。
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
