import { create } from "zustand";

export type EngineeringStudyMode = "study" | "review";

interface EngineeringSessionState {
  collectionId: string | null;
  theme: number | null;
  studyMode: EngineeringStudyMode;
  tagFilter: string;
  index: number;
  revealed: boolean;
  deckKey: number;
  setCollection: (id: string | null) => void;
  setTheme: (theme: number | null) => void;
  setStudyMode: (mode: EngineeringStudyMode) => void;
  setTagFilter: (tag: string) => void;
  reveal: () => void;
  hide: () => void;
  next: () => void;
  prev: () => void;
  bumpDeckKey: () => void;
  resetIndex: () => void;
}

export const useEngineeringSessionStore = create<EngineeringSessionState>((set, get) => ({
  collectionId: null,
  theme: null,
  studyMode: "study",
  tagFilter: "",
  index: 0,
  revealed: false,
  deckKey: 0,
  setCollection: (collectionId) =>
    set({ collectionId, theme: null, index: 0, revealed: false, deckKey: get().deckKey + 1 }),
  setTheme: (theme) => set({ theme, index: 0, revealed: false, deckKey: get().deckKey + 1 }),
  setStudyMode: (studyMode) =>
    set({ studyMode, index: 0, revealed: false, deckKey: get().deckKey + 1 }),
  setTagFilter: (tagFilter) =>
    set({ tagFilter, index: 0, revealed: false, deckKey: get().deckKey + 1 }),
  reveal: () => set({ revealed: true }),
  hide: () => set({ revealed: false }),
  next: () => set((s) => ({ index: s.index + 1, revealed: false })),
  prev: () => set((s) => ({ index: Math.max(0, s.index - 1), revealed: false })),
  bumpDeckKey: () =>
    set((s) => ({ deckKey: s.deckKey + 1, index: 0, revealed: false })),
  resetIndex: () => set({ index: 0, revealed: false }),
}));
