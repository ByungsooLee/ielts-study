import { create } from "zustand";
import type { Accent, AppSettings, ColorMode, DailyNewLimit, SyncStatus } from "../types";
import { SM2 } from "../lib/sm2";

const SETTINGS_KEY = "settings";

const envDefaults: Pick<AppSettings, "workerUrl" | "syncToken"> = {
  workerUrl: import.meta.env.VITE_DEFAULT_WORKER_URL ?? "",
  syncToken: import.meta.env.VITE_DEFAULT_SYNC_TOKEN ?? "",
};

const defaultSettings: AppSettings = {
  workerUrl: "",
  syncToken: "",
  accent: "en-GB",
  colorMode: "system",
  dailyNewLimit: SM2.DAILY_NEW_DEFAULT,
};

function applyColorMode(mode: ColorMode) {
  const root = document.documentElement;
  if (mode === "system") {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", dark);
    return;
  }
  root.classList.toggle("dark", mode === "dark");
}

function normalizeDailyNewLimit(value: unknown): DailyNewLimit {
  if (value === 5 || value === 10 || value === 20 || value === 50 || value === 100) return value;
  return SM2.DAILY_NEW_DEFAULT;
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      const s = { ...defaultSettings, ...envDefaults };
      applyColorMode(s.colorMode);
      return s;
    }
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const settings: AppSettings = {
      ...defaultSettings,
      ...parsed,
      workerUrl: (parsed.workerUrl || envDefaults.workerUrl).trim(),
      syncToken: (parsed.syncToken || envDefaults.syncToken).trim(),
      accent: parsed.accent ?? defaultSettings.accent,
      colorMode: parsed.colorMode ?? defaultSettings.colorMode,
      dailyNewLimit: normalizeDailyNewLimit(parsed.dailyNewLimit),
    };
    applyColorMode(settings.colorMode);
    return settings;
  } catch {
    const s = { ...defaultSettings, ...envDefaults };
    applyColorMode(s.colorMode);
    return s;
  }
}

interface SettingsState {
  settings: AppSettings;
  syncStatus: SyncStatus;
  lastSyncedAt: number | null;
  syncError: string | null;
  setWorkerUrl: (url: string) => void;
  setSyncToken: (token: string) => void;
  setAccent: (accent: Accent) => void;
  setColorMode: (mode: ColorMode) => void;
  setDailyNewLimit: (limit: DailyNewLimit) => void;
  setSyncStatus: (status: SyncStatus, error?: string | null) => void;
  setLastSyncedAt: (ts: number) => void;
}

function persist(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: loadSettings(),
  syncStatus: "idle",
  lastSyncedAt: null,
  syncError: null,
  setWorkerUrl: (url) => {
    const settings = { ...get().settings, workerUrl: url.trim() };
    persist(settings);
    set({ settings });
  },
  setSyncToken: (token) => {
    const settings = { ...get().settings, syncToken: token.trim() };
    persist(settings);
    set({ settings });
  },
  setAccent: (accent) => {
    const settings = { ...get().settings, accent };
    persist(settings);
    set({ settings });
  },
  setColorMode: (colorMode) => {
    const settings = { ...get().settings, colorMode };
    applyColorMode(colorMode);
    persist(settings);
    set({ settings });
  },
  setDailyNewLimit: (dailyNewLimit) => {
    const settings = { ...get().settings, dailyNewLimit };
    persist(settings);
    set({ settings });
  },
  setSyncStatus: (status, error = null) => set({ syncStatus: status, syncError: error }),
  setLastSyncedAt: (ts) => set({ lastSyncedAt: ts }),
}));
