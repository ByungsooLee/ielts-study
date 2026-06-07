export type ItemType = "word" | "phrase" | "grammar" | "conversation";

export interface Example {
  en: string;
  jp?: string;
  linking?: string;
  tips?: string[];
  stressWords?: string[];
}

export interface StudyItem {
  id: string;
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
  priority?: "S" | "A" | "B";
  links?: string[];
  note?: string;
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

export interface SrsRecord {
  box: number;
  due: number;
  ts: number;
  lapses: number;
}

export interface UserSentence {
  id: string;
  text: string;
  usedGrammar?: string;
  createdAt: number;
  ai?: { corrected: string; comment: string };
}

export interface ProgressData {
  srs: Record<string, SrsRecord>;
  hard: Record<string, boolean>;
  userSentences: Record<string, UserSentence[]>;
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

export interface AppSettings {
  workerUrl: string;
  syncToken: string;
  accent: Accent;
}

export type SyncStatus = "idle" | "syncing" | "ok" | "error" | "offline";

export type Grade = "forgot" | "maybe" | "remembered";

export interface ImportResult {
  added: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export interface CoachResult {
  linking: string;
  tips: string[];
  stressWords?: string[];
}

export interface CoachCacheEntry {
  key: string;
  sentence: string;
  linking: string;
  tips: string[];
  stressWords?: string[];
  cachedAt: number;
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
