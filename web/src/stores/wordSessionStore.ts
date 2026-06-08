import { create } from "zustand";
import type {
  DeckSort,
  StudyContentMode,
  StudyDirection,
  ThemeRange,
} from "../types";
import type { ThemeFilter } from "../lib/themes";

const PREFS_KEY = "word-study-prefs";

interface WordPrefs {
  direction: StudyDirection;
  contentMode: StudyContentMode;
  sort: DeckSort;
  themeFilter: ThemeFilter;
  themeRangeMin: number | null;
}

const defaultPrefs: WordPrefs = {
  direction: "en-to-jp",
  contentMode: "semantic",
  sort: "random",
  themeFilter: "all",
  themeRangeMin: null,
};

function loadPrefs(): WordPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return defaultPrefs;
    return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch {
    return defaultPrefs;
  }
}

function savePrefs(state: WordSessionState) {
  localStorage.setItem(
    PREFS_KEY,
    JSON.stringify({
      direction: state.direction,
      contentMode: state.contentMode,
      sort: state.sort,
      themeFilter: state.themeFilter,
      themeRangeMin: state.themeRangeMin,
    }),
  );
}

interface WordSessionState extends WordPrefs {
  revealed: boolean;
  index: number;
  deckKey: string;
  setDirection: (direction: StudyDirection) => void;
  setContentMode: (mode: StudyContentMode) => void;
  setSort: (sort: DeckSort) => void;
  setThemeFilter: (filter: ThemeFilter) => void;
  setThemeRange: (range: ThemeRange | null) => void;
  reveal: () => void;
  next: () => void;
  prev: () => void;
  bumpDeckKey: () => void;
}

export const useWordSessionStore = create<WordSessionState>((set, get) => ({
  ...loadPrefs(),
  revealed: false,
  index: 0,
  deckKey: "0",
  setDirection: (direction) => {
    set({ direction, revealed: false });
    savePrefs(get());
  },
  setContentMode: (contentMode) => {
    set({ contentMode, revealed: false });
    savePrefs(get());
  },
  setSort: (sort) => {
    set({ sort, revealed: false, index: 0, deckKey: String(Date.now()) });
    savePrefs(get());
  },
  setThemeFilter: (themeFilter) => {
    set({ themeFilter, themeRangeMin: null, revealed: false, index: 0, deckKey: String(Date.now()) });
    savePrefs(get());
  },
  setThemeRange: (range) => {
    const themeRangeMin = range?.min ?? null;
    set({ themeFilter: "all", themeRangeMin, revealed: false, index: 0, deckKey: String(Date.now()) });
    savePrefs(get());
  },
  reveal: () => set({ revealed: true }),
  next: () => set((s) => ({ index: s.index + 1, revealed: false })),
  prev: () => set((s) => ({ index: Math.max(0, s.index - 1), revealed: false })),
  bumpDeckKey: () => set({ deckKey: String(Date.now()), index: 0, revealed: false }),
}));

export function isThemeSelected(filter: ThemeFilter): filter is number {
  return typeof filter === "number";
}
