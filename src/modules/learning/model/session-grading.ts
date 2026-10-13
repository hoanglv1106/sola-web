import type { SessionStep } from '../types';

export type AnswerMap = Record<string, string>;

export interface GradedAnswer {
  questionId: string;
  selected: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface SessionGradingResult {
  answers: GradedAnswer[];
  correctCount: number;
  totalCount: number;
  answeredCount: number;
  missingCount: number;
  allCorrect: boolean;
  isComplete: boolean;
}

/**
 * Grade a step's answers against the production fixture data.
 *
 * Results are always derived from the current answers map, so editing an answer
 * after checking invalidates the previous verdict instead of reusing it.
 */
export function gradeSessionStep(
  step: Pick<SessionStep, 'questions'>,
  answers: AnswerMap
): SessionGradingResult {
  const questions = step.questions ?? [];

  const graded = questions.map<GradedAnswer>((question) => {
    const selected = answers[question.id] ?? null;
    return {
      questionId: question.id,
      selected,
      correctAnswer: question.correctAnswer,
      isCorrect: selected === question.correctAnswer,
    };
  });

  const correctCount = graded.filter((item) => item.isCorrect).length;
  const answeredCount = graded.filter((item) => item.selected !== null).length;

  return {
    answers: graded,
    correctCount,
    totalCount: graded.length,
    answeredCount,
    missingCount: graded.length - answeredCount,
    allCorrect: graded.length > 0 && correctCount === graded.length,
    isComplete: graded.length > 0 && answeredCount === graded.length,
  };
}

export function getSelectedAnswer(answers: AnswerMap, questionId: string): string | null {
  return answers[questionId] ?? null;
}

/** True when every question has an answer selected. */
export function areAllQuestionsAnswered(
  step: Pick<SessionStep, 'questions'>,
  answers: AnswerMap
): boolean {
  const questions = step.questions ?? [];
  return questions.length > 0 && questions.every((q) => Boolean(answers[q.id]));
}
