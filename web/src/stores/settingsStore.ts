import { create } from "zustand";
import type { Accent, AppSettings, ColorMode, DailyNewLimit, SyncStatus } from "../types";
import { SM2 } from "../lib/sm2";
import { resolveSyncToken, resolveWorkerUrl } from "../lib/workerConfig";

const SETTINGS_KEY = "settings";

/** localStorage に保存する項目（Worker URL は毎回自動決定） */
interface StoredSettings {
  syncToken?: string;
  accent?: Accent;
  colorMode?: ColorMode;
  dailyNewLimit?: DailyNewLimit;
}

const defaultSettings: AppSettings = {
  workerUrl: resolveWorkerUrl(),
  syncToken: resolveSyncToken(),
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
  const workerUrl = resolveWorkerUrl();
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      applyColorMode(defaultSettings.colorMode);
      return { ...defaultSettings, workerUrl };
    }
    const parsed = JSON.parse(raw) as StoredSettings;
    const settings: AppSettings = {
      ...defaultSettings,
      workerUrl,
      syncToken: (parsed.syncToken || resolveSyncToken()).trim(),
      accent: parsed.accent ?? defaultSettings.accent,
      colorMode: parsed.colorMode ?? defaultSettings.colorMode,
      dailyNewLimit: normalizeDailyNewLimit(parsed.dailyNewLimit),
    };
    applyColorMode(settings.colorMode);
    return settings;
  } catch {
    applyColorMode(defaultSettings.colorMode);
    return { ...defaultSettings, workerUrl };
  }
}

interface SettingsState {
  settings: AppSettings;
  syncStatus: SyncStatus;
  lastSyncedAt: number | null;
  syncError: string | null;
  setSyncToken: (token: string) => void;
  refreshWorkerUrl: () => void;
  setAccent: (accent: Accent) => void;
  setColorMode: (mode: ColorMode) => void;
  setDailyNewLimit: (limit: DailyNewLimit) => void;
  setSyncStatus: (status: SyncStatus, error?: string | null) => void;
  setLastSyncedAt: (ts: number) => void;
}

function persist(settings: AppSettings) {
  const stored: StoredSettings = {
    syncToken: settings.syncToken,
    accent: settings.accent,
    colorMode: settings.colorMode,
    dailyNewLimit: settings.dailyNewLimit,
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(stored));
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: loadSettings(),
  syncStatus: "idle",
  lastSyncedAt: null,
  syncError: null,
  refreshWorkerUrl: () => {
    set({ settings: { ...get().settings, workerUrl: resolveWorkerUrl() } });
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
