import { useState } from "react";
import { playPronunciation } from "../lib/pronunciation";
import { useSettingsStore } from "../stores/settingsStore";
import { PlaybackSpeedPicker } from "./PlaybackSpeedPicker";
import type { PlaybackRate } from "../types";

interface Props {
  label: string;
  text: string;
}

export function SentencePlayRow({ label, text }: Props) {
  const settings = useSettingsStore((s) => s.settings);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);

  async function play() {
    try {
      await playPronunciation({
        text,
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
    <div className="flex flex-wrap items-center gap-2">
      <PlaybackSpeedPicker value={playbackRate} onChange={setPlaybackRate} />
      <button type="button" className="text-sm text-blue-600" onClick={() => void play()}>
        {label}
      </button>
    </div>
  );
}
