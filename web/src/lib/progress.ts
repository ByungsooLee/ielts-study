import type { ProgressData } from "../types";
import { ensureSchemaVersion } from "./schedMigrate";

export function normalizeProgress(data: Partial<ProgressData>): ProgressData {
  const base: ProgressData = {
    srs: data.srs ?? {},
    hard: data.hard ?? {},
    userSentences: data.userSentences ?? {},
    streak: data.streak,
    dailyMeta: data.dailyMeta,
    schemaVersion: data.schemaVersion,
    updatedAt: data.updatedAt ?? Date.now(),
  };
  return ensureSchemaVersion(base);
}
