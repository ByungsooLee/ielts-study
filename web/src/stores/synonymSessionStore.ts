import { create } from "zustand";
import type { DeckSort, ThemeRange } from "../types";
import type { ThemeFilter } from "../lib/themes";

const PREFS_KEY = "synonym-prefs";

interface SynonymPrefs {
  sort: DeckSort;
  themeFilter: ThemeFilter;
  themeRangeMin: number | null;
  hardOnly: boolean;
}

const defaultPrefs: SynonymPrefs = {
  sort: "random",
  themeFilter: "all",
  themeRangeMin: null,
  hardOnly: false,
};

function loadPrefs(): SynonymPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return defaultPrefs;
    const parsed = JSON.parse(raw) as Partial<SynonymPrefs>;
    return { ...defaultPrefs, ...parsed };
  } catch {
    return defaultPrefs;
  }
}

function pickPrefs(state: SynonymSessionState): SynonymPrefs {
  return {
    sort: state.sort,
    themeFilter: state.themeFilter,
    themeRangeMin: state.themeRangeMin,
    hardOnly: state.hardOnly,
  };
}

function savePrefs(state: SynonymSessionState) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(pickPrefs(state)));
}

interface SynonymSessionState extends SynonymPrefs {
  index: number;
  deckKey: string;
  setSort: (sort: DeckSort) => void;
  setThemeFilter: (filter: ThemeFilter) => void;
  setThemeRange: (range: ThemeRange | null) => void;
  setHardOnly: (v: boolean) => void;
  next: () => void;
  prev: () => void;
  bumpDeckKey: () => void;
}

export const useSynonymSessionStore = create<SynonymSessionState>((set, get) => ({
  ...loadPrefs(),
  index: 0,
  deckKey: "0",
  setSort: (sort) => {
    set({ sort, index: 0, deckKey: String(Date.now()) });
    savePrefs(get());
  },
  setThemeFilter: (themeFilter) => {
    set({ themeFilter, themeRangeMin: null, index: 0, deckKey: String(Date.now()) });
    savePrefs(get());
  },
  setThemeRange: (range) => {
    const themeRangeMin = range?.min ?? null;
    set({ themeFilter: "all", themeRangeMin, index: 0, deckKey: String(Date.now()) });
    savePrefs(get());
  },
  setHardOnly: (hardOnly) => {
    set({ hardOnly, index: 0, deckKey: String(Date.now()) });
    savePrefs(get());
  },
  next: () => set((s) => ({ index: s.index + 1 })),
  prev: () => set((s) => ({ index: Math.max(0, s.index - 1) })),
  bumpDeckKey: () => set({ deckKey: String(Date.now()), index: 0 }),
}));

export function getSynonymThemeRangeFromPrefs(
  ranges: ThemeRange[],
  themeRangeMin: number | null,
): ThemeRange | null {
  if (themeRangeMin == null) return null;
  return ranges.find((r) => r.min === themeRangeMin) ?? null;
}
