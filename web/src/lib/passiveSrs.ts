/**
 * Passive語（認識用）の軽めSRS。
 * - メインの Active SRS (ielts_vocab_srs_v2 / progress) とは完全に独立。
 * - 採点は「覚えてた / あやしい」の2択のみ。
 * - INTERVALS_PASSIVE = [0, 3, 10, 30, 90] 日。
 */

const STORAGE_KEY = "ielts_passive_srs_v1";

export const INTERVALS_PASSIVE = [0, 3, 10, 30, 90] as const;
export const MAX_BOX = INTERVALS_PASSIVE.length - 1;

export interface PassiveSched {
  box: number;
  due: number;
  ts: number;
}

export type PassiveGrade = "remembered" | "fuzzy";

function dayMs(): number {
  return 24 * 60 * 60 * 1000;
}

function todayStart(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

type Store = Record<string, PassiveSched>;

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw) as unknown;
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
    return obj as Store;
  } catch {
    return {};
  }
}

function saveStore(store: Store): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ストレージが満杯/無効でも致命ではない */
  }
}

export function getAllPassiveSched(): Store {
  return loadStore();
}

export function getPassiveSched(id: string): PassiveSched | undefined {
  return loadStore()[id];
}

export function gradePassive(id: string, grade: PassiveGrade): PassiveSched {
  const store = loadStore();
  const prev = store[id];
  const prevBox = prev?.box ?? 0;
  const box = grade === "remembered" ? Math.min(MAX_BOX, prevBox + 1) : 0;
  const due = todayStart() + INTERVALS_PASSIVE[box] * dayMs();
  const next: PassiveSched = { box, due, ts: Date.now() };
  store[id] = next;
  saveStore(store);
  return next;
}

export function isDuePassive(sched: PassiveSched | undefined, now: number = Date.now()): boolean {
  if (!sched) return true;
  return sched.due <= now;
}

/** 今日の確認対象（due ≤ 今日）を id 集合で返す。 */
export function dueIdsPassive(ids: string[], now: number = Date.now()): Set<string> {
  const store = loadStore();
  const due = new Set<string>();
  for (const id of ids) {
    if (isDuePassive(store[id], now)) due.add(id);
  }
  return due;
}
