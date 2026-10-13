import { describe, it, expect } from 'vitest';
import { ToeicQuestion } from '@/modules/exams/types';
// Production domain logic (no test-local reimplementation).
import {
  formatTimeSeconds,
  scoreToeicTest,
  tickTestClock,
  finalizeTestClock,
  canMutateAnswers,
  type TestClockState,
} from '@/modules/exams/toeic/model';

describe('Exam Scoring & TOEIC Engine Logic', () => {
  it('should format seconds to MM:SS string correctly', () => {
    expect(formatTimeSeconds(582)).toBe('09:42');
    expect(formatTimeSeconds(60)).toBe('01:00');
    expect(formatTimeSeconds(5)).toBe('00:05');
    expect(formatTimeSeconds(0)).toBe('00:00');
  });

  it('should score TOEIC questions with accurate counts and percentage', () => {
    const questions: ToeicQuestion[] = [
      {
        id: 'q1',
        questionNumber: 1,
        part: 1,
        partTitle: 'Part 1',
        instruction: '',
        options: [],
        correctAnswer: 'B',
        explanation: '',
      },
      {
        id: 'q2',
        questionNumber: 2,
        part: 1,
        partTitle: 'Part 1',
        instruction: '',
        options: [],
        correctAnswer: 'A',
        explanation: '',
      },
      {
        id: 'q3',
        questionNumber: 3,
        part: 1,
        partTitle: 'Part 1',
        instruction: '',
        options: [],
        correctAnswer: 'C',
        explanation: '',
      },
      {
        id: 'q4',
        questionNumber: 4,
        part: 1,
        partTitle: 'Part 1',
        instruction: '',
        options: [],
        correctAnswer: 'D',
        explanation: '',
      },
    ];

    const userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'> = {
      q1: 'B', // correct
      q2: 'A', // correct
      q3: 'B', // incorrect
      q4: 'D', // correct
    };

    const result = scoreToeicTest(questions, userAnswers);
    expect(result.correctCount).toBe(3);
    expect(result.totalCount).toBe(4);
    expect(result.percentage).toBe(75);
  });

  it('should never score negatively and should count unanswered questions as wrong', () => {
    const questions: ToeicQuestion[] = [
      {
        id: 'q1',
        questionNumber: 1,
        part: 1,
        partTitle: 'Part 1',
        instruction: '',
        options: [],
        correctAnswer: 'A',
        explanation: '',
      },
      {
        id: 'q2',
        questionNumber: 2,
        part: 1,
        partTitle: 'Part 1',
        instruction: '',
        options: [],
        correctAnswer: 'B',
        explanation: '',
      },
    ];

    // q1 unanswered, q2 answered wrongly.
    const result = scoreToeicTest(questions, { q2: 'C' });
    expect(result.correctCount).toBe(0);
    expect(result.unansweredCount).toBe(1);
    expect(result.incorrectCount).toBe(1);
    expect(result.percentage).toBe(0);
    expect(result.percentage).toBeGreaterThanOrEqual(0);
  });

  it('should return a 0% score for an empty question list (no NaN)', () => {
    const result = scoreToeicTest([], {});
    expect(result).toEqual({
      correctCount: 0,
      totalCount: 0,
      incorrectCount: 0,
      unansweredCount: 0,
      percentage: 0,
    });
    expect(Number.isNaN(result.percentage)).toBe(false);
  });

  it('should clamp negative/unset durations when formatting the timer', () => {
    expect(formatTimeSeconds(-5)).toBe('00:00');
    expect(formatTimeSeconds(Number.NaN)).toBe('00:00');
  });
});

describe('TOEIC test clock expiry', () => {
  const running: TestClockState = {
    secondsRemaining: 1,
    isPaused: false,
    isSubmitted: false,
  };

  it('should finalize exactly once when the timer reaches zero', () => {
    const tick = tickTestClock(running);
    expect(tick.expired).toBe(true);
    expect(tick.state.secondsRemaining).toBe(0);
    expect(tick.state.isSubmitted).toBe(true);

    // A second tick must NOT re-expire or re-finalize.
    const second = tickTestClock(tick.state);
    expect(second.expired).toBe(false);
    expect(second.state).toEqual(tick.state);
  });

  it('should finalize a session that starts with zero seconds remaining', () => {
    const finished = finalizeTestClock({ ...running, secondsRemaining: 0 });
    expect(finished.isSubmitted).toBe(true);
    expect(finished.secondsRemaining).toBe(0);
  });

  it('should not count down while paused and should resume correctly', () => {
    const paused = tickTestClock({ ...running, isPaused: true });
    expect(paused.expired).toBe(false);
    expect(paused.state.secondsRemaining).toBe(1);

    const resumed = tickTestClock({ ...paused.state, isPaused: false });
    expect(resumed.expired).toBe(true);
  });

  it('should freeze answers after submit or after expiry', () => {
    expect(canMutateAnswers(running)).toBe(true);
    expect(canMutateAnswers({ ...running, isSubmitted: true })).toBe(false);
    expect(canMutateAnswers(finalizeTestClock(running))).toBe(false);
  });

  it('should allow a manual submit before expiry without waiting for zero', () => {
    const manual = finalizeTestClock({ ...running, secondsRemaining: 582 });
    expect(manual.isSubmitted).toBe(true);
    // Manual submit preserves the remaining time for display.
    expect(manual.secondsRemaining).toBe(582);
    expect(tickTestClock(manual).expired).toBe(false);
  });
});
