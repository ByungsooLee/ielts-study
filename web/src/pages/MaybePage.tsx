import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  collectMaybeWordStats,
  summarizeMaybeStats,
  type MaybeWordStat,
} from "../lib/maybeStats";
import { useContentStore } from "../stores/contentStore";
import { useProgressStore } from "../stores/progressStore";

type FilterMode = "all" | "with-maybe" | "unlearned";

const STATUS_LABEL: Record<MaybeWordStat["status"], string> = {
  unseen: "未学習",
  new: "未学習",
  learning: "学習中",
  review: "復習中",
  suspended: "保留",
};

export function MaybePage() {
  const items = useContentStore((s) => s.items);
  const load = useContentStore((s) => s.load);
  const progress = useProgressStore((s) => s.progress);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => collectMaybeWordStats(items, progress), [items, progress]);
  const summary = useMemo(() => summarizeMaybeStats(stats), [stats]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stats.filter((row) => {
      if (filter === "with-maybe" && row.maybeCount === 0) return false;
      if (filter === "unlearned" && row.status !== "unseen" && row.status !== "new") return false;
      if (!q) return true;
      return `${row.front} ${row.meaning}`.toLowerCase().includes(q);
    });
  }, [stats, query, filter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">あいまい一覧</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          全単語の「あいまい」ボタン押下回数を確認できます。学習中に押した分から反映されます。
        </p>
      </div>

      <div className="grid gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900 sm:grid-cols-4">
        <StatCard label="単語数" value={String(summary.wordCount)} />
        <StatCard label="あいまいあり" value={String(summary.withMaybeCount)} />
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
          <option value="all">すべての単語</option>
          <option value="with-maybe">あいまい 1 回以上</option>
          <option value="unlearned">未学習のみ</option>
        </select>
        <Link
          to="/study"
          className="rounded bg-blue-600 px-4 py-2 text-center text-sm text-white hover:bg-blue-700"
        >
          学習へ
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">単語</th>
                <th className="px-4 py-3 font-medium">意味</th>
                <th className="px-4 py-3 font-medium text-right">あいまい</th>
                <th className="px-4 py-3 font-medium">状態</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {row.front}
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
