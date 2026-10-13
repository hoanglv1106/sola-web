import { describe, it, expect } from 'vitest';
import { MistakeItem } from '@/modules/mistakes/types';
import { mockAgreeDrillData, mockMistakeItems } from '@/mocks/mistakes.mock';
// Production domain logic (no test-local reimplementation).
import {
  filterMistakesByCategory,
  markMistakeImproved,
  calculateMistakeResolutionRate,
  resolveDrillForId,
} from '@/modules/mistakes/model';

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

  it('should report 0% resolution for an empty notebook instead of 100%', () => {
    expect(calculateMistakeResolutionRate([])).toBe(0);
  });

  it('should not decrement timesSeen below zero', () => {
    const zeroSeen: MistakeItem = { ...sampleMistakes[0], timesSeen: 0 };
    expect(markMistakeImproved(zeroSeen).timesSeen).toBe(0);
    expect(markMistakeImproved(zeroSeen).isImproved).toBe(true);
  });

  it('should not mutate the original mistake when marking improved', () => {
    const original = sampleMistakes[0];
    const before = { ...original };
    markMistakeImproved(original);
    expect(original).toEqual(before);
  });
});

describe('Mistake drill id resolution', () => {
  const drills = [mockAgreeDrillData];

  it('should resolve the drill for a valid notebook id', () => {
    const result = resolveDrillForId('mis-2', drills, mockMistakeItems);
    expect(result.isResolved).toBe(true);
    expect(result.requestedId).toBe('mis-2');
    expect(result.drill?.mistakeId).toBe('mis-2');
  });

  it('should reuse the matching category template while keeping the notebook id', () => {
    // mis-5 is grammar and the fixture set has no grammar drill authored yet,
    // so resolution must fail explicitly rather than showing the wrong drill.
    const unsupported = resolveDrillForId('mis-5', drills, mockMistakeItems);
    expect(unsupported.isResolved).toBe(false);
    expect(unsupported.drill).toBeNull();

    // When a category template exists, the resolved drill carries the id,
    // category and sentence of the requested notebook entry.
    const result = resolveDrillForId('mis-3-vocab-twin', drills, [
      ...mockMistakeItems,
      { ...mockMistakeItems[1], id: 'mis-3-vocab-twin' },
    ]);
    expect(result.isResolved).toBe(true);
    expect(result.drill?.mistakeId).toBe('mis-3-vocab-twin');
    expect(result.drill?.category).toBe('vocabulary');
    expect(result.drill?.userMistakeSentence).toBe(mockMistakeItems[1].userAnswer);
  });

  it('should return an explicit unresolved state for an unknown id', () => {
    const result = resolveDrillForId('does-not-exist', drills, mockMistakeItems);
    expect(result.isResolved).toBe(false);
    expect(result.drill).toBeNull();
    expect(result.requestedId).toBe('does-not-exist');
  });

  it('should treat an empty or whitespace id as invalid instead of falling back', () => {
    expect(resolveDrillForId('', drills, mockMistakeItems).isResolved).toBe(false);
    expect(resolveDrillForId('   ', drills, mockMistakeItems).isResolved).toBe(false);
  });

  it('should never mutate the fixture drill while resolving', () => {
    const before = JSON.stringify(mockAgreeDrillData);
    resolveDrillForId('mis-1', drills, mockMistakeItems);
    resolveDrillForId('mis-2', drills, mockMistakeItems);
    expect(JSON.stringify(mockAgreeDrillData)).toBe(before);
  });
});
