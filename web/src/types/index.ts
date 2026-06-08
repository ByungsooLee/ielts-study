export type Domain = "english" | "engineering";

export type ItemType = "word" | "phrase" | "grammar" | "conversation" | "concept";

export interface ConceptExplain {
  prompt_ja: string;
  model_en: string;
}

export interface Example {
  en: string;
  jp?: string;
  linking?: string;
  tips?: string[];
  stressWords?: string[];
}

export interface PassageTarget {
  id: string;
  text: string;
}

export interface PassageSentence {
  en: string;
  jp?: string;
  linking?: string;
  tips?: string[];
  targets?: PassageTarget[];
}

export interface Passage {
  id: string;
  theme: number;
  themeName: string;
  title?: string;
  jp?: string;
  sentences: PassageSentence[];
}

export interface StudyItem {
  id: string;
  n?: number;
  type: ItemType;
  front: string;
  ipa?: string;
  meaning: string;
  synonyms?: string[];
  collocation?: string;
  examples?: Example[];
  pron?: {
    lookup?: string;
    tts?: string;
    notes?: string;
    liaison?: string;
    tips?: string[];
    stressWords?: string[];
  };
  tags?: string[];
  domain?: Domain;
  collection?: string;
  theme?: number;
  themeName?: string;
  priority?: "S" | "A" | "B";
  links?: string[];
  note?: string;
  explain?: ConceptExplain;
}

export interface ImportSource {
  book?: string;
  section?: string;
  added: string;
}

export interface ImportFile {
  source: ImportSource;
  items: StudyItem[];
}

export interface ContentRecord {
  id: string;
  item: StudyItem;
  source: ImportSource;
  importedAt: number;
}

/** Worker KV に保存する教材バンドル */
export interface ContentData {
  records: ContentRecord[];
  updatedAt: number;
}

export type SchedStatus = "new" | "learning" | "review" | "suspended";

export interface Sched {
  ef: number;
  reps: number;
  interval: number;
  due: number;
  lapses: number;
  /** 「あいまい」ボタンを押した累計回数 */
  maybeCount: number;
  last: number;
  status: SchedStatus;
}

/** 移行用：旧 box 方式 */
export interface LegacySrsRecord {
  box: number;
  due: number;
  ts: number;
  lapses: number;
}

export interface DailyMeta {
  day: number;
  newIntroduced: number;
}

export interface UserSentence {
  id: string;
  text: string;
  usedGrammar?: string;
  createdAt: number;
}

export interface StreakData {
  count: number;
  lastDay: number;
}

export interface ProgressData {
  srs: Record<string, Sched>;
  hard: Record<string, boolean>;
  userSentences: Record<string, UserSentence[]>;
  streak?: StreakData;
  dailyMeta?: DailyMeta;
  schemaVersion?: number;
  updatedAt: number;
}

export interface Recording {
  id: string;
  itemId: string;
  blob: Blob;
  createdAt: number;
  durationMs: number;
}

export interface DictCacheEntry {
  word: string;
  ipa?: string;
  audioUrl?: string;
  blob?: Blob;
  cachedAt: number;
}

export interface AudioCacheEntry {
  key: string;
  blob: Blob;
  cachedAt: number;
}

export type Accent = "en-GB" | "en-US" | "en-AU";
export type PlaybackRate = 0.75 | 1 | 1.25 | 1.5;
export type ColorMode = "light" | "dark" | "system";
export type DailyNewLimit = 5 | 10 | 20 | 50 | 100;

export type StudyMode = "review" | "set";
export type StudyDirection = "en-to-jp" | "jp-to-en";
export type StudyContentMode = "semantic" | "cloze";
export type DeckSort = "random" | "asc";
export type SetSize = 10 | 30 | 50;

export interface AppSettings {
  workerUrl: string;
  syncToken: string;
  accent: Accent;
  colorMode: ColorMode;
  dailyNewLimit: DailyNewLimit;
}

export type SyncStatus = "idle" | "syncing" | "ok" | "error" | "offline";
export type Grade = "forgot" | "maybe" | "remembered";

export interface ImportResult {
  added: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export interface TtsUsageStatus {
  month: string;
  charsUsed: number;
  monthlyLimit: number;
  warningThreshold: number;
  warning: boolean;
  blocked: boolean;
  percentUsed: number;
}

export interface ThemeInfo {
  num: number;
  name: string;
}

export interface ThemeStat {
  num: number;
  name: string;
  count: number;
}

export interface ThemeRange {
  min: number;
  max: number;
  label: string;
  themes: ThemeInfo[];
}

export type SynonymQuizFormat = "mcq" | "paraphrase" | "oddOneOut" | "production";

export interface SynonymFormatPrefs {
  mcq: boolean;
  paraphrase: boolean;
  oddOneOut: boolean;
  production: boolean;
}

export interface SynonymQuestion {
  format: SynonymQuizFormat;
  itemId: string;
  record: ContentRecord;
  prompt: string;
  options?: string[];
  correctIndex?: number;
  correctAnswers: string[];
  clozeSentence?: string;
  exampleEn?: string;
  hintLetter?: string;
}
