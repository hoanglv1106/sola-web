import type { ToeicQuestion } from '../../types';

export type ToeicAnswerKey = 'A' | 'B' | 'C' | 'D';

export interface ToeicScoreResult {
  correctCount: number;
  totalCount: number;
  incorrectCount: number;
  unansweredCount: number;
  percentage: number;
}

export function formatTimeSeconds(seconds: number): string {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Score a TOEIC section. Unanswered questions are wrong, never negative, and an
 * empty question list yields a 0% result instead of NaN.
 */
export function scoreToeicTest(
  questions: ToeicQuestion[],
  userAnswers: Record<string, ToeicAnswerKey>
): ToeicScoreResult {
  const totalCount = questions.length;
  const correctCount = questions.reduce(
    (acc, question) => (userAnswers[question.id] === question.correctAnswer ? acc + 1 : acc),
    0
  );
  const answeredCount = questions.reduce(
    (acc, question) => (userAnswers[question.id] ? acc + 1 : acc),
    0
  );

  return {
    correctCount,
    totalCount,
    incorrectCount: answeredCount - correctCount,
    unansweredCount: totalCount - answeredCount,
    percentage: totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100),
  };
}

export interface TestClockState {
  secondsRemaining: number;
  isPaused: boolean;
  isSubmitted: boolean;
}

export interface TestClockTick {
  state: TestClockState;
  /** True when this tick reached zero and must finalize the test exactly once. */
  expired: boolean;
}

/** Advance the countdown by one second. Never goes below zero. */
export function tickTestClock(state: TestClockState, deltaSeconds = 1): TestClockTick {
  if (state.isSubmitted || state.isPaused) {
    return { state, expired: false };
  }

  const next = Math.max(0, state.secondsRemaining - deltaSeconds);

  if (next === 0 && state.secondsRemaining > 0) {
    return {
      state: { ...state, secondsRemaining: 0, isSubmitted: true },
      expired: true,
    };
  }

  return { state: { ...state, secondsRemaining: next }, expired: false };
}

/** Time is only expired once; a finished test must not re-finalize. */
export function isClockExpired(state: TestClockState): boolean {
  return !state.isSubmitted && state.secondsRemaining <= 0;
}

/**
 * Finalize the test (manual submit or an explicit expiry call).
 *
 * Remaining time is preserved so a manual submit still reports how much time was
 * left; only the countdown tick itself drives the clock down to zero.
 */
export function finalizeTestClock(state: TestClockState): TestClockState {
  return { ...state, isSubmitted: true };
}

/** Answers are immutable after submit or after expiry. */
export function canMutateAnswers(state: TestClockState): boolean {
  return !state.isSubmitted;
}
