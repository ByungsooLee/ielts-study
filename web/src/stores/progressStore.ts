import { create } from "zustand";
import type { Grade, ProgressData, UserSentence } from "../types";
import { applyGrade, getOrCreateSrs } from "../lib/srs";
import { loadLocalProgress, saveLocalProgress, scheduleSyncPut } from "../lib/sync";
import { useSettingsStore } from "./settingsStore";

interface ProgressState {
  progress: ProgressData;
  hydrated: boolean;
  hydrate: (data?: ProgressData) => void;
  gradeItem: (itemId: string, grade: Grade) => void;
  toggleHard: (itemId: string) => void;
  addUserSentence: (itemId: string, sentence: UserSentence) => void;
  updateProgress: (next: ProgressData) => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: loadLocalProgress(),
  hydrated: false,
  hydrate: (data) => {
    const progress = data ?? loadLocalProgress();
    saveLocalProgress(progress);
    set({ progress, hydrated: true });
  },
  gradeItem: (itemId, grade) => {
    const { progress } = get();
    const current = getOrCreateSrs(progress, itemId);
    const nextRecord = applyGrade(current, grade);
    const next: ProgressData = {
      ...progress,
      srs: { ...progress.srs, [itemId]: nextRecord },
      updatedAt: Date.now(),
    };
    saveLocalProgress(next);
    set({ progress: next });
    const { settings, setSyncStatus, setLastSyncedAt } = useSettingsStore.getState();
    scheduleSyncPut(settings.workerUrl, settings.syncToken, next, (status) => {
      setSyncStatus(status, status === "error" ? "同期に失敗しました" : null);
      if (status === "ok") setLastSyncedAt(Date.now());
    });
  },
  toggleHard: (itemId) => {
    const { progress } = get();
    const next: ProgressData = {
      ...progress,
      hard: { ...progress.hard, [itemId]: !progress.hard[itemId] },
      updatedAt: Date.now(),
    };
    saveLocalProgress(next);
    set({ progress: next });
    const { settings, setSyncStatus, setLastSyncedAt } = useSettingsStore.getState();
    scheduleSyncPut(settings.workerUrl, settings.syncToken, next, (status) => {
      setSyncStatus(status, status === "error" ? "同期に失敗しました" : null);
      if (status === "ok") setLastSyncedAt(Date.now());
    });
  },
  addUserSentence: (itemId, sentence) => {
    const { progress } = get();
    const list = progress.userSentences[itemId] ?? [];
    const next: ProgressData = {
      ...progress,
      userSentences: {
        ...progress.userSentences,
        [itemId]: [sentence, ...list],
      },
      updatedAt: Date.now(),
    };
    saveLocalProgress(next);
    set({ progress: next });
    const { settings, setSyncStatus, setLastSyncedAt } = useSettingsStore.getState();
    scheduleSyncPut(settings.workerUrl, settings.syncToken, next, (status) => {
      setSyncStatus(status, status === "error" ? "同期に失敗しました" : null);
      if (status === "ok") setLastSyncedAt(Date.now());
    });
  },
  updateProgress: (next) => {
    saveLocalProgress(next);
    set({ progress: next });
  },
}));
