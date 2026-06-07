import type { ContentRecord, ImportFile, ImportResult, StudyItem } from "../types";

const VALID_TYPES = new Set<StudyItem["type"]>(["word", "phrase", "grammar", "conversation"]);

function validateItem(item: unknown, index: number): { ok: true; item: StudyItem } | { ok: false; error: string } {
  if (!item || typeof item !== "object") {
    return { ok: false, error: `項目${index + 1}: オブジェクトではありません` };
  }
  const raw = item as Partial<StudyItem>;
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
  return { ok: true, item: raw as StudyItem };
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
