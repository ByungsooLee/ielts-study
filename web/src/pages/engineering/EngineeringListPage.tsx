import { useEffect, useMemo, useState } from "react";
import { filterEngineeringRecords } from "../../lib/domain";
import { getMaybeCount } from "../../lib/maybeStats";
import { useContentStore } from "../../stores/contentStore";
import { useProgressStore } from "../../stores/progressStore";

export function EngineeringListPage() {
  const allItems = useContentStore((s) => s.items);
  const load = useContentStore((s) => s.load);
  const progress = useProgressStore((s) => s.progress);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    void load();
  }, [load]);

  const items = useMemo(() => filterEngineeringRecords(allItems), [allItems]);
  const tags = useMemo(
    () => [...new Set(items.flatMap((r) => r.item.tags ?? []))].sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      if (tag && !(r.item.tags ?? []).includes(tag)) return false;
      if (!q) return true;
      const hay = [
        r.item.front,
        r.item.meaning,
        r.item.explain?.prompt_ja,
        r.item.explain?.model_en,
        ...(r.item.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, tag]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">概念一覧</h2>
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          className="flex-1 rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          placeholder="検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value="">すべてのタグ</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3">見出し</th>
              <th className="px-4 py-3">意味</th>
              <th className="px-4 py-3 text-right">あいまい</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 font-medium">{r.item.front}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.item.meaning}</td>
                <td className="px-4 py-3 text-right">{getMaybeCount(progress, r.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-slate-500">該当なし</p>
        )}
      </div>
    </div>
  );
}
