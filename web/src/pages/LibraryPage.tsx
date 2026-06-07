import { useEffect, useMemo } from "react";
import { ImportZone } from "../components/ImportZone";
import { ItemCard } from "../components/ItemCard";
import { isHard } from "../lib/srs";
import { useContentStore } from "../stores/contentStore";
import { useProgressStore } from "../stores/progressStore";

export function LibraryPage() {
  const items = useContentStore((s) => s.items);
  const filters = useContentStore((s) => s.filters);
  const setFilters = useContentStore((s) => s.setFilters);
  const load = useContentStore((s) => s.load);
  const progress = useProgressStore((s) => s.progress);

  useEffect(() => {
    void load();
  }, [load]);

  const books = useMemo(() => [...new Set(items.map((i) => i.source.book).filter(Boolean))], [items]);
  const sections = useMemo(() => [...new Set(items.map((i) => i.source.section).filter(Boolean))], [items]);
  const tags = useMemo(
    () => [...new Set(items.flatMap((i) => i.item.tags ?? []))].sort(),
    [items],
  );

  const filtered = items.filter((record) => {
    const { item, source } = record;
    if (filters.type !== "all" && item.type !== filters.type) return false;
    if (filters.book && source.book !== filters.book) return false;
    if (filters.section && source.section !== filters.section) return false;
    if (filters.tag && !(item.tags ?? []).includes(filters.tag)) return false;
    if (filters.priority !== "all" && item.priority !== filters.priority) return false;
    if (filters.hardOnly && !isHard(item.id, progress)) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const hay = [item.front, item.meaning, ...(item.tags ?? [])].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <ImportZone />
      <div className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
        <input
          className="rounded border px-3 py-2 text-sm"
          placeholder="検索"
          value={filters.query}
          onChange={(e) => setFilters({ query: e.target.value })}
        />
        <select className="rounded border px-3 py-2 text-sm" value={filters.type} onChange={(e) => setFilters({ type: e.target.value as typeof filters.type })}>
          <option value="all">すべての種類</option>
          <option value="word">単語</option>
          <option value="phrase">フレーズ</option>
          <option value="grammar">構文</option>
          <option value="conversation">会話</option>
        </select>
        <select className="rounded border px-3 py-2 text-sm" value={filters.priority} onChange={(e) => setFilters({ priority: e.target.value as typeof filters.priority })}>
          <option value="all">すべての優先度</option>
          <option value="S">S</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
        <select className="rounded border px-3 py-2 text-sm" value={filters.book} onChange={(e) => setFilters({ book: e.target.value })}>
          <option value="">すべての本</option>
          {books.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select className="rounded border px-3 py-2 text-sm" value={filters.section} onChange={(e) => setFilters({ section: e.target.value })}>
          <option value="">すべての章</option>
          {sections.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select className="rounded border px-3 py-2 text-sm" value={filters.tag} onChange={(e) => setFilters({ tag: e.target.value })}>
          <option value="">すべてのタグ</option>
          {tags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={filters.hardOnly} onChange={(e) => setFilters({ hardOnly: e.target.checked })} />
          苦手のみ
        </label>
      </div>

      <p className="text-sm text-slate-500">{filtered.length} 件</p>
      <div className="space-y-4">
        {filtered.map((record) => (
          <ItemCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
