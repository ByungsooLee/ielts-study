import { useEffect, useMemo } from "react";
import { CategoryStudyView } from "../../components/english/CategoryStudyView";
import { filterEnglishRecords } from "../../lib/domain";
import { useContentStore } from "../../stores/contentStore";

export function GrammarPage() {
  const allItems = useContentStore((s) => s.items);
  const items = useMemo(() => filterEnglishRecords(allItems), [allItems]);
  const load = useContentStore((s) => s.load);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">文法</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          文法項目をフラッシュカードで学習します。
        </p>
      </div>
      <CategoryStudyView category="grammar" items={items} grammarMode />
    </div>
  );
}
