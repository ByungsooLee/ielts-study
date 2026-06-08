import type { ContentRecord, GrammarCloze } from "../types";

export function normalizeClozeAnswer(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

export function parseAcceptedAnswers(answer: string): string[] {
  const trimmed = answer.trim();
  if (trimmed === "(なし)" || trimmed === "なし") return [""];
  return trimmed
    .split("/")
    .map((part) => normalizeClozeAnswer(part))
    .filter((part, idx, arr) => arr.indexOf(part) === idx);
}

export function matchClozeAnswer(input: string, answer: string): boolean {
  const normalized = normalizeClozeAnswer(input);
  const accepted = parseAcceptedAnswers(answer);
  return accepted.some((a) => a === normalized);
}

export interface FlatClozeItem {
  record: ContentRecord;
  cloze: GrammarCloze;
  clozeIndex: number;
}

export function flattenGenreCloze(records: ContentRecord[]): FlatClozeItem[] {
  const result: FlatClozeItem[] = [];
  for (const record of records) {
    const item = record.item;
    if (!item.cloze?.length) continue;
    item.cloze.forEach((cloze, clozeIndex) => {
      result.push({ record, cloze, clozeIndex });
    });
  }
  return result;
}

export function grammarRecordsFromItems(items: ContentRecord[]): ContentRecord[] {
  return items.filter((r) => r.item.collection === "grammar" && r.item.type === "grammar");
}

export function filterGrammarByGenre(
  records: ContentRecord[],
  genreFilter: number | "all",
): ContentRecord[] {
  if (genreFilter === "all") return records;
  return records.filter((r) => r.item.theme === genreFilter);
}

export function buildGrammarCardDeck(
  records: ContentRecord[],
  genreFilter: number | "all",
): ContentRecord[] {
  const filtered = filterGrammarByGenre(records, genreFilter);
  return [...filtered].sort((a, b) => (a.item.n ?? 999999) - (b.item.n ?? 999999));
}
