import { useState } from "react";
import { PlaybackSpeedPicker } from "./PlaybackSpeedPicker";
import { playPronunciation } from "../lib/pronunciation";
import { useProgressStore } from "../stores/progressStore";
import { useSettingsStore } from "../stores/settingsStore";
import { PronunciationNotes } from "./PronunciationNotes";
import type { ContentRecord, PlaybackRate } from "../types";

interface Props {
  record: ContentRecord;
  onDone: () => void;
}

export function ReviewCard({ record, onDone }: Props) {
  const { item } = record;
  const gradeItem = useProgressStore((s) => s.gradeItem);
  const settings = useSettingsStore((s) => s.settings);
  const [step, setStep] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);

  const prompt =
    item.type === "conversation"
      ? item.examples?.[0]?.jp ?? item.meaning
      : item.type === "grammar"
        ? "この構文の意味を思い出してください"
        : "この意味の英語を思い出してください";

  const answer =
    item.type === "grammar" && item.examples?.[0]?.en
      ? item.examples[0].en
      : item.front;

  async function playAnswer() {
    try {
      await playPronunciation({
        item,
        text: answer,
        accent: settings.accent,
        workerUrl: settings.workerUrl,
        syncToken: settings.syncToken,
        playbackRate,
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : "発音再生に失敗しました");
    }
  }

  function grade(kind: "forgot" | "maybe" | "remembered") {
    gradeItem(item.id, kind);
    setStep(0);
    onDone();
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{item.type}</p>
      <div className="mt-4 min-h-[120px]">
        {step === 0 && <p className="text-lg text-slate-800">{prompt}</p>}
        {step === 1 && <p className="text-lg text-slate-700">ヒント: {item.meaning}</p>}
        {step >= 2 && (
          <div>
            <p className="text-2xl font-semibold text-slate-900">{answer}</p>
            {item.examples?.[0]?.jp && <p className="mt-2 text-slate-600">{item.examples[0].jp}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <PlaybackSpeedPicker value={playbackRate} onChange={setPlaybackRate} />
              <button type="button" className="text-sm text-blue-600" onClick={() => void playAnswer()}>
                答えを再生
              </button>
            </div>
            <PronunciationNotes pron={item.pron} />
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {step < 2 ? (
          <button
            type="button"
            className="rounded bg-slate-700 px-4 py-2 text-white"
            onClick={() => setStep((s) => s + 1)}
          >
            {step === 0 ? "ヒントを見る" : "答えを見る"}
          </button>
        ) : (
          <>
            <button type="button" className="rounded bg-rose-600 px-4 py-2 text-white" onClick={() => grade("forgot")}>
              忘れた
            </button>
            <button type="button" className="rounded bg-amber-500 px-4 py-2 text-white" onClick={() => grade("maybe")}>
              あいまい
            </button>
            <button type="button" className="rounded bg-emerald-600 px-4 py-2 text-white" onClick={() => grade("remembered")}>
              覚えてた
            </button>
          </>
        )}
      </div>
    </div>
  );
}
