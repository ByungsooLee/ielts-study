/**
 * 単語モード：セクションの items[] を func 別グルーピングで一覧表示。
 * 各行:  front（タップで意味シート）  |  意味/synonyms/collocation（トグルで隠せる）  |  🔊  |  SRS 3ボタン
 * 音声と SRS は視覚的・レイアウト的に離した独立ブロック。
 * 進捗: 全語 N のうち "覚えてた"(green) 相当が何件かを表示。
 */
import { useMemo, useState } from "react";
import { playPronunciation } from "../../lib/pronunciation";
import { srsColor } from "../../lib/srs";
import { useProgressStore } from "../../stores/progressStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { useWordPopoverStore } from "../../stores/wordPopoverStore";
import { SrsGradeButtons } from "./SrsGradeButtons";
import type { DrillKind, StudyItem } from "../../types";

interface Props {
  items: StudyItem[];
  kind: DrillKind;
  /** ドリル系ページで focus されている func（薄くハイライト） */
  focusFunc?: string;
}

const TASK1_FUNC_LABELS: Record<string, string> = {
  "up-gradual": "ゆるやかな上昇",
  "up-sharp": "急上昇",
  "down-gradual": "ゆるやかな下降",
  "down-sharp": "急落",
  overtake: "追い越す",
  peak: "頂点",
  trough: "底",
  flat: "横ばい",
  fluctuate: "変動",
  time: "時間",
  quantity: "量・倍数",
  describe: "図の提示",
  compare: "比較",
  topic: "話題語彙",
};

const WRITING_FUNC_LABELS: Record<string, string> = {
  opinion: "意見",
  reason: "理由",
  example: "例示",
  concession: "譲歩",
  contrast: "対比",
  "cause-effect": "因果",
  result: "結果",
  conclusion: "結論",
  topic: "話題語彙",
};

const SPEAKING_FUNC_LABELS: Record<string, string> = {
  "sp-opinion": "意見",
  "sp-preference": "好み",
  "sp-frequency": "頻度",
  "sp-filler": "フィラー",
  "sp-emphasis": "強調",
  "sp-idiom": "イディオム",
  "sp-hedge": "ぼかし",
  topic: "話題語彙",
};

function labelForFunc(kind: DrillKind, f: string): string {
  if (kind === "task1") return TASK1_FUNC_LABELS[f] ?? f;
  if (kind === "writing") return WRITING_FUNC_LABELS[f] ?? f;
  return SPEAKING_FUNC_LABELS[f] ?? f;
}

export function WordModeView({ items, kind, focusFunc }: Props) {
  // 既定は「隠す」。単語だけを見て思い出せるか試し、タップで意味シート／トグルで一括表示。
  const [showMeaning, setShowMeaning] = useState(false);
  const openPopover = useWordPopoverStore((s) => s.open);
  const srs = useProgressStore((s) => s.progress.srs);
  const accent = useSettingsStore((s) => s.settings.accent);
  const workerUrl = useSettingsStore((s) => s.settings.workerUrl);
  const syncToken = useSettingsStore((s) => s.settings.syncToken);

  const groups = useMemo(() => {
    const map = new Map<string, StudyItem[]>();
    for (const it of items) {
      const f = it.func ?? "topic";
      if (!map.has(f)) map.set(f, []);
      map.get(f)!.push(it);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  const total = items.length;
  const learned = useMemo(
    () => items.filter((it) => srsColor(srs[it.id]) === "green").length,
    [items, srs],
  );
  const dueToday = useMemo(() => {
    const today = Math.floor(Date.now() / 86400000);
    return items.filter((it) => {
      const s = srs[it.id];
      if (!s || s.status === "suspended" || s.status === "new") return false;
      return s.due <= today;
    }).length;
  }, [items, srs]);

  function playWord(front: string, lookup?: string) {
    void playPronunciation({
      text: lookup ?? front,
      source: "word",
      accent,
      workerUrl,
      syncToken,
    }).catch(() => {});
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            進捗 {learned} / {total}
          </span>
          {dueToday > 0 && (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
              今日 {dueToday}
            </span>
          )}
        </div>
        <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={showMeaning}
            onChange={(e) => setShowMeaning(e.target.checked)}
            className="h-4 w-4"
          />
          意味を表示
        </label>
      </div>

      {groups.map(([f, list]) => {
        const isFocus = f === focusFunc;
        return (
          <section
            key={f}
            className={`rounded-lg border ${
              isFocus
                ? "border-blue-500 dark:border-blue-400"
                : "border-slate-200 dark:border-slate-700"
            } bg-white dark:bg-slate-900`}
          >
            <header className="flex items-center justify-between border-b border-slate-100 px-3 py-1.5 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {labelForFunc(kind, f)}
                <span className="ml-2 text-slate-400">{list.length}</span>
              </span>
            </header>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {list.map((it) => (
                <li key={it.id} className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      className="text-base font-semibold text-slate-900 hover:text-blue-700 dark:text-slate-100 dark:hover:text-blue-300"
                      onClick={() => openPopover(it.id)}
                      title="タップで意味シートを開く"
                    >
                      {it.front}
                    </button>
                    {showMeaning && (
                      <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                        <span className="text-slate-800 dark:text-slate-200">{it.meaning}</span>
                        {it.synonyms && it.synonyms.length > 0 && (
                          <span className="ml-2">
                            <span className="text-slate-400">≒</span> {it.synonyms.join(", ")}
                          </span>
                        )}
                        {it.collocation && (
                          <span className="ml-2">
                            <span className="text-slate-400">|</span> {it.collocation}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs text-slate-700 dark:border-slate-600 dark:text-slate-200"
                      onClick={() => playWord(it.front, it.pron?.lookup)}
                      aria-label={`${it.front} を再生`}
                    >
                      🔊
                    </button>
                    <SrsGradeButtons itemId={it.id} size="sm" showState />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
