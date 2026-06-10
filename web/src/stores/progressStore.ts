import { create } from "zustand";
import type { Grade, ProgressData, Sched, UserSentence } from "../types";
import { applyGrade, getOrCreateSched, todayDay } from "../lib/srs";
import { markDailyNewIntroduced } from "../lib/dailyQueue";
import { normalizeProgress } from "../lib/progress";
import { loadLocalProgress, saveLocalProgress, scheduleSyncPut } from "../lib/sync";
import { getDeviceId } from "../lib/device";
import { DEFAULT_USER_ID } from "../lib/progressConstants";
import { useSettingsStore } from "./settingsStore";

/** 変更された Sched に item 単位の更新メタ（updatedAt/sourceDeviceId）を刻む。 */
function stampSched(sched: Sched, now = Date.now()): Sched {
  return { ...sched, updatedAt: now, sourceDeviceId: getDeviceId() };
}

/** 進捗 envelope に所有ユーザー・端末 ID を補完。 */
function withEnvelope(progress: ProgressData): ProgressData {
  return {
    ...progress,
    userId: progress.userId ?? DEFAULT_USER_ID,
    deviceId: getDeviceId(),
  };
}

function persistProgress(next: ProgressData, set: (partial: { progress: ProgressData }) => void) {
  const stamped = withEnvelope(next);
  saveLocalProgress(stamped);
  set({ progress: stamped });
  const { settings, setSyncStatus, setLastSyncedAt } = useSettingsStore.getState();
  scheduleSyncPut(settings.workerUrl, settings.syncToken, stamped, (status) => {
    setSyncStatus(status, status === "error" ? "同期に失敗しました" : null);
    if (status === "ok") setLastSyncedAt(Date.now());
  });
}

interface ProgressState {
  progress: ProgressData;
  hydrated: boolean;
  hydrate: (data?: ProgressData) => void;
  gradeItem: (itemId: string, grade: Grade) => void;
  toggleHard: (itemId: string) => void;
  unsuspendItem: (itemId: string) => void;
  introduceDailyNew: (count: number) => void;
  addUserSentence: (itemId: string, sentence: UserSentence) => void;
  recordStudyDay: () => void;
  updateProgress: (next: ProgressData) => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: loadLocalProgress(),
  hydrated: false,
  hydrate: (data) => {
    const progress = normalizeProgress(data ?? loadLocalProgress());
    saveLocalProgress(progress);
    set({ progress, hydrated: true });
  },
  gradeItem: (itemId, grade) => {
    const { progress } = get();
    const today = todayDay();
    const current = getOrCreateSched(progress, itemId, today);
    const nextRecord = stampSched(applyGrade(current, grade, today));
    const next: ProgressData = {
      ...progress,
      srs: { ...progress.srs, [itemId]: nextRecord },
      updatedAt: Date.now(),
    };
    persistProgress(next, set);
  },
  toggleHard: (itemId) => {
    const { progress } = get();
    const next: ProgressData = {
      ...progress,
      hard: { ...progress.hard, [itemId]: !progress.hard[itemId] },
      updatedAt: Date.now(),
    };
    persistProgress(next, set);
  },
  unsuspendItem: (itemId) => {
    const { progress } = get();
    const sched = progress.srs[itemId];
    if (!sched || sched.status !== "suspended") return;
    const today = todayDay();
    const nextRecord: Sched = stampSched({
      ...sched,
      status: "learning",
      due: today,
      reps: 0,
      interval: 0,
      last: Date.now(),
    });
    const next: ProgressData = {
      ...progress,
      srs: { ...progress.srs, [itemId]: nextRecord },
      updatedAt: Date.now(),
    };
    persistProgress(next, set);
  },
  introduceDailyNew: (count) => {
    if (count <= 0) return;
    const { progress } = get();
    const next = markDailyNewIntroduced(progress, count);
    if (next.dailyMeta?.newIntroduced === progress.dailyMeta?.newIntroduced) return;
    persistProgress(next, set);
  },
  addUserSentence: (itemId, sentence) => {
    const { progress } = get();
    const sentences = progress.userSentences ?? {};
    const list = sentences[itemId] ?? [];
    const next: ProgressData = {
      ...progress,
      userSentences: {
        ...sentences,
        [itemId]: [sentence, ...list],
      },
      updatedAt: Date.now(),
    };
    persistProgress(next, set);
  },
  recordStudyDay: () => {
    const { progress } = get();
    const today = todayDay();
    const prev = progress.streak ?? { count: 0, lastDay: 0 };
    if (prev.lastDay === today) return;
    const count = prev.lastDay === today - 1 ? prev.count + 1 : 1;
    const longest = Math.max(prev.longest ?? prev.count ?? 0, count);
    const next: ProgressData = {
      ...progress,
      streak: { count, lastDay: today, longest, lastStudiedDate: new Date().toISOString().slice(0, 10) },
      updatedAt: Date.now(),
    };
    persistProgress(next, set);
  },
  updateProgress: (next) => {
    saveLocalProgress(next);
    set({ progress: next });
  },
}));
