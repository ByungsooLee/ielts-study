import { create } from "zustand";
import type { Accent, AppSettings, ColorMode, DailyNewLimit, SyncStatus } from "../types";
import { SM2 } from "../lib/sm2";
import { resolveSyncToken, resolveWorkerUrl } from "../lib/workerConfig";
import { STORAGE_KEYS, readJson, writeJson } from "../lib/storage";

/** localStorage に保存する項目（Worker URL・合言葉は別管理） */
interface StoredSettings {
  accent?: Accent;
  colorMode?: ColorMode;
  dailyNewLimit?: DailyNewLimit;
}

function buildSettings(stored: StoredSettings = {}): AppSettings {
  return {
    workerUrl: resolveWorkerUrl(),
    syncToken: resolveSyncToken(),
    accent: stored.accent ?? "en-GB",
    colorMode: stored.colorMode ?? "system",
    dailyNewLimit: normalizeDailyNewLimit(stored.dailyNewLimit),
  };
}

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

function loadStoredSettings(): StoredSettings {
  const parsed = readJson<StoredSettings & { syncToken?: string; workerUrl?: string }>(
    STORAGE_KEYS.settings,
    {},
  );
  return {
    accent: parsed.accent,
    colorMode: parsed.colorMode,
    dailyNewLimit: parsed.dailyNewLimit,
  };
}

function loadSettings(): AppSettings {
  const settings = buildSettings(loadStoredSettings());
  applyColorMode(settings.colorMode);
  return settings;
}

interface SettingsState {
  settings: AppSettings;
  syncStatus: SyncStatus;
  lastSyncedAt: number | null;
  syncError: string | null;
  refreshConnection: () => void;
  setAccent: (accent: Accent) => void;
  setColorMode: (mode: ColorMode) => void;
  setDailyNewLimit: (limit: DailyNewLimit) => void;
  setSyncStatus: (status: SyncStatus, error?: string | null) => void;
  setLastSyncedAt: (ts: number) => void;
}

function persist(settings: AppSettings) {
  const stored: StoredSettings = {
    accent: settings.accent,
    colorMode: settings.colorMode,
    dailyNewLimit: settings.dailyNewLimit,
  };
  writeJson(STORAGE_KEYS.settings, stored);
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: loadSettings(),
  syncStatus: "idle",
  lastSyncedAt: null,
  syncError: null,
  refreshConnection: () => {
    set({ settings: buildSettings(loadStoredSettings()) });
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
