import { useEffect, useState } from "react";
import { MermaidDiagram } from "./MermaidDiagram";
import { PlaybackSpeedPicker } from "../PlaybackSpeedPicker";
import { RecordingPanel } from "../RecordingPanel";
import { playPronunciation } from "../../lib/pronunciation";
import { useSettingsStore } from "../../stores/settingsStore";
import type { ContentRecord, Grade, PlaybackRate, Sched } from "../../types";

interface Props {
  record: ContentRecord;
  playbackRate: PlaybackRate;
  onPlaybackRate: (rate: PlaybackRate) => void;
  onGrade: (grade: Grade) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  sched?: Sched;
}

export function DiagramConceptCard({
  record,
  playbackRate,
  onPlaybackRate,
  onGrade,
  onPrev,
  onNext,
  canPrev,
  sched,
}: Props) {
  const { item } = record;
  const settings = useSettingsStore((s) => s.settings);
  const explain = item.explain;
  const diagram = item.diagram;

  const [error, setError] = useState<string | null>(null);
  const [draftEn, setDraftEn] = useState("");
  const [modelRevealed, setModelRevealed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [showDictation, setShowDictation] = useState(false);
  const [dictation, setDictation] = useState("");

  useEffect(() => {
    setDraftEn("");
    setModelRevealed(false);
    setMoreOpen(false);
    setShowDictation(false);
    setDictation("");
    setError(null);
  }, [item.id]);

  async function playText(text: string) {
    setError(null);
    try {
      await playPronunciation({
        item,
        text,
        source: "sentence",
        accent: settings.accent,
        workerUrl: settings.workerUrl,
        syncToken: settings.syncToken,
        playbackRate,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "再生に失敗しました");
    }
  }

  if (!explain || !diagram?.mermaid) {
    return (
      <div className="rounded-xl bg-white p-6 text-slate-600 shadow-sm dark:bg-slate-900">
        図解データ（diagram / explain）がありません。
      </div>
    );
  }

  const modelText = explain.model_en;
  const ttsText = item.pron?.tts ?? modelText;
  const summaryJa = item.ja ?? item.detail_ja ?? item.meaning;
  const targets = explain.targets ?? [];
  const phrases = item.phrases ?? [];

  return (
    <div className="min-w-0 space-y-4 rounded-xl border border-emerald-200 bg-white p-4 shadow-sm sm:p-6 dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            {item.collection} · {item.themeName}
          </p>
          <h2 className="mt-1 break-words text-xl font-bold text-slate-900 dark:text-slate-100">
            {item.front}
          </h2>
        </div>
        <PlaybackSpeedPicker value={playbackRate} onChange={onPlaybackRate} />
      </div>

      <MermaidDiagram code={diagram.mermaid} className="w-full" />

      <section className="space-y-3" aria-labelledby="eng-diagram-drill">
        <h3 id="eng-diagram-drill" className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
          説明ドリル
        </h3>
        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
          <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">問い（日本語）</p>
          <p className="mt-2 break-words text-slate-800 dark:text-slate-200">{explain.prompt_ja}</p>
        </div>

        <p className="text-sm text-slate-500">図を見て、英語で説明してから録音してください。</p>

        <textarea
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          rows={4}
          placeholder="英語で説明を入力…"
          value={draftEn}
          onChange={(e) => setDraftEn(e.target.value)}
        />

        <RecordingPanel
          itemId={item.id}
          label="自分の説明を録音（シャドーイング）"
          onCompareModel={() => playText(modelText)}
        />

        {!modelRevealed ? (
          <button
            type="button"
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            onClick={() => setModelRevealed(true)}
          >
            モデルを見る
          </button>
        ) : (
          <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">模範英文</p>
              <button
                type="button"
                className="rounded-lg border border-emerald-300 px-3 py-1.5 text-sm text-emerald-800 dark:border-emerald-700 dark:text-emerald-200"
                onClick={() => void playText(ttsText)}
              >
                🔊 再生
              </button>
            </div>
            <p className="break-words leading-relaxed text-slate-900 dark:text-slate-100">{modelText}</p>

            {targets.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">ターゲット語彙</p>
                <div className="flex flex-wrap gap-2">
                  {targets.map((t) => (
                    <span
                      key={t.term}
                      title={t.collocation ? `${t.ja} — ${t.collocation}` : t.ja}
                      className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-xs text-slate-800 dark:border-emerald-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <span className="font-medium">{t.term}</span>
                      <span className="ml-1 text-slate-500 dark:text-slate-400">({t.ja})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {phrases.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">定型表現</p>
                <div className="flex flex-wrap gap-2">
                  {phrases.map((p, i) => (
                    <span
                      key={`${p.func}-${i}`}
                      title={`${p.ja} — ${p.en}`}
                      className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100"
                    >
                      {p.func}: {p.en}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-slate-600 dark:text-slate-400"
          aria-expanded={showDictation}
          onClick={() => setShowDictation((v) => !v)}
        >
          ディクテーション（模範を聞いて入力）
          <span>{showDictation ? "▲" : "▼"}</span>
        </button>
        {showDictation && (
          <div className="space-y-2 border-t border-slate-200 px-4 py-3 dark:border-slate-700">
            <button
              type="button"
              className="text-sm text-emerald-700 hover:underline dark:text-emerald-300"
              onClick={() => void playText(modelText)}
            >
              🔊 模範を再生してから入力
            </button>
            <textarea
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              rows={3}
              placeholder="聞き取った英文を入力…"
              value={dictation}
              onChange={(e) => setDictation(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((v) => !v)}
        >
          もっと知る
          <span className="text-slate-400">{moreOpen ? "▲" : "▼"}</span>
        </button>
        {moreOpen && (
          <div className="space-y-3 border-t border-slate-200 px-4 py-3 dark:border-slate-700">
            {summaryJa && (
              <div>
                <p className="text-xs font-medium text-slate-500">要点（日本語）</p>
                <p className="mt-1 break-words text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {summaryJa}
                </p>
              </div>
            )}
            {item.note && (
              <div>
                <p className="text-xs font-medium text-slate-500">メモ</p>
                <p className="mt-1 break-words text-sm text-slate-700 dark:text-slate-300">{item.note}</p>
              </div>
            )}
            {item.examples && item.examples.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500">例文</p>
                {item.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <p className="break-words text-sm text-slate-900 dark:text-slate-100">{ex.en}</p>
                    {ex.jp && (
                      <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-400">{ex.jp}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {sched && (
        <p className="text-xs text-slate-500">
          復習 {sched.reps} 回 · あいまい {sched.maybeCount ?? 0} 回
        </p>
      )}

      <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
        <button
          type="button"
          className="rounded bg-red-500 px-4 py-2 text-sm text-white"
          onClick={() => onGrade("forgot")}
        >
          言えなかった
        </button>
        <button
          type="button"
          className="rounded bg-amber-500 px-4 py-2 text-sm text-white"
          onClick={() => onGrade("maybe")}
        >
          あいまい
        </button>
        <button
          type="button"
          className="rounded bg-emerald-600 px-4 py-2 text-sm text-white"
          onClick={() => onGrade("remembered")}
        >
          言えた
        </button>
      </div>

      <div className="flex justify-between border-t border-slate-200 pt-3 dark:border-slate-700">
        <button
          type="button"
          className="text-sm text-slate-600 disabled:opacity-40 dark:text-slate-400"
          disabled={!canPrev}
          onClick={onPrev}
        >
          ← 前の概念
        </button>
        <button type="button" className="text-sm text-slate-600 dark:text-slate-400" onClick={onNext}>
          次の概念 →
        </button>
      </div>
    </div>
  );
}
