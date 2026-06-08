import { create } from "zustand";
import type {
  DeckSort,
  ItemType,
  SetSize,
  StudyContentMode,
  StudyDirection,
  StudyMode,
  ThemeRange,
} from "../types";
import type { ThemeFilter } from "../lib/themes";

const PREFS_KEY = "study-prefs";

interface StudyPrefs {
  category: ItemType;
  studyMode: StudyMode;
  direction: StudyDirection;
  contentMode: StudyContentMode;
  setSize: SetSize;
  sort: DeckSort;
  themeFilter: ThemeFilter;
  themeRangeMin: number | null;
  dueOnly: boolean;
  hardOnly: boolean;
  unlearnedOnly: boolean;
}

const defaultPrefs: StudyPrefs = {
  category: "word",
  studyMode: "review",
  direction: "en-to-jp",
  contentMode: "semantic",
  setSize: 10,
  sort: "random",
  themeFilter: "all",
  themeRangeMin: null,
  dueOnly: false,
  hardOnly: false,
  unlearnedOnly: false,
};

function loadPrefs(): StudyPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return defaultPrefs;
    return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch {
    return defaultPrefs;
  }
}

function pickPrefs(state: StudySessionState): StudyPrefs {
  return {
    category: state.category,
    studyMode: state.studyMode,
    direction: state.direction,
    contentMode: state.contentMode,
    setSize: state.setSize,
    sort: state.sort,
    themeFilter: state.themeFilter,
    themeRangeMin: state.themeRangeMin,
    dueOnly: state.dueOnly,
    hardOnly: state.hardOnly,
    unlearnedOnly: state.unlearnedOnly,
  };
}

function savePrefs(state: StudySessionState) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(pickPrefs(state)));
}

interface StudySessionState extends StudyPrefs {
  revealed: boolean;
  index: number;
  deckKey: string;
  setCategory: (category: ItemType) => void;
  setStudyMode: (mode: StudyMode) => void;
  setDirection: (direction: StudyDirection) => void;
  setContentMode: (mode: StudyContentMode) => void;
  setSetSize: (size: SetSize) => void;
  setSort: (sort: DeckSort) => void;
  setThemeFilter: (filter: ThemeFilter) => void;
  setThemeRange: (range: ThemeRange | null) => void;
  setDueOnly: (v: boolean) => void;
  setHardOnly: (v: boolean) => void;
  setUnlearnedOnly: (v: boolean) => void;
  reveal: () => void;
  hide: () => void;
  next: () => void;
  prev: () => void;
  resetIndex: () => void;
  bumpDeckKey: () => void;
}

export const useStudySessionStore = create<StudySessionState>((set, get) => ({
  ...loadPrefs(),
  revealed: false,
  index: 0,
  deckKey: "0",
  setCategory: (category) => {
    set({ category, revealed: false, index: 0, deckKey: String(Date.now()) });
    savePrefs(get());
  },
  setStudyMode: (studyMode) => {
    set({ studyMode, revealed: false, index: 0, deckKey: String(Date.now()) });
    savePrefs(get());
  },
  setDirection: (direction) => {
    set({ direction, revealed: false });
    savePrefs(get());
  },
  setContentMode: (contentMode) => {
    set({ contentMode, revealed: false });
    savePrefs(get());
  },
  setSetSize: (setSize) => {
    set({ setSize, revealed: false, index: 0, deckKey: String(Date.now()) });
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
  setDueOnly: (dueOnly) => {
    set({ dueOnly, revealed: false, index: 0, deckKey: String(Date.now()) });
    savePrefs(get());
  },
  setHardOnly: (hardOnly) => {
    set({ hardOnly, revealed: false, index: 0, deckKey: String(Date.now()) });
    savePrefs(get());
  },
  setUnlearnedOnly: (unlearnedOnly) => {
    set({ unlearnedOnly, revealed: false, index: 0, deckKey: String(Date.now()) });
    savePrefs(get());
  },
  reveal: () => set({ revealed: true }),
  hide: () => set({ revealed: false }),
  next: () => set((s) => ({ index: s.index + 1, revealed: false })),
  prev: () => set((s) => ({ index: Math.max(0, s.index - 1), revealed: false })),
  resetIndex: () => set({ index: 0, revealed: false }),
  bumpDeckKey: () => set({ deckKey: String(Date.now()), index: 0, revealed: false }),
}));

export function getThemeRangeFromPrefs(
  ranges: ThemeRange[],
  themeRangeMin: number | null,
): ThemeRange | null {
  if (themeRangeMin == null) return null;
  return ranges.find((r) => r.min === themeRangeMin) ?? null;
}
