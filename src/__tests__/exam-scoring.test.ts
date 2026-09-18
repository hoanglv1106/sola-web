import { describe, it, expect } from 'vitest';
import { ToeicQuestion, RubricCriterion } from '@/modules/exams/types';

export function formatTimeSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function scoreToeicTest(
  questions: ToeicQuestion[],
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>
): { correctCount: number; totalCount: number; percentage: number } {
  if (questions.length === 0) {
    return { correctCount: 0, totalCount: 0, percentage: 0 };
  }

  const correctCount = questions.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((correctCount / questions.length) * 100);
  return { correctCount, totalCount: questions.length, percentage };
}

export function calculateIeltsOverallBand(criteria: RubricCriterion[]): number {
  if (criteria.length === 0) return 0;
  const sum = criteria.reduce((acc, c) => acc + c.score, 0);
  const rawAvg = sum / criteria.length;
  // IELTS rounding to nearest 0.5
  return Math.round(rawAvg * 2) / 2;
}

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

  it('should calculate IELTS overall band score rounded to nearest half band', () => {
    const rubric: RubricCriterion[] = [
      { id: 'tr', name: 'Task Response', score: 6.0, summary: '' },
      { id: 'cc', name: 'Coherence and Cohesion', score: 6.5, summary: '' },
      { id: 'lr', name: 'Lexical Resource', score: 6.5, summary: '' },
      { id: 'gr', name: 'Grammar', score: 6.0, summary: '' },
    ];
    // raw average = (6.0 + 6.5 + 6.5 + 6.0) / 4 = 25.0 / 4 = 6.25 -> rounded to 6.5
    expect(calculateIeltsOverallBand(rubric)).toBe(6.5);

    const rubricHigher: RubricCriterion[] = [
      { id: 'tr', name: 'Task Response', score: 7.0, summary: '' },
      { id: 'cc', name: 'Coherence and Cohesion', score: 7.5, summary: '' },
      { id: 'lr', name: 'Lexical Resource', score: 7.0, summary: '' },
      { id: 'gr', name: 'Grammar', score: 7.5, summary: '' },
    ];
    // raw average = 29 / 4 = 7.25 -> rounded to 7.5
    expect(calculateIeltsOverallBand(rubricHigher)).toBe(7.5);
  });
});
