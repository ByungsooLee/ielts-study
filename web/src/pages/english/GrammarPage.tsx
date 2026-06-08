import { useEffect, useMemo, useState } from "react";
import { CategoryStudyView } from "../../components/english/CategoryStudyView";
import { filterEnglishRecords } from "../../lib/domain";
import { ensureEnglishVocabTheme } from "../../lib/staticContent";
import { useContentStore } from "../../stores/contentStore";

export function GrammarPage() {
  const allItems = useContentStore((s) => s.items);
  const items = useMemo(() => filterEnglishRecords(allItems), [allItems]);
  const load = useContentStore((s) => s.load);
  const [shardLoading, setShardLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        await ensureEnglishVocabTheme(0);
        if (!cancelled) await load();
      } finally {
        if (!cancelled) setShardLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">文法</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          文法項目をフラッシュカードで学習します。
        </p>
      </div>
      {shardLoading && items.filter((r) => r.item.type === "grammar").length === 0 && (
        <p className="text-sm text-slate-500">文法データを読み込み中…</p>
      )}
      <CategoryStudyView category="grammar" items={items} grammarMode />
    </div>
  );
}
