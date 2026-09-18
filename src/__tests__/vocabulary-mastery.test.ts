import { describe, it, expect } from 'vitest';
import { VocabularyStage } from '@/modules/vocabulary/types';

// Helper pure functions representing domain logic
const stageRank: VocabularyStage[] = [
  'new',
  'learning',
  'familiar',
  'strong',
  'mastered',
];

export function promoteStage(current: VocabularyStage): VocabularyStage {
  const currentIndex = stageRank.indexOf(current);
  if (currentIndex === -1 || currentIndex >= stageRank.length - 1) {
    return 'mastered';
  }
  return stageRank[currentIndex + 1];
}

export function demoteStage(current: VocabularyStage): VocabularyStage {
  const currentIndex = stageRank.indexOf(current);
  if (currentIndex <= 0) {
    return 'new';
  }
  return stageRank[currentIndex - 1];
}

export function calculateMasteryPercentage(stage: VocabularyStage): number {
  const index = stageRank.indexOf(stage);
  return Math.round(((index + 1) / stageRank.length) * 100);
}

describe('Vocabulary Mastery Transitions', () => {
  it('should promote vocabulary stage sequentially on "I know this"', () => {
    expect(promoteStage('new')).toBe('learning');
    expect(promoteStage('learning')).toBe('familiar');
    expect(promoteStage('familiar')).toBe('strong');
    expect(promoteStage('strong')).toBe('mastered');
    expect(promoteStage('mastered')).toBe('mastered');
  });

  it('should demote vocabulary stage on "Need more practice"', () => {
    expect(demoteStage('mastered')).toBe('strong');
    expect(demoteStage('strong')).toBe('familiar');
    expect(demoteStage('familiar')).toBe('learning');
    expect(demoteStage('learning')).toBe('new');
    expect(demoteStage('new')).toBe('new');
  });

  it('should calculate correct mastery percentages for progress rings', () => {
    expect(calculateMasteryPercentage('new')).toBe(20);
    expect(calculateMasteryPercentage('learning')).toBe(40);
    expect(calculateMasteryPercentage('familiar')).toBe(60);
    expect(calculateMasteryPercentage('strong')).toBe(80);
    expect(calculateMasteryPercentage('mastered')).toBe(100);
  });
});
