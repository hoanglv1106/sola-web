// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { mockTodaySession } from '@/mocks/learning.mock';
import { TodaySessionRunner } from '@/modules/learning/components/TodaySessionRunner';
import { findAll, find, flush, pressKey, render } from './helpers/dom';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/session/today',
}));

const step = mockTodaySession.steps[0];

/** Dispatch a real click (the helper only takes a node, so wrap React state). */
async function clickElement(element: Element | null) {
  const { click } = await import('./helpers/dom');
  click(element);
  await flush();
}

function optionButtons(container: HTMLElement, questionIndex: number): HTMLElement[] {
  const groups = findAll(container, '[role="radiogroup"]');
  return Array.from(groups[questionIndex].querySelectorAll<HTMLElement>('[role="radio"]'));
}

describe('TodaySessionRunner — real grading', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render every question with no answer pre-selected', async () => {
    const { container, unmount } = render(React.createElement(TodaySessionRunner));
    await flush();

    expect(findAll(container, '[role="radiogroup"]')).toHaveLength(step.questions.length);
    for (const radio of findAll(container, '[role="radio"]')) {
      expect(radio.getAttribute('aria-checked')).toBe('false');
    }
    // No result banner until the learner checks.
    expect(container.textContent).not.toContain('grammatically accurate');
    unmount();
  });

  it('should not report "all correct" when the learner picked a wrong option', async () => {
    const { container, unmount } = render(React.createElement(TodaySessionRunner));
    await flush();

    const first = step.questions[0];
    const wrongIndex = first.options.findIndex((option) => option !== first.correctAnswer);
    await clickElement(optionButtons(container, 0)[wrongIndex]);

    const check = Array.from(container.querySelectorAll('button')).find((button) =>
      (button.textContent ?? '').includes('Check answers')
    );
    await clickElement(check ?? null);

    expect(container.textContent).toContain(`0/${step.questions.length} correct`);
    expect(container.textContent).not.toContain('grammatically accurate');
    unmount();
  });

  it('should report all correct only when every answer matches the fixture', async () => {
    const { container, unmount } = render(React.createElement(TodaySessionRunner));
    await flush();

    const { click } = await import('./helpers/dom');
    step.questions.forEach((question, index) => {
      const correctIndex = question.options.indexOf(question.correctAnswer);
      click(optionButtons(container, index)[correctIndex]);
    });
    await flush();

    const check = Array.from(container.querySelectorAll('button')).find((button) =>
      (button.textContent ?? '').includes('Check answers')
    );
    await clickElement(check ?? null);

    expect(container.textContent).toContain('grammatically accurate');
    expect(container.textContent).not.toContain('unanswered');
    unmount();
  });

  it('should invalidate the result when an answer is edited after checking', async () => {
    const { container, unmount } = render(React.createElement(TodaySessionRunner));
    await flush();

    // 1. All correct -> checked shows success.
    const { click } = await import('./helpers/dom');
    step.questions.forEach((question, index) => {
      const correctIndex = question.options.indexOf(question.correctAnswer);
      click(optionButtons(container, index)[correctIndex]);
    });
    await flush();

    const check = Array.from(container.querySelectorAll('button')).find((button) =>
      (button.textContent ?? '').includes('Check answers')
    );
    await clickElement(check ?? null);
    expect(container.textContent).toContain('grammatically accurate');

    // 2. Edit one answer -> the stale success verdict must disappear.
    const first = step.questions[0];
    const wrongIndex = first.options.findIndex((option) => option !== first.correctAnswer);
    await clickElement(optionButtons(container, 0)[wrongIndex]);

    expect(container.textContent).not.toContain('grammatically accurate');
    expect(find(container, '[role="status"]')).toBeNull();

    // 3. Re-check now reports the true score: three of four are still correct.
    await clickElement(check ?? null);
    expect(container.textContent).toContain(
      `${step.questions.length - 1}/${step.questions.length} correct`
    );
    expect(container.textContent).toContain(`review: ${first.id}`);
    unmount();
  });

  it('should expose radio semantics and arrow-key navigation', async () => {
    const { container, unmount } = render(React.createElement(TodaySessionRunner));
    await flush();

    const buttons = optionButtons(container, 0);
    // Exactly one tab stop (roving tabindex) for the group.
    expect(buttons.filter((button) => button.tabIndex === 0)).toHaveLength(1);

    buttons[0].focus();
    pressKey('ArrowRight', buttons[0]);
    await flush();

    expect(optionButtons(container, 0)[1].getAttribute('aria-checked')).toBe('true');
    unmount();
  });

  it('should keep the next-activity route unchanged', async () => {
    const { container, unmount } = render(React.createElement(TodaySessionRunner));
    await flush();

    const next = Array.from(container.querySelectorAll('button')).find((button) =>
      (button.textContent ?? '').includes('Next')
    );
    await clickElement(next ?? null);

    expect(pushMock).toHaveBeenCalledWith('/tutor/sessions/meeting-idea');
    unmount();
  });
});
