import { useEffect, useState } from "react";
import { RecordingPanel } from "../RecordingPanel";
import { PlaybackSpeedPicker } from "../PlaybackSpeedPicker";
import { playPronunciation } from "../../lib/pronunciation";
import { useSettingsStore } from "../../stores/settingsStore";
import type { ContentRecord, EngineeringStep, Grade, PlaybackRate, Sched } from "../../types";

const STEPS: { id: EngineeringStep; label: string }[] = [
  { id: "understand", label: "1. 理解" },
  { id: "points", label: "2. 骨子" },
  { id: "phrases", label: "3. フレーズ" },
  { id: "practice", label: "4. 産出" },
];

interface Props {
  record: ContentRecord;
  step: EngineeringStep;
  onStep: (step: EngineeringStep) => void;
  playbackRate: PlaybackRate;
  onPlaybackRate: (rate: PlaybackRate) => void;
  onGrade: (grade: Grade) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  sched?: Sched;
}

export function ConceptExplainCard({
  record,
  step,
  onStep,
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
  const [error, setError] = useState<string | null>(null);
  const [showModelLong, setShowModelLong] = useState(false);
  const [showDictation, setShowDictation] = useState(false);
  const [dictation, setDictation] = useState("");
  const explain = item.explain;

  useEffect(() => {
    setShowModelLong(false);
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

  if (!explain) {
    return (
      <div className="rounded-xl bg-white p-6 text-slate-600 shadow-sm dark:bg-slate-900">
        この項目には explain データがありません。
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  function goNextStep() {
    if (stepIndex < STEPS.length - 1) onStep(STEPS[stepIndex + 1].id);
  }

  function goPrevStep() {
    if (stepIndex > 0) onStep(STEPS[stepIndex - 1].id);
  }

  return (
    <div className="space-y-4 rounded-xl border border-emerald-200 bg-white p-4 shadow-sm sm:p-6 dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            {item.collection} · {item.themeName}
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{item.front}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.meaning}</p>
        </div>
        <PlaybackSpeedPicker value={playbackRate} onChange={onPlaybackRate} />
      </div>

      <nav
        className="flex gap-1 overflow-x-auto pb-1"
        role="tablist"
        aria-label="学習ステップ"
      >
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={step === s.id}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium ${
              step === s.id
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900"
            }`}
            onClick={() => onStep(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {step === "understand" && (
        <section className="space-y-4" aria-labelledby="eng-understand">
          <h3 id="eng-understand" className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            技術的理解（日本語）
          </h3>
          {item.detail_ja ? (
            <p className="leading-relaxed text-slate-800 dark:text-slate-200">{item.detail_ja}</p>
          ) : (
            <p className="text-sm text-slate-500">detail_ja がありません。</p>
          )}
          {item.examples && item.examples.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500">具体例</p>
              {item.examples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <p className="text-sm leading-relaxed text-slate-900 dark:text-slate-100">{ex.en}</p>
                  {ex.jp && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{ex.jp}</p>
                  )}
                  <button
                    type="button"
                    className="mt-2 text-sm text-emerald-700 hover:underline dark:text-emerald-300"
                    onClick={() => void playText(ex.en)}
                  >
                    🔊 例文を再生
                  </button>
                </div>
              ))}
            </div>
          )}
          <StepNav onPrev={goPrevStep} onNext={goNextStep} canPrev={stepIndex > 0} nextLabel="骨子へ" />
        </section>
      )}

      {step === "points" && (
        <section className="space-y-4" aria-labelledby="eng-points">
          <h3 id="eng-points" className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            説明の骨子（英語で言うとき押さえる点）
          </h3>
          {(explain.points_ja?.length ?? 0) > 0 ? (
            <ul className="space-y-2">
              {explain.points_ja!.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-slate-800 dark:bg-emerald-950/30 dark:text-slate-200"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                    {i + 1}
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">points_ja がありません。</p>
          )}
          <StepNav onPrev={goPrevStep} onNext={goNextStep} canPrev canNext nextLabel="フレーズへ" />
        </section>
      )}

      {step === "phrases" && (
        <section className="space-y-4" aria-labelledby="eng-phrases">
          <h3 id="eng-phrases" className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            英語フレーズ（説明の部品）
          </h3>
          {(explain.key_phrases?.length ?? 0) > 0 ? (
            <ul className="space-y-2">
              {explain.key_phrases!.map((phrase, i) => (
                <li
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{phrase}</span>
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-100 px-2 py-1 text-sm hover:bg-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800"
                    aria-label={`${phrase}を再生`}
                    onClick={() => void playText(phrase)}
                  >
                    🔊
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">key_phrases がありません。</p>
          )}
          <StepNav onPrev={goPrevStep} onNext={goNextStep} canPrev canNext nextLabel="産出練習へ" />
        </section>
      )}

      {step === "practice" && (
        <section className="space-y-4" aria-labelledby="eng-practice">
          <h3 id="eng-practice" className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            産出練習（英語で説明）
          </h3>

          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">問い（日本語）</p>
            <p className="mt-2 text-slate-800 dark:text-slate-200">{explain.prompt_ja}</p>
          </div>

          <p className="text-sm text-slate-500">
            骨子とフレーズを踏まえ、英語で説明してから録音し、模範と比較してください。
          </p>

          <RecordingPanel
            itemId={item.id}
            label="自分の説明を録音"
            onCompareModel={() => playText(explain.model_en)}
          />

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">模範（短）</p>
              <button
                type="button"
                className="rounded-lg border border-emerald-300 px-3 py-1.5 text-sm text-emerald-800 dark:border-emerald-700 dark:text-emerald-200"
                onClick={() => void playText(explain.model_en)}
              >
                🔊 再生
              </button>
            </div>
            <p className="mt-2 leading-relaxed text-slate-900 dark:text-slate-100">{explain.model_en}</p>
          </div>

          {explain.model_en_long && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300"
                aria-expanded={showModelLong}
                onClick={() => setShowModelLong((v) => !v)}
              >
                模範（厚）— 面接・プレゼン想定
                <span className="text-slate-400">{showModelLong ? "▲" : "▼"}</span>
              </button>
              {showModelLong && (
                <div className="max-h-64 overflow-y-auto border-t border-slate-200 px-4 py-3 dark:border-slate-700">
                  <p className="leading-relaxed text-slate-900 dark:text-slate-100">{explain.model_en_long}</p>
                  <button
                    type="button"
                    className="mt-3 rounded-lg border border-emerald-300 px-3 py-1.5 text-sm text-emerald-800 dark:border-emerald-700 dark:text-emerald-200"
                    onClick={() => void playText(explain.model_en_long!)}
                  >
                    🔊 厚い模範を再生
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-slate-600 dark:text-slate-400"
              aria-expanded={showDictation}
              onClick={() => setShowDictation((v) => !v)}
            >
              任意：ディクテーション（模範短を聞いて入力）
              <span>{showDictation ? "▲" : "▼"}</span>
            </button>
            {showDictation && (
              <div className="space-y-2 border-t border-slate-200 px-4 py-3 dark:border-slate-700">
                <button
                  type="button"
                  className="text-sm text-emerald-700 hover:underline dark:text-emerald-300"
                  onClick={() => void playText(explain.model_en)}
                >
                  🔊 模範（短）を再生してから入力
                </button>
                <textarea
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                  rows={3}
                  placeholder="聞き取った英文を入力…"
                  value={dictation}
                  onChange={(e) => setDictation(e.target.value)}
                />
                {dictation.trim() && (
                  <p className="text-xs text-slate-500">
                    模範と比較して自己採点に進んでください。
                  </p>
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
            <button type="button" className="rounded bg-red-500 px-4 py-2 text-sm text-white" onClick={() => onGrade("forgot")}>
              忘れた (1)
            </button>
            <button type="button" className="rounded bg-amber-500 px-4 py-2 text-sm text-white" onClick={() => onGrade("maybe")}>
              あいまい (2)
            </button>
            <button type="button" className="rounded bg-emerald-600 px-4 py-2 text-sm text-white" onClick={() => onGrade("remembered")}>
              覚えてた (3)
            </button>
          </div>

          <StepNav onPrev={goPrevStep} onNext={goNextStep} canPrev canNext={false} />
        </section>
      )}

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

function StepNav({
  onPrev,
  onNext,
  canPrev,
  canNext = true,
  nextLabel = "次へ",
}: {
  onPrev: () => void;
  onNext: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex justify-between gap-2 pt-2">
      {canPrev ? (
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600"
          onClick={onPrev}
        >
          ← 前のステップ
        </button>
      ) : (
        <span />
      )}
      {canNext && (
        <button
          type="button"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
          onClick={onNext}
        >
          {nextLabel} →
        </button>
      )}
    </div>
  );
}
