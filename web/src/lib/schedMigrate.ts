import type { LegacySrsRecord, ProgressData, Sched } from "../types";
import { SM2 } from "./sm2";
import { INTERVALS } from "./srs";

const SCHEMA_VERSION = 2;

export function isLegacySrsRecord(value: unknown): value is LegacySrsRecord {
  return (
    !!value &&
    typeof value === "object" &&
    "box" in value &&
    typeof (value as LegacySrsRecord).box === "number"
  );
}

export function migrateLegacyRecord(legacy: LegacySrsRecord): Sched {
  const box = Math.min(Math.max(legacy.box, 0), INTERVALS.length - 1);
  let status: Sched["status"] = "review";
  if (legacy.lapses > 0 && box === 0) status = "learning";
  if (legacy.lapses >= SM2.REACH_LAPSES) status = "suspended";

  return {
    ef: SM2.INITIAL_EF,
    reps: box,
    interval: INTERVALS[box] ?? 0,
    due: legacy.due,
    lapses: legacy.lapses,
    maybeCount: 0,
    last: legacy.ts,
    status,
  };
}

export function migrateProgressSrs(srs: ProgressData["srs"]): Record<string, Sched> {
  const migrated: Record<string, Sched> = {};
  for (const [id, record] of Object.entries(srs ?? {})) {
    if (isLegacySrsRecord(record)) {
      migrated[id] = migrateLegacyRecord(record);
    } else {
      const sched = record as Sched;
      migrated[id] = { ...sched, maybeCount: sched.maybeCount ?? 0 };
    }
  }
  return migrated;
}

export function ensureSchemaVersion(progress: ProgressData): ProgressData {
  if (progress.schemaVersion === SCHEMA_VERSION) return progress;
  return {
    ...progress,
    srs: migrateProgressSrs(progress.srs),
    schemaVersion: SCHEMA_VERSION,
    dailyMeta: progress.dailyMeta,
  };
}
