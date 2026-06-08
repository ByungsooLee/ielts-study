import { PlaybackSpeedPicker } from "./PlaybackSpeedPicker";
import { PronunciationNotes } from "./PronunciationNotes";
import { RecordingPanel } from "./RecordingPanel";
import { UserSentenceForm } from "./UserSentenceForm";
import { daysUntilDue } from "../lib/sm2";
import { todayDay } from "../lib/srs";
import type { ContentRecord, PlaybackRate, Sched, StudyDirection } from "../types";

interface Props {
  record: ContentRecord;
  direction: StudyDirection;
  playbackRate: PlaybackRate;
  sched?: Sched;
  onPlaybackRate: (rate: PlaybackRate) => void;
  onPlayFront: () => void;
  onPlayExample: () => void;
}

export function FlashcardAnswer({
  record,
  direction,
  playbackRate,
  sched,
  onPlaybackRate,
  onPlayFront,
  onPlayExample,
}: Props) {
  const { item } = record;
  const today = todayDay();
  const nextDays = sched ? daysUntilDue(sched, today) : null;
  const example = item.examples?.[0];
  const showFront = direction === "jp-to-en" || item.type === "grammar" || item.type === "conversation";

  return (
    <div className="space-y-3">
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 md:text-3xl">
        {showFront ? item.front : item.meaning}
      </p>
      {item.ipa && <p className="font-mono text-sm text-slate-500">{item.ipa}</p>}

      {!showFront && (
        <p className="text-lg text-slate-700 dark:text-slate-300">
          <span className="text-sm text-slate-500">英: </span>
          {item.front}
        </p>
      )}
      {showFront && item.meaning && (
        <p className="text-lg text-slate-700 dark:text-slate-300">
          <span className="text-sm text-slate-500">意味: </span>
          {item.meaning}
        </p>
      )}

      {item.synonyms && item.synonyms.length > 0 && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium">言い換え: </span>
          {item.synonyms.join(", ")}
        </p>
      )}
      {item.collocation && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium">コロケーション: </span>
          {item.collocation}
        </p>
      )}

      {example && (
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
          <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200">{example.en}</p>
          {example.jp && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{example.jp}</p>}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <PlaybackSpeedPicker value={playbackRate} onChange={onPlaybackRate} />
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
          onClick={onPlayFront}
        >
          🔊 {item.front}
        </button>
        {example && (
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
            onClick={onPlayExample}
          >
            🔊 例文
          </button>
        )}
      </div>

      <PronunciationNotes
        sentence={example?.en ?? item.pron?.tts ?? item.front}
        example={example}
        pron={item.pron}
      />

      {(item.type === "word" || item.type === "phrase") && <UserSentenceForm itemId={item.id} />}

      <RecordingPanel
        itemId={item.id}
        label="発音練習"
        onCompareModel={async () => onPlayFront()}
      />

      {sched && sched.status !== "new" && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          次回まで {nextDays} 日 / interval {sched.interval} 日 / EF {sched.ef.toFixed(2)}
          {sched.status === "suspended" && " · リーチ（停止中）"}
        </p>
      )}
    </div>
  );
}
