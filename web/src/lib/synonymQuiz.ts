import { makeClozeSentence } from "./cloze";
import { filterRecords, type DeckFilters } from "./studyDeck";
import { getOrCreateSched, isHard } from "./srs";
import type {
  ContentRecord,
  DailyNewLimit,
  ProgressData,
  Sched,
  StudyItem,
  SynonymFormatPrefs,
  SynonymQuestion,
  SynonymQuizFormat,
} from "../types";

export const CLUSTER_MIN_GAP = 3;

export function normalizeWord(word: string): string {
  return word.trim().toLowerCase();
}

export function getCluster(item: StudyItem): string[] {
  const words = [item.front, ...(item.synonyms ?? [])];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const w of words) {
    const n = normalizeWord(w);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    result.push(w);
  }
  return result;
}

export function getForbiddenSet(item: StudyItem): Set<string> {
  return new Set(getCluster(item).map(normalizeWord));
}

/** @deprecated 学習済みゲート（旧仕様）。テスト互換のため残す */
export function isSynonymEligible(item: StudyItem, sched: Sched | undefined): boolean {
  if (!item.synonyms?.length) return false;
  if (!sched || sched.status === "suspended") return false;
  return sched.reps >= 1;
}

/** 類義語クイズの出題候補（単語・synonyms あり・停止中でない） */
export function isSynonymCandidate(item: StudyItem, sched: Sched | undefined): boolean {
  if (item.type !== "word") return false;
  if (!item.synonyms?.length) return false;
  if (sched?.status === "suspended") return false;
  return true;
}

export function canDoOddOneOut(item: StudyItem): boolean {
  return (item.synonyms?.length ?? 0) >= 2;
}

export function findExampleWithTarget(item: StudyItem): { en: string; cloze: string } | null {
  for (const ex of item.examples ?? []) {
    const en = ex.en?.trim();
    if (!en) continue;
    const cloze = makeClozeSentence(en, item.front);
    if (cloze !== en && cloze.includes("______")) {
      return { en, cloze };
    }
  }
  return null;
}

export function canDoParaphrase(item: StudyItem): boolean {
  return findExampleWithTarget(item) !== null;
}

function shuffle<T>(arr: T[]): T[] {
  const list = [...arr];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function pickOne<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count);
}

function itemSharesCluster(item: StudyItem, forbidden: Set<string>): boolean {
  if (forbidden.has(normalizeWord(item.front))) return true;
  return (item.synonyms ?? []).some((s) => forbidden.has(normalizeWord(s)));
}

export function buildDistractorPool(
  allItems: StudyItem[],
  target: StudyItem,
  preferSameType = true,
): string[] {
  const forbidden = getForbiddenSet(target);
  const sameType: string[] = [];
  const otherType: string[] = [];

  for (const item of allItems) {
    if (item.id === target.id) continue;
    if (itemSharesCluster(item, forbidden)) continue;

    const front = item.front.trim();
    if (!front || forbidden.has(normalizeWord(front))) continue;

    if (preferSameType && item.type === target.type) {
      sameType.push(front);
    } else {
      otherType.push(front);
    }
  }

  const pool = sameType.length >= 3 ? sameType : [...sameType, ...otherType];
  return [...new Set(pool.map((w) => w.trim()).filter(Boolean))];
}

function pickDistractors(pool: string[], count: number, exclude: Set<string>): string[] {
  const available = pool.filter((w) => !exclude.has(normalizeWord(w)));
  return pickMany(available, count);
}

function buildMcqOptions(correct: string, distractors: string[]): { options: string[]; correctIndex: number } {
  const options = shuffle([correct, ...distractors]);
  const correctIndex = options.findIndex((o) => normalizeWord(o) === normalizeWord(correct));
  return { options, correctIndex };
}

export function getAvailableFormats(
  item: StudyItem,
  prefs: SynonymFormatPrefs,
): SynonymQuizFormat[] {
  const formats: SynonymQuizFormat[] = [];
  if (prefs.mcq && item.synonyms?.length) formats.push("mcq");
  if (prefs.paraphrase && canDoParaphrase(item)) formats.push("paraphrase");
  if (prefs.oddOneOut && canDoOddOneOut(item)) formats.push("oddOneOut");
  if (prefs.production && item.synonyms?.length) formats.push("production");
  return formats;
}

export function generateQuestion(
  record: ContentRecord,
  format: SynonymQuizFormat,
  allItems: StudyItem[],
): SynonymQuestion | null {
  const { item } = record;
  const synonyms = item.synonyms ?? [];
  if (!synonyms.length) return null;

  const cluster = getCluster(item);
  const correctAnswers = cluster;
  const pool = buildDistractorPool(allItems, item);

  if (format === "mcq") {
    const correct = pickOne(synonyms);
    if (!correct) return null;
    const distractors = pickDistractors(pool, 3, new Set([normalizeWord(correct)]));
    if (distractors.length < 3) return null;
    const { options, correctIndex } = buildMcqOptions(correct, distractors);
    return {
      format,
      itemId: item.id,
      record,
      prompt: `「${item.front}」（${item.meaning}）と同じ意味はどれ？`,
      options,
      correctIndex,
      correctAnswers,
    };
  }

  if (format === "paraphrase") {
    const example = findExampleWithTarget(item);
    if (!example) return null;
    const correct = pickOne(synonyms);
    if (!correct) return null;
    const distractors = pickDistractors(pool, 3, new Set([normalizeWord(correct)]));
    if (distractors.length < 3) return null;
    const { options, correctIndex } = buildMcqOptions(correct, distractors);
    return {
      format,
      itemId: item.id,
      record,
      prompt: "下線の語と置き換えても意味が通るのはどれ？",
      options,
      correctIndex,
      correctAnswers,
      clozeSentence: example.cloze,
      exampleEn: example.en,
    };
  }

  if (format === "oddOneOut") {
    if (!canDoOddOneOut(item)) return null;
    const clusterWords = getCluster(item);
    if (clusterWords.length < 3) return null;
    const inGroup = pickMany(clusterWords, 3);
    const distractors = pickDistractors(pool, 1, new Set(inGroup.map(normalizeWord)));
    if (!distractors.length) return null;
    const oddOne = distractors[0];
    const { options, correctIndex } = buildMcqOptions(oddOne, inGroup);
    return {
      format,
      itemId: item.id,
      record,
      prompt: "仲間外れはどれ？（3語が同じ意味のグループです）",
      options,
      correctIndex,
      correctAnswers: [oddOne],
    };
  }

  if (format === "production") {
    const example = findExampleWithTarget(item);
    const hintWord = pickOne(synonyms) ?? item.front;
    const hintLetter = hintWord.charAt(0).toUpperCase();
    let prompt = `「${item.meaning}」の言い換えを1語で入力`;
    if (example) {
      prompt += `\n（文脈: ${example.cloze}）`;
    }
    return {
      format,
      itemId: item.id,
      record,
      prompt,
      correctAnswers,
      clozeSentence: example?.cloze,
      exampleEn: example?.en,
      hintLetter,
    };
  }

  return null;
}

export function generateQuestionForRecord(
  record: ContentRecord,
  prefs: SynonymFormatPrefs,
  allItems: StudyItem[],
): SynonymQuestion | null {
  const formats = shuffle(getAvailableFormats(record.item, prefs));
  for (const format of formats) {
    const q = generateQuestion(record, format, allItems);
    if (q) return q;
  }
  return null;
}

function priorityScore(record: ContentRecord, progress: ProgressData): number {
  const sched = progress.srs[record.item.id];
  const hard = isHard(record.item.id, progress) ? 1000 : 0;
  const lapses = (sched?.lapses ?? 0) * 10;
  return hard + lapses + Math.random();
}

export function applySessionNewLimit(
  records: ContentRecord[],
  progress: ProgressData,
  limit: DailyNewLimit,
): ContentRecord[] {
  const fresh: ContentRecord[] = [];
  const review: ContentRecord[] = [];

  for (const record of records) {
    const sched = progress.srs[record.item.id];
    if (sched?.reps === 1) fresh.push(record);
    else review.push(record);
  }

  const limitedFresh = shuffle(fresh).slice(0, limit);
  return [...review, ...limitedFresh];
}

function lastClusterPosition(result: ContentRecord[], id: string): number {
  for (let i = result.length - 1; i >= 0; i--) {
    if (result[i].item.id === id) return i;
  }
  return -1;
}

export function spaceClusters(records: ContentRecord[], minGap = CLUSTER_MIN_GAP): ContentRecord[] {
  if (records.length <= 1) return records;

  const remaining = [...records];
  const result: ContentRecord[] = [];

  while (remaining.length > 0) {
    let pickedIdx = -1;
    for (let i = 0; i < remaining.length; i++) {
      const id = remaining[i].item.id;
      const lastPos = lastClusterPosition(result, id);
      if (lastPos === -1 || result.length - lastPos > minGap) {
        pickedIdx = i;
        break;
      }
    }
    if (pickedIdx === -1) pickedIdx = 0;
    const [picked] = remaining.splice(pickedIdx, 1);
    result.push(picked);
  }

  return result;
}

export function prioritizeRecords(
  records: ContentRecord[],
  progress: ProgressData,
): ContentRecord[] {
  return [...records].sort((a, b) => priorityScore(b, progress) - priorityScore(a, progress));
}

export interface SynonymPoolFilters {
  themeFilter: DeckFilters["themeFilter"];
  themeRange: DeckFilters["themeRange"];
  hardOnly: boolean;
  sort: DeckFilters["sort"];
}

function sortPoolRecords(records: ContentRecord[], sort: DeckFilters["sort"]): ContentRecord[] {
  if (sort === "asc") {
    return [...records].sort((a, b) => {
      const ta = a.item.theme ?? 999;
      const tb = b.item.theme ?? 999;
      if (ta !== tb) return ta - tb;
      return a.id.localeCompare(b.id);
    });
  }
  return shuffle(records);
}

/** テーマ範囲内の全単語（synonyms 付き）プール。エンドレス出題用 */
export function buildSynonymPool(
  records: ContentRecord[],
  progress: ProgressData,
  filters: SynonymPoolFilters,
): ContentRecord[] {
  const deckFilters: DeckFilters = {
    category: "word",
    themeFilter: filters.themeFilter,
    themeRange: filters.themeRange,
    dueOnly: false,
    hardOnly: filters.hardOnly,
    unlearnedOnly: false,
    setSize: 50,
    sort: filters.sort,
  };

  const filtered = filterRecords(records, progress, deckFilters).filter((record) => {
    const sched = progress.srs[record.item.id];
    return isSynonymCandidate(record.item, sched);
  });

  const sorted = sortPoolRecords(filtered, filters.sort);
  return spaceClusters(sorted, CLUSTER_MIN_GAP);
}

export function canGenerateMcq(record: ContentRecord, allWordItems: StudyItem[]): boolean {
  if (!record.item.synonyms?.length) return false;
  return buildDistractorPool(allWordItems, record.item).length >= 3;
}

export function getSynonymMcqQuestion(
  record: ContentRecord,
  allWordItems: StudyItem[],
): SynonymQuestion | null {
  return generateQuestion(record, "mcq", allWordItems);
}

export function filterGeneratablePool(
  pool: ContentRecord[],
  allWordItems: StudyItem[],
): ContentRecord[] {
  return pool.filter((r) => canGenerateMcq(r, allWordItems));
}

export function buildSynonymDeck(
  records: ContentRecord[],
  progress: ProgressData,
  filters: DeckFilters,
  sessionNewLimit: DailyNewLimit,
): ContentRecord[] {
  const filtered = filterRecords(records, progress, filters).filter((record) => {
    const sched = getOrCreateSched(progress, record.item.id);
    return isSynonymEligible(record.item, sched);
  });

  const prioritized = prioritizeRecords(filtered, progress);
  const withNewLimit = applySessionNewLimit(prioritized, progress, sessionNewLimit);
  const spaced = spaceClusters(withNewLimit, CLUSTER_MIN_GAP);
  return spaced.slice(0, filters.setSize);
}

export function buildSynonymQuestions(
  records: ContentRecord[],
  progress: ProgressData,
  filters: DeckFilters,
  formatPrefs: SynonymFormatPrefs,
  sessionNewLimit: DailyNewLimit,
): SynonymQuestion[] {
  const deck = buildSynonymDeck(records, progress, filters, sessionNewLimit);
  const allItems = records.map((r) => r.item);
  const questions: SynonymQuestion[] = [];

  for (const record of deck) {
    const q = generateQuestionForRecord(record, formatPrefs, allItems);
    if (q) questions.push(q);
  }

  return questions;
}

export function checkProductionAnswer(input: string, correctAnswers: string[]): boolean {
  const normalized = normalizeWord(input);
  if (!normalized) return false;
  return correctAnswers.some((a) => normalizeWord(a) === normalized);
}

export function isAnswerCorrect(question: SynonymQuestion, answer: string | number): boolean {
  if (question.format === "production") {
    return checkProductionAnswer(String(answer), question.correctAnswers);
  }
  const idx = typeof answer === "number" ? answer : parseInt(String(answer), 10);
  if (Number.isNaN(idx) || question.correctIndex == null) return false;
  return idx === question.correctIndex;
}

export function getDisplaySynonyms(item: StudyItem): string {
  return getCluster(item).join(", ");
}
