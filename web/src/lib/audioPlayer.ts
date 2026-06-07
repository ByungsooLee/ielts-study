export const PLAYBACK_RATES = [
  { value: 0.75, label: "0.75x（ゆっくり）" },
  { value: 1, label: "1x（標準）" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x（速い）" },
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
