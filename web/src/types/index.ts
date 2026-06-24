export type Domain = "english" | "engineering";

export type ItemType = "word" | "phrase" | "grammar" | "conversation" | "concept" | "interview";

export interface ExplainTarget {
  term: string;
  ja: string;
  collocation?: string;
}

export interface ProcessPhrase {
  func: string;
  en: string;
  ja: string;
}

export type DiagramType = "flowchart" | "sequence" | "architecture" | "er";

export interface EngineeringDiagram {
  type: DiagramType;
  mermaid: string;
}

export interface ConceptExplain {
  prompt_ja: string;
  points_ja?: string[];
  key_phrases?: string[];
  model_en: string;
  model_en_long?: string;
  /** 図解カード：この図を説明するのに使う語彙 */
  targets?: ExplainTarget[];
}

/** Engineering 概念カードの学習ステップ */
export type EngineeringStep = "understand" | "points" | "phrases" | "practice";

export interface Example {
  en: string;
  jp?: string;
  linking?: string;
  tips?: string[];
  stressWords?: string[];
}

export interface GrammarCloze {
  q: string;
  a: string;
  hint?: string;
}

export interface GrammarDrill {
  jp: string;
  en: string;
  point: string;
  ng?: string;
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
  /** 文法専用：一言コツ */
  tip?: string;
  /** 文法専用：瞬間英作文ドリル */
  drill?: GrammarDrill[];
  /** 文法専用：IELTS 4技能での使いどころ */
  ielts?: string;
  detail_ja?: string;
  /** Engineering 図解：日本語の要点（もっと知る） */
  ja?: string;
  /** Engineering 図解：Mermaid 図 */
  diagram?: EngineeringDiagram;
  /** Engineering 図解：プロセス記述の定型表現 */
  phrases?: ProcessPhrase[];
  cloze?: GrammarCloze[];
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
  /** 認識用(passive)か産出用(active)か。Passive一覧の対象判定に使う。 */
  register?: "active" | "passive";
  links?: string[];
  note?: string;
  explain?: ConceptExplain;
}

/** 面接Q&A：回答を覚えやすい1文チャンクに分割した1文分 */
export interface InterviewTerm {
  en: string;
  jp: string;
  pos?: string;
}

export interface InterviewSentence {
  en: string;
  jp?: string;
  /** 連結(‿)・弱形（pron-coach 由来。任意） */
  linking?: string;
  /** 構文・文法解説（文タップで表示） */
  syntax?: string;
  /** 文法ポイントの箇条書き */
  grammar?: string[];
  tips?: string[];
  /** この文の重要語（インライン定義。vocab に依存しない） */
  terms?: InterviewTerm[];
}

/** 面接Q&A item（1件＝1 Q&A）。StudyItem とは別系統（front/meaning を持たない） */
export interface InterviewItem {
  id: string;
  n?: number;
  type: "interview";
  domain?: Domain;
  collection?: string;
  theme?: number;
  themeName?: string;
  register?: "active" | "passive";
  question: {
    en: string;
    jp: string;
    tts?: string;
  };
  answer: {
    jp: string;
    sentences: InterviewSentence[];
  };
  pron?: { tts?: boolean };
  source?: { added?: string };
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
  /** 最終更新時刻（ms）。端末間マージで item 単位の新しさ判定に使う。 */
  updatedAt?: number;
  /** この変更を行った端末 ID（由来追跡） */
  sourceDeviceId?: string;
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
  /** これまでの最長連続日数（破壊的に短くしない） */
  longest?: number;
  /** 最終学習日（YYYY-MM-DD・表示/将来同期用） */
  lastStudiedDate?: string;
}

export interface ProgressData {
  srs: Record<string, Sched>;
  hard: Record<string, boolean>;
  userSentences: Record<string, UserSentence[]>;
  streak?: StreakData;
  dailyMeta?: DailyMeta;
  schemaVersion?: number;
  updatedAt: number;
  /** 所有ユーザー（個人用は "default"） */
  userId?: string;
  /** 最後に書き込んだ端末 ID */
  deviceId?: string;
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
