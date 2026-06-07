import { create } from "zustand";
import type { Accent, AppSettings, SyncStatus } from "../types";

const SETTINGS_KEY = "settings";

const defaultSettings: AppSettings = {
  workerUrl: "",
  syncToken: "",
  accent: "en-GB",
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
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
    const settings = { ...get().settings, workerUrl: url };
    persist(settings);
    set({ settings });
  },
  setSyncToken: (token) => {
    const settings = { ...get().settings, syncToken: token };
    persist(settings);
    set({ settings });
  },
  setAccent: (accent) => {
    const settings = { ...get().settings, accent };
    persist(settings);
    set({ settings });
  },
  setSyncStatus: (status, error = null) => set({ syncStatus: status, syncError: error }),
  setLastSyncedAt: (ts) => set({ lastSyncedAt: ts }),
}));
