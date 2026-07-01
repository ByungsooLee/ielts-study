/**
 * 画面全体で共有される単語詳細シート（ボトムシート / モーダル風）。
 * WordChip タップで開き、背景タップまたは×で閉じる。
 * 内容: front / IPA / meaning / synonyms / collocation / examples / 🔊 / SRS 3ボタン
 * 音声と SRS は同じシート内でも「別ブロック・別見た目」で分離。
 */
import { useEffect } from "react";
import { playPronunciation } from "../../lib/pronunciation";
import { srsColor, type SrsColor } from "../../lib/srs";
import { useContentStore } from "../../stores/contentStore";
import { useProgressStore } from "../../stores/progressStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { useWordPopoverStore } from "../../stores/wordPopoverStore";
import { SrsGradeButtons } from "./SrsGradeButtons";

const HEADER_STYLE: Record<SrsColor, string> = {
  neutral: "bg-slate-100 dark:bg-slate-800",
  red: "bg-rose-100 dark:bg-rose-900/60",
  yellow: "bg-amber-100 dark:bg-amber-900/60",
  green: "bg-emerald-100 dark:bg-emerald-900/60",
};

const HEADER_LABEL: Record<SrsColor, string> = {
  neutral: "未学習",
  red: "忘れた",
  yellow: "あいまい",
  green: "覚えてた",
};

export function WordDetailSheet() {
  const itemId = useWordPopoverStore((s) => s.itemId);
  const close = useWordPopoverStore((s) => s.close);
  const records = useContentStore((s) => s.items);
  const sched = useProgressStore((s) => (itemId ? s.progress.srs[itemId] : undefined));
  const accent = useSettingsStore((s) => s.settings.accent);
  const workerUrl = useSettingsStore((s) => s.settings.workerUrl);
  const syncToken = useSettingsStore((s) => s.settings.syncToken);
  const playbackRate = useSettingsStore((s) => s.settings.playbackRate);

  // ESC で閉じる
  useEffect(() => {
    if (!itemId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [itemId, close]);

  if (!itemId) return null;

  const record = records.find((r) => r.id === itemId);
  const item = record?.item;
  if (!item) {
    // まだ contentStore に載っていない場合はシートを閉じる
    return (
      <div className="fixed inset-0 z-40" onClick={close} role="presentation">
        <div className="absolute inset-0 bg-black/30" />
      </div>
    );
  }

  const color = srsColor(sched);
  const example = item.examples?.[0];

  function playWord() {
    if (!item) return;
    void playPronunciation({
      text: item.pron?.lookup ?? item.front,
      source: "word",
      accent,
      workerUrl,
      syncToken,
      playbackRate,
    }).catch(() => {});
  }

  function playExample() {
    if (!example?.en) return;
    void playPronunciation({
      text: example.en,
      source: "sentence",
      accent,
      workerUrl,
      syncToken,
      playbackRate,
    }).catch(() => {});
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center" role="dialog" aria-modal>
      <button
        type="button"
        aria-label="閉じる"
        className="absolute inset-0 bg-black/40"
        onClick={close}
      />
      <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-xl bg-white shadow-xl sm:rounded-xl dark:bg-slate-900">
        <div className={`flex items-center justify-between gap-2 px-4 py-3 ${HEADER_STYLE[color]}`}>
          <div className="min-w-0">
            <p className="truncate text-xl font-bold text-slate-900 dark:text-slate-50">{item.front}</p>
            {item.ipa && (
              <p className="font-mono text-xs text-slate-600 dark:text-slate-300">{item.ipa}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-slate-800 dark:bg-slate-800/70 dark:text-slate-100">
              {HEADER_LABEL[color]}
            </span>
            <button
              type="button"
              className="rounded-full bg-white/60 px-2 py-0.5 text-lg leading-none text-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
              onClick={close}
              aria-label="閉じる"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-3 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              意味
            </p>
            <p className="mt-0.5 text-base leading-relaxed text-slate-900 dark:text-slate-100">
              {item.meaning}
            </p>
          </div>

          {item.synonyms && item.synonyms.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                言い換え
              </p>
              <p className="mt-0.5 text-sm text-slate-800 dark:text-slate-200">
                {item.synonyms.join(", ")}
              </p>
            </div>
          )}

          {item.collocation && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                コロケーション
              </p>
              <p className="mt-0.5 text-sm text-slate-800 dark:text-slate-200">{item.collocation}</p>
            </div>
          )}

          {example?.en && (
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm leading-relaxed text-slate-900 dark:text-slate-100">{example.en}</p>
              {example.jp && (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{example.jp}</p>
              )}
            </div>
          )}

          {/* 音声ブロック（SRS とは別ブロック） */}
          <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              音声（再生のみ）
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200"
                onClick={playWord}
              >
                🔊 {item.front}
              </button>
              {example?.en && (
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 dark:border-slate-600 dark:text-slate-200"
                  onClick={playExample}
                >
                  🔊 例文
                </button>
              )}
            </div>
          </div>

          {/* 定着度ブロック（音声とは別ブロック） */}
          <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              定着度（SRS 採点）
            </p>
            <SrsGradeButtons itemId={item.id} size="md" />
          </div>
        </div>
      </div>
    </div>
  );
}
