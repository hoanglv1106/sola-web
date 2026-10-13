import { describe, it, expect } from 'vitest';
import { mockReviewQueueWords } from '@/mocks/vocabulary.mock';
// Production domain logic (no test-local reimplementation).
import {
  promoteStage,
  demoteStage,
  calculateMasteryPercentage,
  buildExampleSentenceView,
  splitOnHighlight,
  createReviewQueue,
  applyQueueOutcome,
  createWordReviewState,
  applyReviewOutcome,
} from '@/modules/vocabulary/model';
import type { VocabularyWord } from '@/modules/vocabulary/types';

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

describe('Vocabulary review queue (bounded retry)', () => {
  it('should give "I know this" and "Need more practice" different outcomes', () => {
    const words = mockReviewQueueWords.slice(0, 3);
    const base = createReviewQueue(words);

    const known = applyQueueOutcome(base, 'known');
    const retry = applyQueueOutcome(base, 'needs_practice');

    // Known retires the word for this session.
    expect(known.retried).toBe(false);
    expect(known.queue.order).not.toContain(words[0].id);
    expect(known.queue.states[words[0].id].stage).toBe('familiar');

    // Needs-practice keeps it in the queue and moves the stage down.
    expect(retry.retried).toBe(true);
    expect(retry.queue.order).toContain(words[0].id);
    expect(retry.queue.states[words[0].id].stage).toBe('new');
  });

  it('should bound mastery stages in both directions', () => {
    const mastered = createWordReviewState({ ...mockReviewQueueWords[0], stage: 'mastered' });
    expect(applyReviewOutcome(mastered, 'known').stage).toBe('mastered');

    const fresh = createWordReviewState({ ...mockReviewQueueWords[0], stage: 'new' });
    expect(applyReviewOutcome(fresh, 'needs_practice').stage).toBe('new');
  });

  it('should re-queue a retried word at a bounded offset, not immediately', () => {
    const words = mockReviewQueueWords.slice(0, 4);
    const queue = createReviewQueue(words);
    const result = applyQueueOutcome(queue, 'needs_practice', 2);

    // Word moves back by the retry offset instead of repeating instantly.
    expect(result.queue.order[0]).not.toBe(words[0].id);
    expect(result.queue.order[2]).toBe(words[0].id);
    expect(result.queue.order).toHaveLength(words.length);
  });

  it('should report completion only when the queue is exhausted by known words', () => {
    let queue = createReviewQueue(mockReviewQueueWords.slice(0, 2));
    let completed = false;

    while (queue.order.length > 0) {
      const result = applyQueueOutcome(queue, 'known');
      queue = result.queue;
      completed = result.completed;
    }

    expect(completed).toBe(true);
    expect(queue.order).toHaveLength(0);
  });

  it('should handle an empty queue without throwing', () => {
    const empty = createReviewQueue([]);
    const result = applyQueueOutcome(empty, 'known');
    expect(result.completed).toBe(true);
    expect(result.retried).toBe(false);
  });

  it('should keep the mock fixture immutable across reviews', () => {
    const before = JSON.stringify(mockReviewQueueWords);
    const queue = createReviewQueue(mockReviewQueueWords);
    applyQueueOutcome(queue, 'needs_practice');
    applyQueueOutcome(queue, 'known');
    expect(JSON.stringify(mockReviewQueueWords)).toBe(before);
  });

  it('should never drop or duplicate words while retrying', () => {
    const words = mockReviewQueueWords.slice(0, 3);
    let queue = createReviewQueue(words);
    for (let i = 0; i < 6; i += 1) {
      queue = applyQueueOutcome(queue, 'needs_practice').queue;
    }
    expect([...queue.order].sort()).toEqual(words.map((w) => w.id).sort());
  });
});

describe('Vocabulary example sentence rendering', () => {
  it('should highlight the matching word from the word fixture', () => {
    const word = mockReviewQueueWords[0];
    const view = buildExampleSentenceView(word);
    expect(view.sentence).toBe(word.exampleSentence);
    expect(view.focus).toBe(word.highlightedWord);
    expect(view.highlightMissing).toBe(false);
  });

  it('should highlight an inflected form that matches the fixture sentence', () => {
    // w-2's highlightedWord is "perspectives" inside its own sentence.
    const word = mockReviewQueueWords[1];
    const segments = splitOnHighlight(word.exampleSentence, word.highlightedWord);
    const highlighted = segments.filter((s) => s.highlighted).map((s) => s.text);
    expect(highlighted).toEqual(['perspectives']);
    expect(buildExampleSentenceView(word).highlightMissing).toBe(false);
  });

  it('should flag a highlight that does not occur in the sentence', () => {
    const broken: VocabularyWord = {
      ...mockReviewQueueWords[0],
      highlightedWord: 'not-in-this-sentence',
    };
    const view = buildExampleSentenceView(broken);
    expect(view.highlightMissing).toBe(true);
    expect(view.sentence).toBe(broken.exampleSentence);
  });

  it('should detect a sentence that repeats the highlighted word', () => {
    const repeated: VocabularyWord = {
      ...mockReviewQueueWords[0],
      word: 'growth',
      highlightedWord: 'growth',
      exampleSentence: 'Growth mindset means growth every day.',
    };
    const view = buildExampleSentenceView(repeated);
    expect(view.hasRepeatedHighlight).toBe(true);
    const highlighted = splitOnHighlight(repeated.exampleSentence, 'growth').filter(
      (s) => s.highlighted
    );
    expect(highlighted).toHaveLength(2);
  });

  it('should handle an empty or missing sentence without inventing a frame', () => {
    const blank: VocabularyWord = {
      ...mockReviewQueueWords[0],
      exampleSentence: '',
    };
    const view = buildExampleSentenceView(blank);
    expect(view.sentence).toBe('');
    expect(view.focus).toBeNull();
    expect(splitOnHighlight('', 'x')).toEqual([]);
  });

  it('should not emit an empty highlighted segment for an empty highlight', () => {
    const segments = splitOnHighlight('A plain sentence.', '');
    expect(segments).toEqual([{ text: 'A plain sentence.', highlighted: false }]);
  });
});
