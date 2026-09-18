import { describe, it, expect } from 'vitest';
import { MistakeItem, MistakeCategory } from '@/modules/mistakes/types';

export function filterMistakesByCategory(
  mistakes: MistakeItem[],
  category: MistakeCategory | 'all'
): MistakeItem[] {
  if (category === 'all') return mistakes;
  return mistakes.filter((m) => m.category === category);
}

export function markMistakeImproved(mistake: MistakeItem): MistakeItem {
  return {
    ...mistake,
    isImproved: true,
    timesSeen: Math.max(0, mistake.timesSeen - 1),
  };
}

export function calculateMistakeResolutionRate(mistakes: MistakeItem[]): number {
  if (mistakes.length === 0) return 100;
  const improvedCount = mistakes.filter((m) => m.isImproved).length;
  return Math.round((improvedCount / mistakes.length) * 100);
}

describe('Mistakes Review & Resolution Logic', () => {
  const sampleMistakes: MistakeItem[] = [
    {
      id: 'm1',
      category: 'grammar',
      subcategory: 'Infinitive vs Gerund',
      date: 'Today',
      userAnswer: 'I would rather to stay home',
      correctAnswer: 'I would rather stay home',
      explanation: 'Use bare infinitive after would rather',
      timesSeen: 3,
      isImproved: false,
    },
    {
      id: 'm2',
      category: 'vocabulary',
      subcategory: 'Collocations',
      date: 'Yesterday',
      userAnswer: 'do a decision',
      correctAnswer: 'make a decision',
      explanation: 'Collocation with decision is make',
      timesSeen: 2,
      isImproved: true,
    },
    {
      id: 'm3',
      category: 'grammar',
      subcategory: 'Subject-Verb Agreement',
      date: 'Today',
      userAnswer: 'She have been working here',
      correctAnswer: 'She has been working here',
      explanation: 'Subject-verb agreement with third person singular',
      timesSeen: 1,
      isImproved: false,
    },
  ];

  it('should filter mistakes correctly by category', () => {
    const grammarOnly = filterMistakesByCategory(sampleMistakes, 'grammar');
    expect(grammarOnly).toHaveLength(2);
    expect(grammarOnly.every((m) => m.category === 'grammar')).toBe(true);

    const vocabOnly = filterMistakesByCategory(sampleMistakes, 'vocabulary');
    expect(vocabOnly).toHaveLength(1);

    const all = filterMistakesByCategory(sampleMistakes, 'all');
    expect(all).toHaveLength(3);
  });

  it('should mark mistake as improved and decrement timesSeen', () => {
    const updated = markMistakeImproved(sampleMistakes[0]);
    expect(updated.isImproved).toBe(true);
    expect(updated.timesSeen).toBe(2);
  });

  it('should calculate accurate mistake resolution rate', () => {
    const rate = calculateMistakeResolutionRate(sampleMistakes);
    // 1 out of 3 is improved => 33%
    expect(rate).toBe(33);

    const allImproved = sampleMistakes.map((m) => markMistakeImproved(m));
    expect(calculateMistakeResolutionRate(allImproved)).toBe(100);
  });
});
