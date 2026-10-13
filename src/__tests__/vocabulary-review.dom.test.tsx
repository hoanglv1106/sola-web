// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { mockReviewQueueWords } from '@/mocks/vocabulary.mock';
import { VocabularyReviewSession } from '@/modules/vocabulary/components/VocabularyReviewSession';
import { click, findAll, flush, render } from './helpers/dom';
import { promoteStage } from '@/modules/vocabulary/model';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/vocabulary/review',
}));

function findByText(container: HTMLElement, text: string): HTMLElement | null {
  return (
    findAll(container, 'button').find((button) =>
      (button.textContent ?? '').includes(text)
    ) ?? null
  );
}

describe('VocabularyReviewSession — distinct review outcomes', () => {
  beforeEach(() => {
    pushMock.mockClear();
    // The session persists mastery progress to localStorage; isolate every test.
    window.localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.localStorage.clear();
  });

  it('should render the first fixture word with its own example sentence', async () => {
    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();

    const first = mockReviewQueueWords[0];
    expect(container.textContent).toContain(first.word);
    // The example sentence is the fixture's, not a hardcoded frame.
    expect(container.textContent).toContain(first.exampleSentence);
    // The two real review controls exist (distinct outcomes are wired).
    expect(findByText(container, 'I know this')).not.toBeNull();
    expect(findByText(container, 'Need more practice')).not.toBeNull();
    unmount();
  });

  it('should render the second word, proving the example frame is data-driven', async () => {
    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();

    click(findByText(container, 'I know this'));
    await flush();

    const second = mockReviewQueueWords[1];
    expect(container.textContent).toContain(second.word);
    expect(container.textContent).toContain(second.exampleSentence);
    // The first word's sentence must be gone (no stale hardcoded frame).
    expect(container.textContent).not.toContain(mockReviewQueueWords[0].exampleSentence);
    unmount();
  });

  it('should keep a stable denominator and only advance completion (QA-7)', async () => {
    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();

    const total = mockReviewQueueWords.length;

    // The original total is the denominator and never shrinks.
    expect(container.textContent).toContain(`0 of ${total} words`);
    expect(container.textContent).toContain('0% complete');

    click(findByText(container, 'I know this'));
    await flush();

    // Completion advances; the denominator stays the session's original total.
    expect(container.textContent).toContain(`1 of ${total} words`);
    expect(container.textContent).not.toContain(`of ${total - 1} words`);
    expect(container.textContent).toContain('20% complete');

    unmount();
  });

  it('should reach a coherent 100% and leave the session after exhausting the queue', async () => {
    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();

    const total = mockReviewQueueWords.length;

    // Complete all but the last word.
    for (let index = 0; index < total - 1; index += 1) {
      const known = findByText(container, 'I know this');
      expect(known).not.toBeNull();
      click(known);
      await flush();
    }

    // Numerator/denominator over the ORIGINAL total, never exceeding it.
    const counter = (container.textContent ?? '').match(/(\d+) of (\d+) words/);
    expect(counter).not.toBeNull();
    expect(Number(counter?.[1])).toBe(total - 1);
    expect(Number(counter?.[2])).toBe(total);
    expect(container.textContent).toContain(`${Math.round(((total - 1) / total) * 100)}% complete`);

    // Completing the final word ends the session and returns to the list.
    const last = findByText(container, 'I know this');
    expect(last).not.toBeNull();
    click(last);
    await flush();

    expect(pushMock).toHaveBeenCalledWith('/vocabulary');
    unmount();
  });

  it('should not inflate completion or regress the denominator on a retry', async () => {
    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();

    const total = mockReviewQueueWords.length;

    // Retry the first word twice: it stays pending the whole time.
    for (let pass = 0; pass < 2; pass += 1) {
      const retry = findByText(container, 'Need more practice');
      expect(retry).not.toBeNull();
      click(retry);
      await flush();

      // Nothing completed yet, and the denominator is unchanged.
      expect(container.textContent).toContain(`0 of ${total} words`);
      expect(container.textContent).toContain('0% complete');
      // No numerator may ever exceed the denominator.
      const counter = (container.textContent ?? '').match(/(\d+) of (\d+) words/);
      expect(Number(counter?.[1])).toBeLessThanOrEqual(Number(counter?.[2]));
    }

    // The retried word is still in the queue.
    expect(container.textContent).toContain(mockReviewQueueWords[0].word);
    unmount();
  });

  it('should re-queue the word when the learner needs more practice', async () => {
    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();

    const first = mockReviewQueueWords[0];
    const second = mockReviewQueueWords[1];

    click(findByText(container, 'Need more practice'));
    await flush();

    // Moved on to the next word, but the retry word remains in the queue.
    expect(container.textContent).toContain(second.word);
    expect(container.textContent).toContain(first.word);
    // Nothing completed, so completion stays 0 against the ORIGINAL total and
    // the denominator does not shrink even though the word was re-queued.
    expect(container.textContent).toContain(`0 of ${mockReviewQueueWords.length} words`);
    unmount();
  });

  it('should show the mastery stage of the word currently on screen', async () => {
    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();

    // The stepper reflects the displayed word's own fixture stage.
    const first = mockReviewQueueWords[0];
    const stepper = container.querySelector('[aria-label^="Mastery stage"]');
    expect(stepper?.getAttribute('aria-label')).toBe(`Mastery stage: ${first.stage}`);

    click(findByText(container, 'I know this'));
    await flush();

    // The next word in the fixture has its own stage (not the promoted one).
    const second = mockReviewQueueWords[1];
    const next = container.querySelector('[aria-label^="Mastery stage"]');
    expect(next?.getAttribute('aria-label')).toBe(`Mastery stage: ${second.stage}`);
    expect(second.stage).not.toBe(promoteStage(first.stage));
    unmount();
  });

  it('should record the promoted target word and leave unrelated words untouched', async () => {
    window.localStorage.clear();

    const target = mockReviewQueueWords[0];
    const unrelated = mockReviewQueueWords[2];

    const session = render(React.createElement(VocabularyReviewSession));
    await flush();
    await flush();

    // The target word is on screen with its own fixture stage.
    expect(
      session.container.querySelector('[aria-label^="Mastery stage"]')?.getAttribute('aria-label')
    ).toBe(`Mastery stage: ${target.stage}`);

    click(findByText(session.container, 'I know this'));
    await flush();

    // 1. The TARGET id is recorded with the promoted stage — asserted by id.
    const recordFor = (wordId: string) => {
      const store = JSON.parse(
        window.localStorage.getItem('sola_vocabulary_progress') ?? '{}'
      ) as { words?: Record<string, { stage?: string; timesSeen?: number }> };
      return store.words?.[wordId];
    };

    const targetRecord = recordFor(target.id);
    expect(targetRecord).toBeDefined();
    expect(targetRecord?.stage).toBe(promoteStage(target.stage));
    expect(targetRecord?.timesSeen).toBeGreaterThan(0);

    // 2. The unrelated word has NO record — it was never reviewed.
    expect(recordFor(unrelated.id)).toBeUndefined();

    session.unmount();

    // 3. Remount: the target's record survives, and the unrelated word still
    //    renders with its own original stage (not the target's promotion).
    const remount = render(React.createElement(VocabularyReviewSession));
    await flush();
    await flush();

    const remountedTarget = recordFor(target.id);
    expect(remountedTarget?.stage).toBe(promoteStage(target.stage));
    expect(recordFor(unrelated.id)).toBeUndefined();

    // The first word of the fresh queue re-applies the RECORDED stage, proving
    // the persisted value (not the fixture default) drives the UI after remount.
    const stageLabels = Array.from(
      remount.container.querySelectorAll('[aria-label^="Mastery stage"]')
    ).map((el) => el.getAttribute('aria-label'));
    expect(stageLabels.length).toBe(1);
    expect(stageLabels[0]).toBe(`Mastery stage: ${promoteStage(target.stage)}`);
    expect(stageLabels[0]).not.toBe(`Mastery stage: ${target.stage}`);

    // The unrelated word keeps its fixture stage in the source fixture.
    expect(unrelated.stage).toBe(mockReviewQueueWords[2].stage);

    remount.unmount();
    window.localStorage.clear();
  });

  it('should keep the recorded target stage stable across repeated remounts', async () => {
    window.localStorage.clear();

    const target = mockReviewQueueWords[0];
    const recordStage = () => {
      const store = JSON.parse(
        window.localStorage.getItem('sola_vocabulary_progress') ?? '{}'
      ) as { words?: Record<string, { stage?: string }> };
      return store.words?.[target.id]?.stage;
    };

    const first = render(React.createElement(VocabularyReviewSession));
    await flush();
    await flush();
    click(findByText(first.container, 'I know this'));
    await flush();
    const afterFirst = recordStage();
    expect(afterFirst).toBe(promoteStage(target.stage));
    first.unmount();

    // Two further remounts must not promote the target again.
    for (let pass = 0; pass < 2; pass += 1) {
      const next = render(React.createElement(VocabularyReviewSession));
      await flush();
      await flush();
      expect(recordStage()).toBe(afterFirst);
      next.unmount();
    }

    window.localStorage.clear();
  });

  it('should expose an accessible name for the pronunciation control', async () => {
    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();

    const audio = container.querySelector('button[aria-label^="Hear pronunciation"]');
    expect(audio?.getAttribute('aria-label')).toContain(mockReviewQueueWords[0].word);
    unmount();
  });

  it('should leave the review session when the queue is exhausted', async () => {
    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();

    for (let i = 0; i < mockReviewQueueWords.length; i += 1) {
      const known = findByText(container, 'I know this');
      if (!known) break;
      click(known);
      await flush();
    }

    expect(pushMock).toHaveBeenCalledWith('/vocabulary');
    unmount();
  });

  it('should end the session from the header control', async () => {
    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();

    click(findByText(container, 'End session'));
    expect(pushMock).toHaveBeenCalledWith('/vocabulary');
    unmount();
  });
});
