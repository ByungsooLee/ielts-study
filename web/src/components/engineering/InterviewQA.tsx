import { useCallback, useMemo, useState } from "react";
import { PlaybackSpeedPicker } from "../PlaybackSpeedPicker";
import { playPronunciation } from "../../lib/pronunciation";
import { useSettingsStore } from "../../stores/settingsStore";
import type { InterviewItem, InterviewSentence, InterviewTerm, PlaybackRate } from "../../types";

interface Props {
  item: InterviewItem;
  index: number;
  total: number;
  playbackRate: PlaybackRate;
  onPlaybackRate: (rate: PlaybackRate) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

interface HighlightPart {
  text: string;
  term?: InterviewTerm;
}

/** 文中の terms をハイライト用に分割（長い語を優先・各語の最初の出現のみ） */
function highlightSentence(en: string, terms: InterviewTerm[]): HighlightPart[] {
  if (!terms.length) return [{ text: en }];
  const sorted = [...terms].sort((a, b) => b.en.length - a.en.length);
  const used = new Set<string>();
  const parts: HighlightPart[] = [{ text: en }];

  for (const term of sorted) {
    const needle = term.en.toLowerCase();
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.term) continue;
      const at = part.text.toLowerCase().indexOf(needle);
      if (at === -1 || used.has(needle)) continue;
      used.add(needle);
      const before = part.text.slice(0, at);
      const match = part.text.slice(at, at + term.en.length);
      const after = part.text.slice(at + term.en.length);
      const replacement: HighlightPart[] = [];
      if (before) replacement.push({ text: before });
      replacement.push({ text: match, term });
      if (after) replacement.push({ text: after });
      parts.splice(i, 1, ...replacement);
      break;
    }
  }
  return parts;
}

export function InterviewQA({
  item,
  index,
  total,
  playbackRate,
  onPlaybackRate,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: Props) {
  const settings = useSettingsStore((s) => s.settings);
  const [view, setView] = useState<"jp" | "en">("jp");
  const [showQuestionEn, setShowQuestionEn] = useState(false);
  const [openSentence, setOpenSentence] = useState<number | null>(null);

  const sentences = item.answer.sentences ?? [];
  const fullEn = useMemo(() => sentences.map((s) => s.en).join(" "), [sentences]);

  const speak = useCallback(
    async (text: string) => {
      const t = text.trim();
      if (!t) return;
      try {
        await playPronunciation({
          text: t,
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

  const detail: InterviewSentence | null =
    openSentence != null ? sentences[openSentence] ?? null : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {index + 1} / {total} 件
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">再生速度</span>
          <PlaybackSpeedPicker value={playbackRate} onChange={onPlaybackRate} />
        </div>
      </div>

      {/* 質問 */}
      <div className="rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-900 dark:bg-slate-900">
        <div className="flex items-start gap-2">
          <button
            type="button"
            className="shrink-0 rounded-lg bg-emerald-100 px-2 py-1 text-sm hover:bg-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800"
            aria-label="質問を再生"
            onClick={() => void speak(item.question.tts || item.question.en)}
          >
            🔊
          </button>
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              面接官の質問
            </p>
            <p className="mt-1 text-base font-semibold leading-relaxed text-slate-900 dark:text-slate-100">
              {item.question.jp}
            </p>
            <button
              type="button"
              className="mt-1 text-xs text-emerald-600 hover:underline dark:text-emerald-400"
              onClick={() => setShowQuestionEn((v) => !v)}
            >
              {showQuestionEn ? "英文を隠す" : "英文を表示"}
            </button>
            {showQuestionEn && (
              <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {item.question.en}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 表示切替 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">模範回答</span>
        <div className="inline-flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600">
          <button
            type="button"
            className={`px-3 py-1.5 text-sm ${view === "jp" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-800"}`}
            onClick={() => setView("jp")}
          >
            日本語で確認
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-sm ${view === "en" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-800"}`}
            onClick={() => setView("en")}
          >
            英文で読む
          </button>
        </div>
        {view === "en" && (
          <button
            type="button"
            className="rounded-lg bg-emerald-100 px-3 py-1.5 text-sm hover:bg-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800"
            onClick={() => void speak(fullEn)}
          >
            🔊 全文
          </button>
        )}
      </div>

      {/* 日本語ビュー */}
      {view === "jp" && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {item.answer.jp}
          </p>
          <ol className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            {sentences.map((s, i) => (
              <li key={i} className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                <span className="mr-1 font-medium text-slate-400 dark:text-slate-500">{i + 1}.</span>
                {s.jp ?? s.en}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 英文ビュー：1文ずつ */}
      {view === "en" && (
        <ol className="space-y-3">
          {sentences.map((sentence, idx) => {
            const parts = highlightSentence(sentence.en, sentence.terms ?? []);
            return (
              <li
                key={idx}
                className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    className="shrink-0 rounded-lg bg-blue-100 px-2 py-1 text-sm hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
                    aria-label={`文${idx + 1}を再生`}
                    onClick={() => void speak(sentence.en)}
                  >
                    🔊
                  </button>
                  <button
                    type="button"
                    className="flex-1 text-left text-base leading-relaxed text-slate-900 dark:text-slate-100"
                    aria-label={`文${idx + 1}の解説を表示`}
                    onClick={() => setOpenSentence(idx)}
                  >
                    {parts.map((part, i) =>
                      part.term ? (
                        <span
                          key={i}
                          className="rounded bg-amber-200 px-0.5 font-semibold text-amber-900 underline decoration-amber-400 dark:bg-amber-900/60 dark:text-amber-100"
                        >
                          {part.text}
                        </span>
                      ) : (
                        <span key={i}>{part.text}</span>
                      ),
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  className="mt-1 pl-9 text-xs text-blue-600 hover:underline dark:text-blue-400"
                  onClick={() => setOpenSentence(idx)}
                >
                  構文・発音・語義を見る ▸
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {/* ナビ */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={!canPrev}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-40 dark:border-slate-600"
          onClick={onPrev}
        >
          ← 前
        </button>
        <button
          type="button"
          disabled={!canNext}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-40 dark:border-slate-600"
          onClick={onNext}
        >
          次 →
        </button>
      </div>

      {/* 詳細パネル（文タップ） */}
      {detail && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[75vh] max-w-2xl overflow-y-auto rounded-t-2xl border border-slate-300 bg-white p-4 shadow-2xl dark:border-slate-600 dark:bg-slate-900"
          role="dialog"
          aria-label="文の解説"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <button
                type="button"
                className="shrink-0 rounded-lg bg-blue-100 px-2 py-1 text-sm hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
                aria-label="この文を再生"
                onClick={() => void speak(detail.en)}
              >
                🔊
              </button>
              <p className="text-base font-semibold leading-relaxed text-slate-900 dark:text-slate-100">
                {detail.en}
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setOpenSentence(null)}
            >
              閉じる
            </button>
          </div>
          {detail.jp && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{detail.jp}</p>
          )}

          {/* 構文・文法 */}
          {(detail.syntax || (detail.grammar?.length ?? 0) > 0) && (
            <section className="mt-4">
              <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-300">構文・文法</h4>
              {detail.syntax && (
                <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {detail.syntax}
                </p>
              )}
              {(detail.grammar?.length ?? 0) > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                  {detail.grammar!.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* 発音 */}
          {(detail.linking || (detail.tips?.length ?? 0) > 0) && (
            <section className="mt-4">
              <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300">発音</h4>
              {detail.linking && (
                <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  <span className="font-medium">連結: </span>
                  {detail.linking}
                </p>
              )}
              {detail.tips?.map((tip, i) => (
                <p key={i} className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {tip}
                </p>
              ))}
            </section>
          )}

          {/* 単語の意味 */}
          {(detail.terms?.length ?? 0) > 0 && (
            <section className="mt-4">
              <h4 className="text-sm font-bold text-amber-700 dark:text-amber-300">単語の意味</h4>
              <ul className="mt-2 space-y-1.5">
                {detail.terms!.map((term, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <button
                      type="button"
                      className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-xs hover:bg-amber-200 dark:bg-amber-900 dark:hover:bg-amber-800"
                      aria-label={`${term.en} を再生`}
                      onClick={() => void speak(term.en)}
                    >
                      🔊
                    </button>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{term.en}</span>
                    {term.pos && (
                      <span className="text-xs text-slate-400 dark:text-slate-500">({term.pos})</span>
                    )}
                    <span className="text-slate-600 dark:text-slate-400">— {term.jp}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
