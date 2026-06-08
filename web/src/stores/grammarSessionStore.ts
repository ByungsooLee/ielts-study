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

interface GrammarSessionState extends GrammarPrefs {
  revealed: boolean;
  index: number;
  deckKey: string;
  quizOpen: boolean;
  setStudyMode: (mode: GrammarStudyMode) => void;
  setGenreFilter: (filter: ThemeFilter) => void;
  reveal: () => void;
  next: () => void;
  prev: () => void;
  bumpDeckKey: () => void;
  setQuizOpen: (open: boolean) => void;
}

export const useGrammarSessionStore = create<GrammarSessionState>((set, get) => ({
  ...loadPrefs(),
  revealed: false,
  index: 0,
  deckKey: "0",
  quizOpen: false,
  setStudyMode: (studyMode) => {
    set({ studyMode, revealed: false, index: 0, deckKey: String(Date.now()), quizOpen: false });
    savePrefs(get());
  },
  setGenreFilter: (genreFilter) => {
    set({ genreFilter, revealed: false, index: 0, deckKey: String(Date.now()), quizOpen: false });
    savePrefs(get());
  },
  reveal: () => set({ revealed: true }),
  next: () => set((s) => ({ index: s.index + 1, revealed: false, quizOpen: false })),
  prev: () => set((s) => ({ index: Math.max(0, s.index - 1), revealed: false, quizOpen: false })),
  bumpDeckKey: () => set({ deckKey: String(Date.now()), index: 0, revealed: false, quizOpen: false }),
  setQuizOpen: (quizOpen) => set({ quizOpen }),
}));

export function isGenreSelected(filter: ThemeFilter): filter is number {
  return typeof filter === "number";
}
