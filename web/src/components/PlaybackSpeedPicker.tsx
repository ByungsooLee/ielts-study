import { PLAYBACK_RATES } from "../lib/audioPlayer";
import type { PlaybackRate } from "../types";

interface Props {
  value: PlaybackRate;
  onChange: (rate: PlaybackRate) => void;
}

export function PlaybackSpeedPicker({ value, onChange }: Props) {
  return (
    <select
      className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
      value={value}
      onChange={(e) => onChange(Number(e.target.value) as PlaybackRate)}
      aria-label="再生速度"
    >
      {PLAYBACK_RATES.map((r) => (
        <option key={r.value} value={r.value}>
          {r.label}
        </option>
      ))}
    </select>
  );
}
