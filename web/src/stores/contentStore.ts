import { create } from "zustand";
import { getAllContent, upsertContent } from "../db";
import { scheduleContentSyncPut } from "../lib/contentSync";
import { buildContentRecords, parseImportJson } from "../lib/import";
import { useSettingsStore } from "./settingsStore";
import type { ContentRecord, ImportResult, ItemType } from "../types";

export interface ContentFilters {
  query: string;
  type: ItemType | "all";
  book: string;
  section: string;
  tag: string;
  priority: "all" | "S" | "A" | "B";
  hardOnly: boolean;
  suspendedOnly: boolean;
}

const defaultFilters: ContentFilters = {
  query: "",
  type: "all",
  book: "",
  section: "",
  tag: "",
  priority: "all",
  hardOnly: false,
  suspendedOnly: false,
};

interface ContentState {
  items: ContentRecord[];
  loading: boolean;
  filters: ContentFilters;
  lastImportResult: ImportResult | null;
  load: () => Promise<void>;
  importJsonText: (text: string) => Promise<ImportResult>;
  setFilters: (patch: Partial<ContentFilters>) => void;
  getById: (id: string) => ContentRecord | undefined;
}

function pushContentToCloud(records: ContentRecord[]) {
  const { settings, setSyncStatus } = useSettingsStore.getState();
  scheduleContentSyncPut(settings.workerUrl, settings.syncToken, records, (status) => {
    if (status === "error") setSyncStatus("error", "教材の同期に失敗しました");
  });
}

export const useContentStore = create<ContentState>((set, get) => ({
  items: [],
  loading: false,
  filters: defaultFilters,
  lastImportResult: null,
  load: async () => {
    set({ loading: true });
    const items = await getAllContent();
    set({ items, loading: false });
  },
  importJsonText: async (text) => {
    const file = parseImportJson(text);
    const existingIds = new Set(get().items.map((i) => i.id));
    const { records, result } = buildContentRecords(file, existingIds);
    await upsertContent(records);
    const allRecords = await getAllContent();
    await get().load();
    set({ lastImportResult: result });
    pushContentToCloud(allRecords);
    return result;
  },
  setFilters: (patch) => set({ filters: { ...get().filters, ...patch } }),
  getById: (id) => get().items.find((i) => i.id === id),
}));
