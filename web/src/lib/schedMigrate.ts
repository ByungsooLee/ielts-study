import type { LegacySrsRecord, ProgressData, Sched } from "../types";
import { SM2 } from "./sm2";
import { INTERVALS } from "./srs";
import { getDeviceId } from "./device";
import { DEFAULT_USER_ID } from "./progressConstants";

/**
 * 1: 旧 box 方式
 * 2: SM-2（ef/reps/interval/due/status）
 * 3: 端末間同期向け（item 単位 updatedAt/sourceDeviceId、userId/deviceId、streak.longest）
 */
export const SCHEMA_VERSION = 3;

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

/** v3: streak に longest を補完（破壊的に短くしない） */
function ensureStreak(streak: ProgressData["streak"]): ProgressData["streak"] {
  if (!streak) return streak;
  const longest = Math.max(streak.longest ?? 0, streak.count ?? 0);
  return { ...streak, longest };
}

export function ensureSchemaVersion(progress: ProgressData): ProgressData {
  if (progress.schemaVersion === SCHEMA_VERSION) {
    // 既に最新でも、欠けがちな envelope を冪等に補完
    return {
      ...progress,
      userId: progress.userId ?? DEFAULT_USER_ID,
      deviceId: progress.deviceId ?? getDeviceId(),
    };
  }
  return {
    ...progress,
    srs: migrateProgressSrs(progress.srs),
    streak: ensureStreak(progress.streak),
    schemaVersion: SCHEMA_VERSION,
    dailyMeta: progress.dailyMeta,
    userId: progress.userId ?? DEFAULT_USER_ID,
    deviceId: progress.deviceId ?? getDeviceId(),
  };
}
