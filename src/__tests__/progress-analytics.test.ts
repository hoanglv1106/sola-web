import { describe, it, expect } from 'vitest';
import { mockDailyGoalProgress } from '@/mocks/progress.mock';
// Production domain logic (no test-local reimplementation).
import {
  calculateStudyGoalProgress,
  updateStreak,
  computeDailyGoalBasis,
} from '@/modules/progress/model';

describe('Progress Analytics & Streak Calculations', () => {
  it('should compute weekly study goal percentage correctly', () => {
    // 60 / 150 = 40% (as shown in learn-week planing design)
    const result = calculateStudyGoalProgress(60, 150);
    expect(result.percentage).toBe(40);
    expect(result.isCompleted).toBe(false);

    const finished = calculateStudyGoalProgress(150, 150);
    expect(finished.percentage).toBe(100);
    expect(finished.isCompleted).toBe(true);

    const exceeded = calculateStudyGoalProgress(180, 150);
    expect(exceeded.percentage).toBe(100);
    expect(exceeded.isCompleted).toBe(true);
  });

  it('should update daily streak when learner studies today', () => {
    expect(updateStreak(18, true)).toBe(19);
    expect(updateStreak(18, false)).toBe(18);
  });

});

describe('Progress goal guards', () => {
  it('should not divide by zero when the target is zero or negative', () => {
    expect(calculateStudyGoalProgress(10, 0).percentage).toBe(100);
    expect(calculateStudyGoalProgress(0, 0).isCompleted).toBe(true);
    expect(Number.isNaN(calculateStudyGoalProgress(5, -3).percentage)).toBe(false);
  });

  it('should report remaining minutes without going negative', () => {
    expect(calculateStudyGoalProgress(60, 150).minutesRemaining).toBe(90);
    expect(calculateStudyGoalProgress(200, 150).minutesRemaining).toBe(0);
  });

  it('should clamp the goal ring to 0-100 for the daily dial', () => {
    const over = computeDailyGoalBasis({ completedItems: 40, targetItems: 15, streakDays: 3 });
    expect(over.percentage).toBe(100);
    expect(over.isCompleted).toBe(true);

    const partial = computeDailyGoalBasis({ completedItems: 6, targetItems: 15, streakDays: 18 });
    expect(partial.percentage).toBe(40);
    expect(partial.isCompleted).toBe(false);
    expect(partial.streakDays).toBe(18);
  });

  it('should guard the daily dial against a zero target', () => {
    const basis = computeDailyGoalBasis({ completedItems: 3, targetItems: 0, streakDays: 18 });
    expect(basis.percentage).toBe(0);
    expect(basis.isCompleted).toBe(false);
    expect(Number.isNaN(basis.percentage)).toBe(false);
  });

  it('should match the goal dial rendered from the mock fixture', () => {
    const basis = computeDailyGoalBasis({
      completedItems: mockDailyGoalProgress.completedItems,
      targetItems: mockDailyGoalProgress.targetItems,
      streakDays: mockDailyGoalProgress.streakDays,
    });
    // 6/15 = 40%
    expect(basis.percentage).toBe(40);
  });

  it('should not advance a streak when the learner did not study', () => {
    expect(updateStreak(0, false)).toBe(0);
    expect(updateStreak(18, true)).toBe(19);
  });
});
