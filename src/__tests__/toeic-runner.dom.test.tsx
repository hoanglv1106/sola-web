// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { mockToeicSession } from '@/mocks/exams.mock';
import { MOCK_SESSION_STORAGE_KEY } from '@/modules/learner';
import { click, findAll, flush, render } from './helpers/dom';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/exams/toeic/tests/toeic-part-1',
}));

// next/image requires the Next runtime; render a plain <img> in tests.
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement('img', { src: String(props.src ?? ''), alt: String(props.alt ?? '') }),
}));

// Short-duration session so the production countdown can reach zero quickly.
// Only the fixture is swapped; the production timer, expiry and scoring run.
const shortSession = { ...mockToeicSession, timeRemainingSeconds: 3 };
vi.mock('@/mocks/exams.mock', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/mocks/exams.mock')>();
  return { ...actual, mockToeicSession: { ...actual.mockToeicSession, timeRemainingSeconds: 3 } };
});

const { ToeicPracticeTestRunner } = await import(
  '@/modules/exams/toeic/components/ToeicPracticeTestRunner'
);

function findByText(container: HTMLElement, text: string): HTMLElement | null {
  return (
    findAll(container, 'button').find((button) =>
      (button.textContent ?? '').includes(text)
    ) ?? null
  );
}

describe('ToeicPracticeTestRunner — timer expiry and answer locking', () => {
  beforeEach(() => {
    pushMock.mockClear();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    window.sessionStorage.clear();
    window.sessionStorage.setItem(
      MOCK_SESSION_STORAGE_KEY,
      JSON.stringify({ name: 'Alex Nguyen', email: 'alex@example.com' })
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    window.sessionStorage.clear();
  });

  it('should show the fixture countdown initially', async () => {
    const { container, unmount } = render(React.createElement(ToeicPracticeTestRunner));
    await flush();

    // 3s => 00:03 (same production formatter used in the UI)
    expect(container.textContent).toContain('00:03');
    unmount();
  });

  it('should finalize and lock answers exactly once when the timer reaches zero', async () => {
    const { container, unmount } = render(React.createElement(ToeicPracticeTestRunner));
    await flush();

    // Advance well past the remaining time (582s + margin).
    await vi.advanceTimersByTimeAsync(
      (shortSession.timeRemainingSeconds + 30) * 1000
    );
    await flush();

    // Expiry submits once and shows the results modal.
    expect(container.textContent).toContain('Time expired');
    // Exact "n / total Correct" — a bare "<total> Correct" would match the
    // denominator and could pass with any numerator.
    const total = mockToeicSession.questions.length;
    const expiredScore = (container.textContent ?? '')
      .replace(/\s+/g, ' ')
      .match(/(\d+) \/ (\d+) Correct/);
    expect(expiredScore).not.toBeNull();
    expect(Number(expiredScore?.[2])).toBe(total);
    expect(Number(expiredScore?.[1])).toBeLessThan(total);
    // Unanswered questions are reported, not silently ignored.
    expect(container.textContent).toContain('unanswered');

    unmount();
  });

  it('should not double-submit when more time passes after expiry', async () => {
    const { container, unmount } = render(React.createElement(ToeicPracticeTestRunner));
    await flush();

    await vi.advanceTimersByTimeAsync(
      (shortSession.timeRemainingSeconds + 10) * 1000
    );
    await flush();
    const firstModalCount = findAll(container, '[role="dialog"]').length +
      (container.textContent?.match(/Time expired/g) ?? []).length;

    await vi.advanceTimersByTimeAsync(120 * 1000);
    await flush();
    const secondModalCount = findAll(container, '[role="dialog"]').length +
      (container.textContent?.match(/Time expired/g) ?? []).length;

    expect(secondModalCount).toBe(firstModalCount);
    unmount();
  });

  it('should pause the countdown and resume without losing remaining time', async () => {
    const { container, unmount } = render(React.createElement(ToeicPracticeTestRunner));
    await flush();

    click(findByText(container, 'Pause'));
    await flush();
    expect(container.textContent).toContain('Test Paused');

    // Time does not move while paused, even if wall-clock time passes.
    await vi.advanceTimersByTimeAsync(60 * 1000);
    await flush();
    expect(container.textContent).toContain('remaining time (00:03)');

    click(findByText(container, 'Resume Test'));
    await flush();

    await vi.advanceTimersByTimeAsync(1000);
    await flush();
    expect(container.textContent).toContain('00:02');

    // The paused interval was cleared: exactly one tick was consumed.
    await vi.advanceTimersByTimeAsync(1000);
    await flush();
    expect(container.textContent).toContain('00:01');
    unmount();
  });

  it('should freeze answers and the exact score after a manual submit', async () => {
    const { container, unmount } = render(React.createElement(ToeicPracticeTestRunner));
    await flush();

    const total = mockToeicSession.questions.length;
    const firstOptions = findAll(container, '[aria-pressed]');

    // Answer question 1 CORRECTLY (option B is the fixture's correctAnswer).
    const correctOption = firstOptions.find((option) =>
      (option.getAttribute('aria-label') ?? '').includes('B')
    );
    expect(correctOption).toBeDefined();
    click(correctOption ?? null);
    await flush();

    // Walk to the final question through the real "Next question" control only.
    for (let index = 1; index < total; index += 1) {
      const next = findByText(container, 'Next question');
      expect(next).not.toBeNull();
      click(next);
      await flush();
    }

    // The final step must expose the submit control — asserted, never skipped.
    const submit = findByText(container, 'Submit test');
    expect(submit).not.toBeNull();
    click(submit);
    await flush();

    // Frozen: exactly 1 of `total` correct, rendered as "<n> / <total> Correct".
    const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
    const textAfterSubmit = normalize(container.textContent ?? '');
    expect(textAfterSubmit).toContain(`1 / ${total} Correct`);

    // Every option is locked after submit.
    const lockedOptions = findAll(container, '[aria-pressed]');
    expect(lockedOptions.length).toBeGreaterThan(0);
    expect(lockedOptions.every((option) => option.hasAttribute('disabled'))).toBe(true);

    // Attempt to mutate answers after submit — the score must not move.
    const wrongOption = lockedOptions.find((option) =>
      (option.getAttribute('aria-label') ?? '').includes('C')
    );
    click(wrongOption ?? null);
    await flush();
    const textAfterMutation = normalize(container.textContent ?? '');
    expect(textAfterMutation).toContain(`1 / ${total} Correct`);

    // Advancing the clock past zero must not resubmit or change the score.
    await vi.advanceTimersByTimeAsync((shortSession.timeRemainingSeconds + 5) * 1000);
    await flush();
    const textAfterExpiry = normalize(container.textContent ?? '');
    expect(textAfterExpiry).toContain(`1 / ${total} Correct`);
    // Manual submit happened first, so the auto-submit notice must NOT appear.
    expect(textAfterExpiry).not.toContain('submitted automatically');
    expect((container.textContent?.match(/Correct/g) ?? []).length).toBeGreaterThan(0);

    unmount();
  });

  it('should freeze answers and the exact score when the timer expires', async () => {
    const { container, unmount } = render(React.createElement(ToeicPracticeTestRunner));
    await flush();

    const total = mockToeicSession.questions.length;
    const answersBefore = findAll(container, '[aria-pressed]').length;

    // Let the timer expire without a manual submit.
    await vi.advanceTimersByTimeAsync((shortSession.timeRemainingSeconds + 5) * 1000);
    await flush();

    const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
    const scoreOf = (value: string) =>
      normalize(value).match(/(\d+) \/ (\d+) Correct/)?.[0] ?? null;

    expect(container.textContent).toContain('Time expired');
    // The auto-submit notice is present for the expiry path.
    expect(container.textContent).toContain('submitted automatically');

    const scoreAtExpiry = scoreOf(container.textContent ?? '');
    expect(scoreAtExpiry).not.toBeNull();
    expect(scoreAtExpiry?.endsWith(`/ ${total} Correct`)).toBe(true);

    // Expiry must lock every option.
    const lockedOptions = findAll(container, '[aria-pressed]');
    expect(lockedOptions.length).toBe(answersBefore);
    expect(lockedOptions.every((option) => option.hasAttribute('disabled'))).toBe(true);

    // Attempt to change answers after expiry — the score must stay frozen.
    for (const option of lockedOptions) {
      click(option);
      await flush();
    }
    expect(scoreOf(container.textContent ?? '')).toBe(scoreAtExpiry);

    // And more time passing must not resubmit or change the score.
    await vi.advanceTimersByTimeAsync(10_000);
    await flush();
    expect(scoreOf(container.textContent ?? '')).toBe(scoreAtExpiry);
    expect((container.textContent?.match(/Time expired/g) ?? []).length).toBe(1);

    unmount();
  });

  it('should present each option as an accessible pressed button', async () => {
    const { container, unmount } = render(React.createElement(ToeicPracticeTestRunner));
    await flush();

    const question = mockToeicSession.questions[0];
    const option = findAll(container, '[aria-pressed]')[0];
    expect(option.getAttribute('aria-label')).toContain('Option');
    expect(option.tagName).toBe('BUTTON');
    expect(question.options.length).toBeGreaterThan(0);
    unmount();
  });

  it('should use the stored mock profile name in the results modal', async () => {
    const { container, unmount } = render(React.createElement(ToeicPracticeTestRunner));
    await flush();

    await vi.advanceTimersByTimeAsync(
      (shortSession.timeRemainingSeconds + 5) * 1000
    );
    await flush();

    expect(container.textContent).toContain('Alex');
    unmount();
  });
});
