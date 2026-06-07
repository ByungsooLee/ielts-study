import { useEffect, useMemo, useState } from "react";
import { ReviewCard } from "../components/ReviewCard";
import { getReviewQueue } from "../lib/srs";
import { useContentStore } from "../stores/contentStore";
import { useProgressStore } from "../stores/progressStore";
import type { ItemType } from "../types";

export function ReviewPage() {
  const items = useContentStore((s) => s.items);
  const load = useContentStore((s) => s.load);
  const progress = useProgressStore((s) => s.progress);
  const [typeFilter, setTypeFilter] = useState<ItemType | "all">("all");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    void load();
  }, [load]);

  const queue = useMemo(
    () => getReviewQueue(items.map((r) => r.item), progress, typeFilter),
    [items, progress, typeFilter],
  );

  const current = queue[index];

  useEffect(() => {
    if (index >= queue.length) setIndex(0);
  }, [index, queue.length]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <select
          className="rounded border px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as ItemType | "all");
            setIndex(0);
          }}
        >
          <option value="all">すべて</option>
          <option value="word">単語</option>
          <option value="phrase">フレーズ</option>
          <option value="grammar">構文</option>
          <option value="conversation">会話</option>
        </select>
        <p className="text-sm text-slate-600">復習キュー: {queue.length} 件</p>
      </div>

      {current ? (
        <ReviewCard
          key={current.id}
          record={items.find((r) => r.id === current.id)!}
          onDone={() => setIndex((i) => i + 1)}
        />
      ) : (
        <div className="rounded-xl bg-white p-8 text-center text-slate-600 shadow-sm">
          今日の復習は完了です。お疲れさまでした。
        </div>
      )}
    </div>
  );
}
