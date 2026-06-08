import { useCallback, useMemo, useState } from "react";
import { PlaybackSpeedPicker } from "./PlaybackSpeedPicker";
import { buildHighlightedParts } from "../lib/passageHighlight";
import { playPronunciation } from "../lib/pronunciation";
import { useSettingsStore } from "../stores/settingsStore";
import type { ContentRecord, Passage, PlaybackRate, StudyItem } from "../types";

interface Props {
  passage: Passage;
  records: ContentRecord[];
  playbackRate: PlaybackRate;
  onPlaybackRate: (rate: PlaybackRate) => void;
}

export function PassagePanel({ passage, records, playbackRate, onPlaybackRate }: Props) {
  const settings = useSettingsStore((s) => s.settings);
  const [expandedTips, setExpandedTips] = useState<Set<number>>(new Set());
  const [glossId, setGlossId] = useState<string | null>(null);

  const itemsById = useMemo(() => {
    const map = new Map<string, StudyItem>();
    for (const r of records) map.set(r.id, r.item);
    return map;
  }, [records]);

  const playSentence = useCallback(
    async (text: string, sampleItem?: StudyItem) => {
      try {
        await playPronunciation({
          item: sampleItem,
          text,
          source: "sentence",
          accent: settings.accent,
          workerUrl: settings.workerUrl,
          syncToken: settings.syncToken,
          playbackRate,
        });
      } catch (e) {
        alert(e instanceof Error ? e.message : "発音再生に失敗しました");
      }
    },
    [settings, playbackRate],
  );

  function toggleTips(idx: number) {
    setExpandedTips((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  return (
    <div className="space-y-4 rounded-xl border border-blue-200 bg-white p-4 dark:border-blue-900 dark:bg-slate-900">
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="text-lg font-bold leading-snug text-blue-900 dark:text-blue-100 sm:min-w-0 sm:flex-1 sm:pr-4">
            長文 — テーマ{passage.theme} {passage.themeName}
          </h3>
          <div className="flex shrink-0 items-center justify-end gap-2 sm:pt-0.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">再生速度</span>
            <PlaybackSpeedPicker value={playbackRate} onChange={onPlaybackRate} />
          </div>
        </div>
        {passage.jp && (
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{passage.jp}</p>
        )}
      </div>

      <ol className="space-y-4">
        {passage.sentences.map((sentence, idx) => {
          const targets = sentence.targets ?? [];
          const parts = buildHighlightedParts(sentence.en, targets);
          const sampleItem = targets[0]?.id ? itemsById.get(targets[0].id) : undefined;

          return (
            <li
              key={idx}
              className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50"
            >
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  className="shrink-0 rounded-lg bg-blue-100 px-2 py-1 text-sm hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
                  aria-label={`文${idx + 1}を再生`}
                  onClick={() => void playSentence(sentence.en, sampleItem)}
                >
                  🔊
                </button>
                <p className="flex-1 text-base leading-relaxed text-slate-900 dark:text-slate-100">
                  {parts.map((part, i) =>
                    part.highlight && part.id ? (
                      <button
                        key={i}
                        type="button"
                        className="rounded bg-amber-200 px-0.5 font-semibold text-amber-900 underline decoration-amber-400 hover:bg-amber-300 dark:bg-amber-900/60 dark:text-amber-100"
                        onClick={() => setGlossId(part.id!)}
                      >
                        {part.text}
                      </button>
                    ) : (
                      <span key={i}>{part.text}</span>
                    ),
                  )}
                </p>
              </div>

              {sentence.jp && (
                <p className="mt-2 pl-9 text-sm text-slate-600 dark:text-slate-400">{sentence.jp}</p>
              )}

              {(sentence.linking || (sentence.tips?.length ?? 0) > 0) && (
                <div className="mt-2 pl-9">
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                    onClick={() => toggleTips(idx)}
                  >
                    {expandedTips.has(idx) ? "連結・発音ヒントを隠す" : "連結・発音ヒントを表示"}
                  </button>
                  {expandedTips.has(idx) && (
                    <div className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {sentence.linking && (
                        <p>
                          <span className="font-medium">連結: </span>
                          {sentence.linking}
                        </p>
                      )}
                      {sentence.tips?.map((tip, ti) => (
                        <p key={ti}>{tip}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {glossId && itemsById.has(glossId) && (
        <div
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-lg rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-lg dark:border-amber-700 dark:bg-amber-950"
          role="dialog"
          aria-label="語の意味"
        >
          {(() => {
            const item = itemsById.get(glossId)!;
            return (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-bold text-amber-900 dark:text-amber-100">{item.front}</p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">{item.meaning}</p>
                    {item.synonyms?.length ? (
                      <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                        言い換え: {item.synonyms.join(", ")}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="rounded px-2 py-1 text-sm hover:bg-amber-200 dark:hover:bg-amber-900"
                    onClick={() => setGlossId(null)}
                  >
                    閉じる
                  </button>
                </div>
                <button
                  type="button"
                  className="mt-2 rounded-lg bg-amber-200 px-3 py-1.5 text-sm dark:bg-amber-900"
                  onClick={() => void playPronunciation({
                    item,
                    accent: settings.accent,
                    workerUrl: settings.workerUrl,
                    syncToken: settings.syncToken,
                    playbackRate,
                  })}
                >
                  🔊 発音
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
