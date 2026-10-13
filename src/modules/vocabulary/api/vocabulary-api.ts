import { apiClient, requirePayload, requireShape } from '@/shared/api';
import { mockReviewQueueWords, mockVocabularyStats } from '@/mocks/vocabulary.mock';
import type { VocabularyMasteryStats, VocabularyWord } from '../types';

export interface VocabularyReviewQueueResponse {
  words: VocabularyWord[];
  stats: VocabularyMasteryStats;
}

/**
 * Replaceable, typed data boundary for the vocabulary domain.
 *
 * The default source is the local mock fixture; flipping
 * `NEXT_PUBLIC_USE_MOCK_DATA` to `false` routes the same call to the HTTP API
 * without changing any component code. Mock data is returned as deep copies so
 * UI state can never mutate the shared fixtures.
 */
export const vocabularyDataSource = {
  kind: 'mock' as 'mock' | 'http',
};

function cloneWords(words: VocabularyWord[]): VocabularyWord[] {
  return words.map((word) => ({
    ...word,
    collocations: [...word.collocations],
    similarWords: word.similarWords ? [...word.similarWords] : undefined,
  }));
}

export function shouldUseMockData(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';
}

export async function fetchVocabularyReviewQueue(
  signal?: AbortSignal
): Promise<VocabularyReviewQueueResponse> {
  if (shouldUseMockData()) {
    return {
      words: cloneWords(mockReviewQueueWords),
      stats: { ...mockVocabularyStats },
    };
  }

  const payload = await apiClient<VocabularyReviewQueueResponse>('/vocabulary/review-queue', {
    signal,
  });

  // A missing body is a contract violation for this endpoint, not an empty
  // queue: normalising it to `{ words: [] }` would claim a successful load of
  // data the server never sent. `isEmpty` is reserved for a real empty array.
  return requireShape(
    requirePayload(payload, '/vocabulary/review-queue', 'a review queue payload'),
    '/vocabulary/review-queue',
    (candidate) =>
      Array.isArray(candidate.words) &&
      candidate.words.every((word) => Boolean(word) && typeof word.id === 'string') &&
      Boolean(candidate.stats) &&
      typeof candidate.stats === 'object',
    'a { words: VocabularyWord[], stats: VocabularyMasteryStats } payload'
  );
}
