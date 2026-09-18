import { describe, it, expect } from 'vitest';

export function calculateStudyGoalProgress(
  currentMinutes: number,
  targetMinutes: number
): { percentage: number; isCompleted: boolean } {
  if (targetMinutes <= 0) return { percentage: 100, isCompleted: true };
  const percentage = Math.min(100, Math.round((currentMinutes / targetMinutes) * 100));
  return { percentage, isCompleted: currentMinutes >= targetMinutes };
}

export function updateStreak(
  currentStreak: number,
  studiedToday: boolean
): number {
  return studiedToday ? currentStreak + 1 : currentStreak;
}

export function computeAverageSkillScore(skills: { score: number }[]): number {
  if (skills.length === 0) return 0;
  const total = skills.reduce((sum, s) => sum + s.score, 0);
  return Math.round((total / skills.length) * 10) / 10;
}

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

  it('should compute average skill score across multiple skills', () => {
    const skills = [
      { score: 6.5 },
      { score: 7.0 },
      { score: 6.0 },
      { score: 6.5 },
    ];
    // sum = 26.0 / 4 = 6.5
    expect(computeAverageSkillScore(skills)).toBe(6.5);
  });
});
