import type { Grade, Sched, SchedStatus } from "../types";

/** SM-2 定数（調整はここだけ） */
export const SM2 = {
  INITIAL_EF: 2.5,
  MIN_EF: 1.3,
  FIRST_INTERVAL: 1,
  SECOND_INTERVAL: 6,
  REACH_LAPSES: 8,
  DAILY_NEW_DEFAULT: 5,
  DAILY_NEW_OPTIONS: [5, 10, 20, 50, 100] as const,
  DAILY_MAX_TOTAL: 200,
  MAX_REQUEUE_PER_DAY: 2,
} as const;

export function gradeToQuality(grade: Grade): number {
  if (grade === "forgot") return 1;
  if (grade === "maybe") return 3;
  return 5;
}

export function createNewSched(dueDay: number): Sched {
  return {
    ef: SM2.INITIAL_EF,
    reps: 0,
    interval: 0,
    due: dueDay,
    lapses: 0,
    maybeCount: 0,
    last: Date.now(),
    status: "new",
  };
}

export function applySm2(sched: Sched, q: number, today: number): Sched {
  const next: Sched = { ...sched, last: Date.now() };

  if (q < 3) {
    next.reps = 0;
    next.lapses += 1;
    next.interval = 0;
    next.due = today;
    next.status = "learning";
  } else {
    if (next.reps === 0) next.interval = SM2.FIRST_INTERVAL;
    else if (next.reps === 1) next.interval = SM2.SECOND_INTERVAL;
    else next.interval = Math.max(1, Math.round(next.interval * next.ef));
    next.reps += 1;
    next.due = today + next.interval;
    next.status = "review";
  }

  next.ef = next.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (next.ef < SM2.MIN_EF) next.ef = SM2.MIN_EF;

  if (next.lapses >= SM2.REACH_LAPSES) {
    next.status = "suspended";
  }

  return next;
}

export function applyGrade(sched: Sched, grade: Grade, today: number): Sched {
  return applySm2(sched, gradeToQuality(grade), today);
}

/** 保持率の目安 R = exp(-Δ日 / S), S ≈ interval * ef */
export function estimateRetention(sched: Sched, today: number): number {
  if (sched.status === "new") return 0;
  const delta = Math.max(0, today - (sched.due - sched.interval));
  const stability = Math.max(1, sched.interval * sched.ef);
  return Math.exp(-delta / stability);
}

export function daysUntilDue(sched: Sched, today: number): number {
  return Math.max(0, sched.due - today);
}

export function isSchedStatus(s: Sched | undefined, ...statuses: SchedStatus[]): boolean {
  return !!s && statuses.includes(s.status);
}
