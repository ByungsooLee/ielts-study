import { create } from "zustand";
import type { ThemeFilter } from "../lib/themes";

export type GrammarStudyMode = "card" | "review" | "cloze";

const PREFS_KEY = "grammar-study-prefs";

interface GrammarPrefs {
  studyMode: GrammarStudyMode;
  genreFilter: ThemeFilter;
}

const defaultPrefs: GrammarPrefs = {
  studyMode: "card",
  genreFilter: "all",
};

function loadPrefs(): GrammarPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return defaultPrefs;
    return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch {
    return defaultPrefs;
  }
}

function savePrefs(state: GrammarSessionState) {
  localStorage.setItem(
    PREFS_KEY,
    JSON.stringify({
      studyMode: state.studyMode,
      genreFilter: state.genreFilter,
    }),
  );
}

function resetDrillState() {
  return {
    drillIndex: 0,
    drillRevealed: false,
    moreOpen: false,
    clozeOpen: false,
  };
}

interface GrammarSessionState extends GrammarPrefs {
  index: number;
  deckKey: string;
  drillIndex: number;
  drillRevealed: boolean;
  moreOpen: boolean;
  clozeOpen: boolean;
  setStudyMode: (mode: GrammarStudyMode) => void;
  setGenreFilter: (filter: ThemeFilter) => void;
  revealDrill: () => void;
  advanceAfterGrade: (drillCount: number) => void;
  next: () => void;
  prev: () => void;
  bumpDeckKey: () => void;
  setMoreOpen: (open: boolean) => void;
  setClozeOpen: (open: boolean) => void;
}

export const useGrammarSessionStore = create<GrammarSessionState>((set, get) => ({
  ...loadPrefs(),
  index: 0,
  deckKey: "0",
  drillIndex: 0,
  drillRevealed: false,
  moreOpen: false,
  clozeOpen: false,
  setStudyMode: (studyMode) => {
    set({ studyMode, index: 0, deckKey: String(Date.now()), ...resetDrillState() });
    savePrefs(get());
  },
  setGenreFilter: (genreFilter) => {
    set({ genreFilter, index: 0, deckKey: String(Date.now()), ...resetDrillState() });
    savePrefs(get());
  },
  revealDrill: () => set({ drillRevealed: true }),
  advanceAfterGrade: (drillCount) => {
    const { drillIndex, index } = get();
    if (drillCount > 0 && drillIndex + 1 < drillCount) {
      set({ drillIndex: drillIndex + 1, drillRevealed: false });
      return;
    }
    set({ index: index + 1, ...resetDrillState() });
  },
  next: () => set((s) => ({ index: s.index + 1, ...resetDrillState() })),
  prev: () =>
    set((s) => ({
      index: Math.max(0, s.index - 1),
      ...resetDrillState(),
    })),
  bumpDeckKey: () => set({ deckKey: String(Date.now()), index: 0, ...resetDrillState() }),
  setMoreOpen: (moreOpen) => set({ moreOpen }),
  setClozeOpen: (clozeOpen) => set({ clozeOpen }),
}));

export function isGenreSelected(filter: ThemeFilter): filter is number {
  return typeof filter === "number";
}
