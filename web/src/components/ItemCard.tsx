import { playPronunciation } from "../lib/pronunciation";
import { isHard } from "../lib/srs";
import { PlaybackSpeedPicker } from "./PlaybackSpeedPicker";
import { useContentStore } from "../stores/contentStore";
import { useProgressStore } from "../stores/progressStore";
import { useSettingsStore } from "../stores/settingsStore";
import type { ContentRecord } from "../types";
import { PronunciationNotes } from "./PronunciationNotes";
import { RecordingPanel } from "./RecordingPanel";

interface Props {
  record: ContentRecord;
  onNavigate?: (id: string) => void;
}

export function ItemCard({ record, onNavigate }: Props) {
  const { item, source } = record;
  const progress = useProgressStore((s) => s.progress);
  const toggleHard = useProgressStore((s) => s.toggleHard);
  const unsuspendItem = useProgressStore((s) => s.unsuspendItem);
  const getById = useContentStore((s) => s.getById);
  const settings = useSettingsStore((s) => s.settings);
  const playbackRate = useSettingsStore((s) => s.settings.playbackRate);
  const setPlaybackRate = useSettingsStore((s) => s.setPlaybackRate);
  const hard = isHard(item.id, progress);
  const suspended = progress.srs[item.id]?.status === "suspended";

  async function play() {
    try {
      await playPronunciation({
        item,
        accent: settings.accent,
        workerUrl: settings.workerUrl,
        syncToken: settings.syncToken,
        playbackRate,
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : "発音再生に失敗しました");
    }
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{item.type}</span>
            {item.priority && (
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">{item.priority}</span>
            )}
            {hard && <span className="rounded bg-rose-100 px-2 py-0.5 text-xs text-rose-700">苦手</span>}
            {suspended && (
              <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                リーチ（停止中）
              </span>
            )}
          </div>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.front}</h3>
          {item.ipa && <p className="text-sm text-slate-500">{item.ipa}</p>}
          <p className="mt-1 text-slate-700">{item.meaning}</p>
          <p className="mt-1 text-xs text-slate-400">
            {source.book ?? "不明"} / {source.section ?? "-"} / {source.added}
          </p>
        </div>
        <button
          type="button"
          className={`text-2xl ${hard ? "text-amber-500" : "text-slate-300"}`}
          onClick={() => toggleHard(item.id)}
          title="苦手フラグ"
        >
          ★
        </button>
      </div>

      {item.synonyms?.length ? (
        <p className="mt-2 text-sm text-slate-600">言い換え: {item.synonyms.join(", ")}</p>
      ) : null}
      {item.collocation && <p className="mt-1 text-sm text-slate-600">コロケーション: {item.collocation}</p>}

      {item.examples?.map((ex, i) => (
        <div key={i} className="mt-2 rounded bg-slate-50 p-2 text-sm">
          <p className="text-slate-800">{ex.en}</p>
          {ex.jp && <p className="text-slate-500">{ex.jp}</p>}
          <PronunciationNotes sentence={ex.en} example={ex} pron={i === 0 ? item.pron : undefined} compact />
        </div>
      ))}

      {item.links?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.links.map((linkId) => (
            <button
              key={linkId}
              type="button"
              className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700"
              onClick={() => onNavigate?.(linkId)}
            >
              関連: {getById(linkId)?.item.front ?? linkId}
            </button>
          ))}
        </div>
      ) : null}

      {!item.examples?.length && item.pron && (
        <PronunciationNotes sentence={item.pron.tts ?? item.front} pron={item.pron} />
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PlaybackSpeedPicker value={playbackRate} onChange={setPlaybackRate} />
        <button type="button" className="rounded bg-blue-600 px-3 py-1 text-sm text-white" onClick={() => void play()}>
          発音
        </button>
        {suspended && (
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-1 text-sm dark:border-slate-600"
            onClick={() => unsuspendItem(item.id)}
          >
            復習を再開
          </button>
        )}
      </div>

      <div className="mt-3">
        <RecordingPanel itemId={item.id} onCompareModel={() => play()} />
      </div>
    </article>
  );
}
