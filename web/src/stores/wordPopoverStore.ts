/**
 * 単語ポップオーバー（意味シート）の開閉状態を全画面で1インスタンスに集約する軽量ストア。
 * WordChip タップで open(itemId)、シート側 subscribe で描画。
 */
import { create } from "zustand";

interface WordPopoverState {
  itemId: string | null;
  open: (itemId: string) => void;
  close: () => void;
}

export const useWordPopoverStore = create<WordPopoverState>((set) => ({
  itemId: null,
  open: (itemId) => set({ itemId }),
  close: () => set({ itemId: null }),
}));
