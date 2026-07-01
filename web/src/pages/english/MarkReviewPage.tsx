import { useMemo, useState } from "react";
import { playPronunciation } from "../../lib/pronunciation";
import { useContentStore } from "../../stores/contentStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { useWordMarkStore, type WordMark } from "../../stores/wordMarkStore";
import type { ContentRecord } from "../../types";

/**
 * マーク復習タブ: 黄・オレンジのマークが付いた単語をフラッシュカード形式で復習。
 * 「思い出せた」でマークを1段階下げる（オレンジ→黄→青）。「まだ」で維持。
 */
const COLOR_STYLES: Record<WordMark, string> = {
  blue: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
  yellow: "bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100",
  orange: "bg-orange-100 text-orange-900 dark:bg-orange-900/50 dark:text-orange-100",
};

const COLOR_LABEL: Record<WordMark, string> = {
  blue: "青（未マーク）",
  yellow: "黄（要復習）",
  orange: "オレンジ（強め）",
};

interface MarkedItem {
  record: ContentRecord;
  mark: WordMark;
}

export function MarkReviewPage() {
  const marks = useWordMarkStore((s) => s.marks);
  const cyclePrev = useWordMarkStore((s) => s.cyclePrev);
  const clearMark = useWordMarkStore((s) => s.clearMark);
  const setMark = useWordMarkStore((s) => s.setMark);
  const allRecords = useContentStore((s) => s.items);
  const accent = useSettingsStore((s) => s.settings.accent);
  const workerUrl = useSettingsStore((s) => s.settings.workerUrl);
  const syncToken = useSettingsStore((s) => s.settings.syncToken);

  const [filter, setFilter] = useState<"all" | "orange" | "yellow">("all");
  const [studyIdx, setStudyIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const marked: MarkedItem[] = useMemo(() => {
    const byId = new Map(allRecords.map((r) => [r.id, r] as const));
    return Object.entries(marks)
      .map(([id, m]) => {
        const record = byId.get(id);
        if (!record) return null;
        return { record, mark: m as WordMark };
      })
      .filter((x): x is MarkedItem => x !== null)
      .sort((a, b) => {
        // オレンジ優先、次に黄
        const rank: Record<WordMark, number> = { orange: 0, yellow: 1, blue: 2 };
        if (rank[a.mark] !== rank[b.mark]) return rank[a.mark] - rank[b.mark];
        return (a.record.item.n ?? 0) - (b.record.item.n ?? 0);
      });
  }, [marks, allRecords]);

  const filtered = useMemo(() => {
    if (filter === "all") return marked;
    return marked.filter((m) => m.mark === filter);
  }, [marked, filter]);

  const orangeCount = marked.filter((m) => m.mark === "orange").length;
  const yellowCount = marked.filter((m) => m.mark === "yellow").length;

  const boundedIdx = filtered.length === 0 ? 0 : Math.min(studyIdx, filtered.length - 1);
  const current = filtered[boundedIdx];

  function goNext() {
    if (filtered.length === 0) return;
    setRevealed(false);
    setStudyIdx((i) => (i + 1) % filtered.length);
  }

  function handleRemembered() {
    if (!current) return;
    cyclePrev(current.record.id); // 一段下げる（オレンジ→黄→青）
    goNext();
  }

  function handleForgot() {
    if (!current) return;
    setMark(current.record.id, "orange"); // 忘れたら強めに
    goNext();
  }

  function handleClear() {
    if (!current) return;
    clearMark(current.record.id);
    goNext();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            マーク復習
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            タブ内の単語をタップでマーク（青→黄→オレンジ）した語を復習
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip
            label={`全て (${marked.length})`}
            active={filter === "all"}
            onClick={() => {
              setFilter("all");
              setStudyIdx(0);
              setRevealed(false);
            }}
          />
          <FilterChip
            label={`オレンジ (${orangeCount})`}
            color="orange"
            active={filter === "orange"}
            onClick={() => {
              setFilter("orange");
              setStudyIdx(0);
              setRevealed(false);
            }}
          />
          <FilterChip
            label={`黄 (${yellowCount})`}
            color="yellow"
            active={filter === "yellow"}
            onClick={() => {
              setFilter("yellow");
              setStudyIdx(0);
              setRevealed(false);
            }}
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          マークした単語はまだありません。<br />
          Part 2/3/4 のヒント語や型ライブラリの単語をタップして「黄」「オレンジ」を付けてください。
        </div>
      )}

      {current && (
        <div
          className={`rounded-lg border p-6 shadow-sm dark:border-slate-700 ${COLOR_STYLES[current.mark]}`}
        >
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="rounded-full bg-white/60 px-2 py-0.5 font-semibold text-slate-700 dark:bg-slate-800/60 dark:text-slate-100">
              {COLOR_LABEL[current.mark]}
            </span>
            <span className="text-slate-500 dark:text-slate-300">
              {boundedIdx + 1} / {filtered.length}
            </span>
          </div>

          <p className="mb-3 text-2xl font-bold">
            {current.record.item.front}
          </p>

          {revealed ? (
            <div className="space-y-2">
              <p className="text-base text-slate-800 dark:text-slate-100">
                {current.record.item.meaning}
              </p>
              {current.record.item.synonyms && current.record.item.synonyms.length > 0 && (
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">言い換え: </span>
                  {current.record.item.synonyms.join(", ")}
                </p>
              )}
              {current.record.item.collocation && (
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">コロケーション: </span>
                  {current.record.item.collocation}
                </p>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-200 dark:text-slate-900"
              onClick={() => setRevealed(true)}
            >
              意味を見る
            </button>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200"
              onClick={() =>
                void playPronunciation({
                  text: current.record.item.front,
                  source: "word",
                  accent,
                  workerUrl,
                  syncToken,
                }).catch(() => {})
              }
            >
              🔊 発音
            </button>
            {revealed && (
              <>
                <button
                  type="button"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={handleRemembered}
                  title="1段階下げる（オレンジ→黄→青）"
                >
                  思い出せた（色を下げる）
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={handleForgot}
                  title="オレンジ（強め）に格上げ"
                >
                  まだ (強めに)
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300"
                  onClick={handleClear}
                  title="マーク解除して青に戻す"
                >
                  マーク解除
                </button>
                <button
                  type="button"
                  className="ml-auto rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400"
                  onClick={goNext}
                >
                  スキップ
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <MarkList items={filtered} accent={accent} workerUrl={workerUrl} syncToken={syncToken} />
      )}
    </div>
  );
}

function FilterChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color?: "yellow" | "orange";
  active: boolean;
  onClick: () => void;
}) {
  let cls = "border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200";
  if (active) {
    if (color === "orange") cls = "border-orange-600 bg-orange-600 text-white";
    else if (color === "yellow") cls = "border-amber-500 bg-amber-500 text-white";
    else cls = "border-slate-700 bg-slate-700 text-white dark:border-slate-200 dark:bg-slate-200 dark:text-slate-900";
  }
  return (
    <button
      type="button"
      className={`rounded-full border px-3 py-1 text-xs font-medium ${cls}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function MarkList({
  items,
  accent,
  workerUrl,
  syncToken,
}: {
  items: MarkedItem[];
  accent: string;
  workerUrl: string;
  syncToken: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">一覧</p>
      <ul className="divide-y divide-slate-200 dark:divide-slate-700">
        {items.map(({ record, mark }) => (
          <li key={record.id} className="flex items-center gap-3 py-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                mark === "orange" ? "bg-orange-600" : mark === "yellow" ? "bg-amber-500" : "bg-slate-300"
              }`}
              aria-label={COLOR_LABEL[mark]}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {record.item.front}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{record.item.meaning}</p>
            </div>
            <button
              type="button"
              className="rounded border border-slate-300 px-2 py-0.5 text-xs text-slate-700 dark:border-slate-600 dark:text-slate-200"
              onClick={() =>
                void playPronunciation({
                  text: record.item.front,
                  source: "word",
                  // biome-ignore lint/suspicious/noExplicitAny: accent 型はここで判別しない
                  accent: accent as any,
                  workerUrl,
                  syncToken,
                }).catch(() => {})
              }
            >
              🔊
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
