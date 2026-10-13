// @vitest-environment happy-dom
import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach, vi } from 'vitest';
import React from 'react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { PracticeMistakeRunner } from '@/modules/mistakes/components/PracticeMistakeRunner';
import { MistakesDashboard } from '@/modules/mistakes/components/MistakesDashboard';
import { MISTAKE_PROGRESS_STORAGE_KEY } from '@/modules/mistakes/model';
import { mockMistakeItems, mockMistakeStats } from '@/mocks/mistakes.mock';
import { click, findAll, flush, render } from './helpers/dom';

vi.mock('next/navigation', () => ({
  usePathname: () => '/mistakes',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

/**
 * QA-6: marking a mistake improved in the practice runner must be visible on the
 * notebook dashboard after navigation/remount and survive a reload.
 *
 * The improvement is driven by clicking the REAL button — nothing is seeded into
 * storage — and both sides read the same domain-scoped simulation store.
 */
const API_BASE = 'https://api.sola.test';
const server = setupServer();

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_URL = API_BASE;
  process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'false';
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  window.localStorage.clear();
  document.body.innerHTML = '';
});

afterAll(() => {
  server.close();
  delete process.env.NEXT_PUBLIC_USE_MOCK_DATA;
});

beforeEach(() => {
  window.localStorage.clear();
});

const TARGET_ID = 'mis-2';
const OTHER_ID = 'mis-1';

const drillFor = (id: string) => ({
  drill: {
    mistakeId: id,
    category: 'grammar',
    title: 'Article usage drill',
    currentStep: 1,
    totalSteps: 4,
    userMistakeSentence: 'I went to the hospital yesterday.',
    mistakeHighlight: 'the hospital',
    correctSentence: 'I went to a hospital yesterday.',
    correctHighlight: 'a hospital',
    ruleTitle: 'Indefinite article',
    ruleExplanation: 'Use "a" for any hospital in general.',
    moreExamples: [{ sentence: 'She is a doctor.', isCorrect: true }],
    confidenceScore: 60,
    questions: [
      {
        id: 'q-1',
        questionNumber: 1,
        prompt: 'Pick the correct sentence.',
        options: [
          { key: 'A', text: 'I went to a hospital.', isCorrect: true },
          { key: 'B', text: 'I went to the hospital.', isCorrect: false },
        ],
        explanation: 'Use "a hospital" when it is not specific.',
      },
    ],
  },
});

function notebookHandler() {
  return http.get(`${API_BASE}/mistakes`, () =>
    HttpResponse.json({ mistakes: mockMistakeItems, stats: mockMistakeStats })
  );
}

function drillHandler() {
  return http.get(`${API_BASE}/mistakes/:id/drill`, ({ params }) =>
    HttpResponse.json(drillFor(String(params.id)))
  );
}

/** Find the runner's "Mark as improved" control by its visible copy. */
function improvedToggle(container: HTMLElement): HTMLButtonElement {
  const button = findAll(container, 'button').find((candidate) =>
    /mark as improved|marked as improved/i.test(candidate.textContent ?? '')
  );
  expect(button).toBeDefined();
  return button as HTMLButtonElement;
}

describe('QA-6 — mistake improvement persists from drill to dashboard', () => {
  it('should show the improvement on the dashboard after marking it in the drill', async () => {
    server.use(drillHandler(), notebookHandler());

    // 1. Practice drill: mark the mistake improved through the real button.
    const drill = render(React.createElement(PracticeMistakeRunner, { mistakeId: TARGET_ID }));
    await flush();
    await flush();

    const toggle = improvedToggle(drill.container);
    expect(toggle.textContent).toMatch(/mark as improved/i);
    click(toggle);
    await flush();

    // The button reflects the persisted state.
    expect(improvedToggle(drill.container).textContent).toMatch(/marked as improved/i);

    // It went to the domain store, not just local component state.
    const stored = JSON.parse(
      window.localStorage.getItem(MISTAKE_PROGRESS_STORAGE_KEY) ?? '{}'
    ) as { improvedIds?: string[] };
    expect(stored.improvedIds).toContain(TARGET_ID);

    // 2. Navigate away: unmount the drill, then mount the dashboard fresh.
    drill.unmount();

    const dashboard = render(React.createElement(MistakesDashboard));
    await flush();
    await flush();

    // 3. The targeted item shows the improved badge and a reduced "seen" count
    //    (markMistakeImproved decrements timesSeen).
    const target = mockMistakeItems.find((m) => m.id === TARGET_ID)!;
    expect(target.isImproved).toBeUndefined(); // the fixture itself was not mutated

    const badges = findAll(dashboard.container, '[data-testid="improved-badge"]');
    expect(badges.length).toBe(1);
    expect(dashboard.container.textContent).toContain(`Seen ${target.timesSeen - 1} times`);

    // The resolution rate reflects exactly one of two items improved.
    const rate = dashboard.container.querySelector('[data-testid="resolution-rate"]');
    expect(rate?.textContent).toContain(
      `${Math.round((1 / mockMistakeItems.length) * 100)}% improved`
    );

    // 4. The unrelated item is untouched.
    const other = mockMistakeItems.find((m) => m.id === OTHER_ID)!;
    expect(dashboard.container.textContent).toContain(`Seen ${other.timesSeen} times`);

    dashboard.unmount();
  });

  it('should survive a full remount (reload) and keep unrelated items unchanged', async () => {
    server.use(drillHandler(), notebookHandler());

    const drill = render(React.createElement(PracticeMistakeRunner, { mistakeId: TARGET_ID }));
    await flush();
    await flush();
    click(improvedToggle(drill.container));
    await flush();
    drill.unmount();

    // First dashboard visit.
    const first = render(React.createElement(MistakesDashboard));
    await flush();
    await flush();
    expect(findAll(first.container, '[data-testid="improved-badge"]').length).toBe(1);
    first.unmount();

    // Remount from scratch — storage is the only carrier of the state.
    const second = render(React.createElement(MistakesDashboard));
    await flush();
    await flush();
    expect(findAll(second.container, '[data-testid="improved-badge"]').length).toBe(1);

    const other = mockMistakeItems.find((m) => m.id === OTHER_ID)!;
    expect(second.container.textContent).toContain(`Seen ${other.timesSeen} times`);
    second.unmount();
  });

  it('should be idempotent when the improvement is toggled on twice', async () => {
    server.use(drillHandler(), notebookHandler());

    const drill = render(React.createElement(PracticeMistakeRunner, { mistakeId: TARGET_ID }));
    await flush();
    await flush();

    click(improvedToggle(drill.container));
    await flush();
    // Toggling again un-marks it; toggling a third time re-marks it.
    click(improvedToggle(drill.container));
    await flush();
    click(improvedToggle(drill.container));
    await flush();

    const stored = JSON.parse(
      window.localStorage.getItem(MISTAKE_PROGRESS_STORAGE_KEY) ?? '{}'
    ) as { improvedIds?: string[] };
    // Exactly one entry despite three clicks — no duplicates.
    expect(stored.improvedIds).toEqual([TARGET_ID]);

    drill.unmount();

    const dashboard = render(React.createElement(MistakesDashboard));
    await flush();
    await flush();
    expect(findAll(dashboard.container, '[data-testid="improved-badge"]').length).toBe(1);
    dashboard.unmount();
  });

  it('should not mark anything when storage is empty', async () => {
    server.use(notebookHandler());

    const dashboard = render(React.createElement(MistakesDashboard));
    await flush();
    await flush();

    expect(findAll(dashboard.container, '[data-testid="improved-badge"]').length).toBe(0);
    const rate = dashboard.container.querySelector('[data-testid="resolution-rate"]');
    expect(rate?.textContent).toContain('0% improved');
    dashboard.unmount();
  });
});
