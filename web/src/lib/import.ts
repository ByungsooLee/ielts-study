import type { ContentRecord, Example, ImportFile, ImportResult, StudyItem } from "../types";

const VALID_TYPES = new Set<StudyItem["type"]>(["word", "phrase", "grammar", "conversation"]);

type RawStudyItem = Partial<StudyItem> & {
  pronNote?: string;
  examples?: unknown[];
};

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  return items.length > 0 ? items : undefined;
}

function normalizeExample(raw: unknown, itemId: string, index: number): Example | { error: string } {
  if (!raw || typeof raw !== "object") {
    return { error: `${itemId}: examples[${index}] がオブジェクトではありません` };
  }
  const ex = raw as Partial<Example>;
  if (!ex.en || typeof ex.en !== "string") {
    return { error: `${itemId}: examples[${index}].en が必要です` };
  }
  return {
    en: ex.en,
    jp: typeof ex.jp === "string" ? ex.jp : undefined,
    linking: typeof ex.linking === "string" ? ex.linking : undefined,
    tips: asStringArray(ex.tips),
    stressWords: asStringArray(ex.stressWords),
  };
}

export function normalizeItem(raw: RawStudyItem): StudyItem {
  const pron = raw.pron ? { ...raw.pron } : {};
  if (!pron.notes && raw.pronNote) {
    pron.notes = raw.pronNote;
  }

  const examples: Example[] = [];
  if (Array.isArray(raw.examples)) {
    raw.examples.forEach((ex, index) => {
      const normalized = normalizeExample(ex, raw.id ?? "?", index);
      if ("error" in normalized) return;
      examples.push(normalized);
    });
  }

  return {
    id: raw.id!,
    type: raw.type!,
    front: raw.front!,
    meaning: raw.meaning!,
    ipa: typeof raw.ipa === "string" ? raw.ipa : undefined,
    synonyms: asStringArray(raw.synonyms),
    collocation: typeof raw.collocation === "string" ? raw.collocation : undefined,
    examples: examples.length > 0 ? examples : undefined,
    pron: Object.keys(pron).length > 0 ? pron : undefined,
    tags: asStringArray(raw.tags),
    priority: raw.priority === "S" || raw.priority === "A" || raw.priority === "B" ? raw.priority : undefined,
    links: asStringArray(raw.links),
    note: typeof raw.note === "string" ? raw.note : undefined,
  };
}

function validateItem(item: unknown, index: number): { ok: true; item: StudyItem } | { ok: false; error: string } {
  if (!item || typeof item !== "object") {
    return { ok: false, error: `項目${index + 1}: オブジェクトではありません` };
  }
  const raw = item as RawStudyItem;
  if (!raw.id || typeof raw.id !== "string") {
    return { ok: false, error: `項目${index + 1}: id が必要です` };
  }
  if (!raw.type || !VALID_TYPES.has(raw.type)) {
    return { ok: false, error: `${raw.id}: type が不正です` };
  }
  if (!raw.front || typeof raw.front !== "string") {
    return { ok: false, error: `${raw.id}: front が必要です` };
  }
  if (!raw.meaning || typeof raw.meaning !== "string") {
    return { ok: false, error: `${raw.id}: meaning が必要です` };
  }

  return { ok: true, item: normalizeItem(raw) };
}

export function parseImportJson(text: string): ImportFile {
  const parsed = JSON.parse(text) as Partial<ImportFile>;
  if (!parsed || !Array.isArray(parsed.items)) {
    throw new Error("JSON形式が不正です。items 配列が必要です。");
  }
  if (!parsed.source?.added) {
    throw new Error("source.added (YYYY-MM-DD) が必要です。");
  }
  return {
    source: {
      book: parsed.source.book,
      section: parsed.source.section,
      added: parsed.source.added,
    },
    items: parsed.items,
  };
}

export function buildContentRecords(
  file: ImportFile,
  existingIds: Set<string>,
): { records: ContentRecord[]; result: ImportResult } {
  const now = Date.now();
  const records: ContentRecord[] = [];
  const result: ImportResult = { added: 0, updated: 0, skipped: 0, errors: [] };

  file.items.forEach((item, index) => {
    const validated = validateItem(item, index);
    if (!validated.ok) {
      result.skipped += 1;
      result.errors.push(validated.error);
      return;
    }
    if (existingIds.has(validated.item.id)) result.updated += 1;
    else result.added += 1;
    records.push({
      id: validated.item.id,
      item: validated.item,
      source: file.source,
      importedAt: now,
    });
  });

  return { records, result };
}
