import { create } from "zustand";
import { fetchTtsUsage } from "../lib/ttsUsage";
import type { TtsUsageStatus } from "../types";

interface TtsUsageState {
  usage: TtsUsageStatus | null;
  loadError: string | null;
  setUsage: (usage: TtsUsageStatus | null) => void;
  refresh: (workerUrl: string, syncToken: string) => Promise<void>;
}

export const useTtsUsageStore = create<TtsUsageState>((set) => ({
  usage: null,
  loadError: null,
  setUsage: (usage) => set({ usage, loadError: null }),
  refresh: async (workerUrl, syncToken) => {
    if (!workerUrl || !syncToken) {
      set({ usage: null, loadError: null });
      return;
    }
    try {
      const usage = await fetchTtsUsage(workerUrl, syncToken);
      if (!usage) {
        set({
          usage: null,
          loadError: "使用量を取得できませんでした。Worker を再デプロイしてください。",
        });
        return;
      }
      set({ usage, loadError: null });
    } catch {
      set({
        usage: null,
        loadError: "使用量の取得に失敗しました。Worker URL と合言葉を確認してください。",
      });
    }
  },
}));
