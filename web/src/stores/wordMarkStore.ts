/**
 * 単語の「マーク」状態（青/黄/オレンジ）を localStorage に永続化。
 * - 青 = 未マーク（エントリなし）
 * - 黄 = 要復習（"yellow"）
 * - オレンジ = 強めに要復習（"orange"）
 * SM-2 の SRS とは独立の軽量マーカー。マーク復習タブで一覧・下げ操作ができる。
 */
import { create } from "zustand";
import { STORAGE_KEYS, readJson, writeJson } from "../lib/storage";

export type WordMark = "blue" | "yellow" | "orange";

const CYCLE_NEXT: Record<WordMark, WordMark> = {
  blue: "yellow",
  yellow: "orange",
  orange: "blue",
};

const CYCLE_PREV: Record<WordMark, WordMark> = {
  blue: "orange",
  yellow: "blue",
  orange: "yellow",
};

type StoredMarks = Record<string, "yellow" | "orange">;

function loadMarks(): StoredMarks {
  return readJson<StoredMarks>(STORAGE_KEYS.wordMarks, {});
}

function persist(marks: StoredMarks) {
  writeJson(STORAGE_KEYS.wordMarks, marks);
}

interface WordMarkState {
  marks: StoredMarks;
  /** 指定 item.id の現在のマーク色。 */
  getMark: (itemId: string) => WordMark;
  /** タップで次の色に循環（青→黄→オレンジ→青）。 */
  cycleMark: (itemId: string) => WordMark;
  /** 逆循環（オレンジ→黄→青→オレンジ）。長押し等で呼ぶ想定。 */
  cyclePrev: (itemId: string) => WordMark;
  /** 明示的に色を設定。 */
  setMark: (itemId: string, mark: WordMark) => void;
  /** マーク解除（青に戻す）。 */
  clearMark: (itemId: string) => void;
  /** マーク済みの item.id 一覧を色でフィルタして返す。 */
  markedIds: (colors?: WordMark[]) => string[];
}

export const useWordMarkStore = create<WordMarkState>((set, get) => ({
  marks: loadMarks(),
  getMark: (itemId) => {
    const stored = get().marks[itemId];
    return stored ?? "blue";
  },
  cycleMark: (itemId) => {
    const current: WordMark = get().marks[itemId] ?? "blue";
    const next = CYCLE_NEXT[current];
    const nextMarks = { ...get().marks };
    if (next === "blue") delete nextMarks[itemId];
    else nextMarks[itemId] = next;
    persist(nextMarks);
    set({ marks: nextMarks });
    return next;
  },
  cyclePrev: (itemId) => {
    const current: WordMark = get().marks[itemId] ?? "blue";
    const prev = CYCLE_PREV[current];
    const nextMarks = { ...get().marks };
    if (prev === "blue") delete nextMarks[itemId];
    else nextMarks[itemId] = prev;
    persist(nextMarks);
    set({ marks: nextMarks });
    return prev;
  },
  setMark: (itemId, mark) => {
    const nextMarks = { ...get().marks };
    if (mark === "blue") delete nextMarks[itemId];
    else nextMarks[itemId] = mark;
    persist(nextMarks);
    set({ marks: nextMarks });
  },
  clearMark: (itemId) => {
    if (!(itemId in get().marks)) return;
    const nextMarks = { ...get().marks };
    delete nextMarks[itemId];
    persist(nextMarks);
    set({ marks: nextMarks });
  },
  markedIds: (colors) => {
    const filter = colors ?? ["yellow", "orange"];
    const wantYellow = filter.includes("yellow");
    const wantOrange = filter.includes("orange");
    return Object.entries(get().marks)
      .filter(([, v]) => (v === "yellow" && wantYellow) || (v === "orange" && wantOrange))
      .map(([id]) => id);
  },
}));
