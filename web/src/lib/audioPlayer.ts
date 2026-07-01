export const PLAYBACK_RATES = [
  { value: 0.5, label: "0.5x" },
  { value: 0.7, label: "0.7x" },
  { value: 1, label: "1x" },
  { value: 1.2, label: "1.2x" },
  { value: 1.5, label: "1.5x" },
  { value: 2, label: "2x" },
] as const;

export type PlaybackRate = (typeof PLAYBACK_RATES)[number]["value"];

export async function playAudioBlob(blob: Blob, playbackRate = 1): Promise<void> {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.playbackRate = playbackRate;
  await new Promise<void>((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("音声再生に失敗しました"));
    };
    void audio.play().catch(reject);
  });
}
