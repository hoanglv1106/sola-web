import { describe, it, expect } from 'vitest';
import { mockTodaySession } from '@/mocks/learning.mock';
// Production domain logic (no test-local reimplementation).
import { gradeSessionStep, areAllQuestionsAnswered } from '@/modules/learning/model';

const step = mockTodaySession.steps[0];
const correctAnswers: Record<string, string> = Object.fromEntries(
  step.questions.map((question) => [question.id, question.correctAnswer])
);

describe('Daily session answer grading', () => {
  it('should start with no answers and nothing pre-selected', () => {
    const result = gradeSessionStep(step, {});
    expect(step.questions.length).toBeGreaterThan(0);
    expect(result.answeredCount).toBe(0);
    expect(result.missingCount).toBe(step.questions.length);
    expect(result.correctCount).toBe(0);
    expect(result.allCorrect).toBe(false);
    expect(result.isComplete).toBe(false);
    expect(result.answers.every((answer) => answer.selected === null)).toBe(true);
  });

  it('should grade every correct answer as allCorrect', () => {
    const result = gradeSessionStep(step, correctAnswers);
    expect(result.correctCount).toBe(step.questions.length);
    expect(result.allCorrect).toBe(true);
    expect(result.isComplete).toBe(true);
    expect(result.missingCount).toBe(0);
  });

  it('should grade a wrong answer as incorrect (not blindly correct)', () => {
    const first = step.questions[0];
    const wrongOption =
      first.options.find((option) => option !== first.correctAnswer) ?? 'nonsense';

    const result = gradeSessionStep(step, { ...correctAnswers, [first.id]: wrongOption });
    expect(result.correctCount).toBe(step.questions.length - 1);
    expect(result.allCorrect).toBe(false);

    const graded = result.answers.find((answer) => answer.questionId === first.id);
    expect(graded?.isCorrect).toBe(false);
    expect(graded?.selected).toBe(wrongOption);
  });

  it('should treat missing answers as unanswered, never correct', () => {
    const first = step.questions[0];
    const partial = { ...correctAnswers };
    delete partial[first.id];

    const result = gradeSessionStep(step, partial);
    expect(result.missingCount).toBe(1);
    expect(result.isComplete).toBe(false);
    expect(result.allCorrect).toBe(false);

    const graded = result.answers.find((answer) => answer.questionId === first.id);
    expect(graded?.selected).toBeNull();
    expect(graded?.isCorrect).toBe(false);
  });

  it('should grade a mixed attempt with correct, wrong and missing answers', () => {
    const [q1, q2, q3] = step.questions;
    const wrongQ2 = q2.options.find((option) => option !== q2.correctAnswer) ?? 'x';

    const result = gradeSessionStep(step, {
      [q1.id]: q1.correctAnswer,
      [q2.id]: wrongQ2,
      // q3 intentionally missing
    });

    expect(result.correctCount).toBe(1);
    expect(result.answeredCount).toBe(2);
    expect(result.missingCount).toBe(step.questions.length - 2);
    expect(result.allCorrect).toBe(false);
    expect(result.answers.find((a) => a.questionId === q3.id)?.isCorrect).toBe(false);
  });

  it('should change the verdict when an answer is edited after checking', () => {
    const first = step.questions[0];
    const wrongOption =
      first.options.find((option) => option !== first.correctAnswer) ?? 'nonsense';

    const before = gradeSessionStep(step, correctAnswers);
    expect(before.allCorrect).toBe(true);

    // Simulate the learner editing one answer after pressing "Check answers".
    const after = gradeSessionStep(step, { ...correctAnswers, [first.id]: wrongOption });
    expect(after.allCorrect).toBe(false);
    expect(after.correctCount).toBe(before.correctCount - 1);
  });

  it('should restore allCorrect when the edit is corrected again', () => {
    const first = step.questions[0];
    const wrongOption =
      first.options.find((option) => option !== first.correctAnswer) ?? 'nonsense';

    const edited = gradeSessionStep(step, { ...correctAnswers, [first.id]: wrongOption });
    const restored = gradeSessionStep(step, correctAnswers);

    expect(edited.allCorrect).toBe(false);
    expect(restored.allCorrect).toBe(true);
  });

  it('should report whether every question is answered', () => {
    expect(areAllQuestionsAnswered(step, {})).toBe(false);
    expect(areAllQuestionsAnswered(step, correctAnswers)).toBe(true);

    const partial = { ...correctAnswers };
    delete partial[step.questions[0].id];
    expect(areAllQuestionsAnswered(step, partial)).toBe(false);
  });

  it('should guard against a step with no questions', () => {
    const empty = { questions: [] };
    const result = gradeSessionStep(empty, {});
    expect(result.totalCount).toBe(0);
    expect(result.allCorrect).toBe(false);
    expect(result.isComplete).toBe(false);
    expect(areAllQuestionsAnswered(empty, {})).toBe(false);
  });

  it('should not mutate the fixture questions while grading', () => {
    const before = JSON.stringify(mockTodaySession.steps[0]);
    gradeSessionStep(step, correctAnswers);
    gradeSessionStep(step, {});
    expect(JSON.stringify(mockTodaySession.steps[0])).toBe(before);
  });
});
