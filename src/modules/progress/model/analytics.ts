export interface StudyGoalProgress {
  percentage: number;
  isCompleted: boolean;
  minutesRemaining: number;
}

/**
 * Weekly/daily study goal progress. A non-positive target is treated as already
 * completed and never divides by zero.
 */
export function calculateStudyGoalProgress(
  currentMinutes: number,
  targetMinutes: number
): StudyGoalProgress {
  if (!Number.isFinite(currentMinutes) || !Number.isFinite(targetMinutes) || targetMinutes <= 0) {
    return { percentage: 100, isCompleted: true, minutesRemaining: 0 };
  }

  const safeCurrent = Math.max(0, currentMinutes);
  const percentage = Math.min(100, Math.round((safeCurrent / targetMinutes) * 100));

  return {
    percentage,
    isCompleted: safeCurrent >= targetMinutes,
    minutesRemaining: Math.max(0, targetMinutes - safeCurrent),
  };
}

/** Streak advances only once per studied day; a missed day does not reset it here. */
export function updateStreak(currentStreak: number, studiedToday: boolean): number {
  const safeStreak = Number.isFinite(currentStreak) ? Math.max(0, Math.floor(currentStreak)) : 0;
  return studiedToday ? safeStreak + 1 : safeStreak;
}

export interface GoalBasisInput {
  completedItems: number;
  targetItems: number;
  streakDays: number;
}

export interface GoalBasis {
  percentage: number;
  isCompleted: boolean;
  streakDays: number;
}

/**
 * Single source of truth for the "today's goal" dial rendered on the progress
 * page; guards against a zero/negative target and clamps the ring to 0-100.
 */
export function computeDailyGoalBasis(input: GoalBasisInput): GoalBasis {
  const { completedItems, targetItems, streakDays } = input;
  const progress = calculateStudyGoalProgress(completedItems, targetItems);

  return {
    percentage: targetItems <= 0 ? 0 : progress.percentage,
    isCompleted: targetItems > 0 && completedItems >= targetItems,
    streakDays: Math.max(0, Math.floor(Number.isFinite(streakDays) ? streakDays : 0)),
  };
}
