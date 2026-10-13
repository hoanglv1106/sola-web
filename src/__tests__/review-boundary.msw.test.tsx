// @vitest-environment happy-dom
import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach, vi } from 'vitest';
import React from 'react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { apiClient } from '@/shared/api/api-client';
import { fetchVocabularyReviewQueue } from '@/modules/vocabulary/api/vocabulary-api';
import { fetchMistakeNotebook } from '@/modules/mistakes/api/mistakes-api';
import { VocabularyReviewSession } from '@/modules/vocabulary/components/VocabularyReviewSession';
import { PracticeMistakeRunner } from '@/modules/mistakes/components/PracticeMistakeRunner';
import { mockReviewQueueWords, mockVocabularyStats } from '@/mocks/vocabulary.mock';
import { mockMistakeItems, mockMistakeStats } from '@/mocks/mistakes.mock';
import { click, flush, render } from './helpers/dom';

vi.mock('next/navigation', () => ({
  usePathname: () => '/vocabulary/review',
  useRouter: () => ({ push: pushMock, replace: vi.fn(), prefetch: vi.fn() }),
}));

const pushMock = vi.fn();

/**
 * RV1 — the review session must load through the PRODUCTION typed boundary.
 *
 * Nothing here stubs the component, the hook or the fetcher: with
 * `NEXT_PUBLIC_USE_MOCK_DATA='false'` the session's real `fetchVocabularyReviewQueue`
 * goes over real `fetch` and is observed by MSW, so a direct fixture import
 * (the defect being repaired) cannot satisfy these assertions.
 */
const API_BASE = 'https://api.sola.test';
const server = setupServer();
const seen: string[] = [];

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_URL = API_BASE;
  process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'false';
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  seen.length = 0;
  pushMock.mockClear();
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

function track(path: string) {
  return `${API_BASE}${path}`;
}

/** Distinct, recognisable queue payload — never the bundled fixture. */
function queueWith(words: typeof mockReviewQueueWords) {
  return { words, stats: { ...mockVocabularyStats, totalWords: words.length } };
}

describe('RV1 — VocabularyReviewSession loads through the production boundary', () => {
  it('should request the review-queue endpoint and render the HTTP payload', async () => {
    const words = mockReviewQueueWords.map((word) => ({
      ...word,
      word: `HTTP_${word.word}`,
    }));

    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        seen.push('GET /vocabulary/review-queue');
        return HttpResponse.json(queueWith(words));
      })
    );

    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();
    await flush();

    // The request really happened, and the DISPLAYED word heading is the HTTP
    // word, not the bundled fixture spelling the component used to hardcode.
    // Scoped to the heading: the queue intentionally keeps the other fixture
    // words, so a whole-page absence assertion would be wrong.
    expect(seen).toEqual(['GET /vocabulary/review-queue']);

    const heading = container.querySelector('h2');
    expect(heading).not.toBeNull();
    expect(heading!.textContent).toBe(`HTTP_${mockReviewQueueWords[0].word}`);
    expect(heading!.textContent).not.toBe(mockReviewQueueWords[0].word);

    unmount();
  });

  it('should show a loading state, then the loaded word, before any request resolves', async () => {
    const gate: { release?: () => void } = {};
    server.use(
      http.get(track('/vocabulary/review-queue'), async () => {
        seen.push('GET /vocabulary/review-queue');
        await new Promise<void>((resolve) => {
          gate.release = resolve;
        });
        return HttpResponse.json(queueWith(mockReviewQueueWords));
      })
    );

    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();

    // Pending: an explicit loading surface, never an empty/finished session.
    expect(container.textContent).toMatch(/loading review queue/i);
    expect(container.textContent).not.toMatch(/session complete/i);

    expect(typeof gate.release).toBe('function');
    gate.release!();
    await flush();
    await flush();

    expect(container.textContent).not.toMatch(/loading review queue/i);
    expect(container.textContent).toContain(mockReviewQueueWords[0].word);
    unmount();
  });

  it('should surface an error state with a working retry instead of crashing', async () => {
    let attempt = 0;
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        attempt += 1;
        seen.push(`GET /vocabulary/review-queue#${attempt}`);
        if (attempt === 1) {
          return new HttpResponse('queue down', { status: 500 });
        }
        return HttpResponse.json(queueWith(mockReviewQueueWords));
      })
    );

    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();
    await flush();

    expect(seen).toEqual(['GET /vocabulary/review-queue#1']);
    expect(container.textContent).toMatch(/couldn'?t load your review queue/i);
    expect(container.textContent).toContain('queue down');

    const retry = Array.from(container.querySelectorAll('button')).find((button) =>
      /try again/i.test(button.textContent ?? '')
    );
    expect(retry).toBeDefined();
    click(retry!);
    await flush();
    await flush();

    expect(seen).toEqual([
      'GET /vocabulary/review-queue#1',
      'GET /vocabulary/review-queue#2',
    ]);
    expect(container.textContent).not.toMatch(/couldn'?t load/i);
    expect(container.textContent).toContain(mockReviewQueueWords[0].word);
    unmount();
  });

  it('should render a coherent empty state for a genuinely empty queue', async () => {
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        seen.push('GET /vocabulary/review-queue');
        return HttpResponse.json(queueWith([]));
      })
    );

    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();
    await flush();

    expect(seen).toEqual(['GET /vocabulary/review-queue']);
    expect(container.textContent).toMatch(/session complete/i);
    expect(container.textContent).not.toMatch(/couldn'?t load/i);
    unmount();
  });

  it('should persist a replay of the review action across a real HTTP reload', async () => {
    const words = mockReviewQueueWords.map((word) => ({ ...word }));
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        seen.push('GET /vocabulary/review-queue');
        return HttpResponse.json(queueWith(words));
      })
    );

    const first = render(React.createElement(VocabularyReviewSession));
    await flush();
    await flush();

    const know = Array.from(first.container.querySelectorAll('button')).find((button) =>
      /i know this/i.test(button.textContent ?? '')
    );
    expect(know).toBeDefined();
    click(know!);
    await flush();

    const stored = window.localStorage.getItem('sola_vocabulary_progress');
    expect(stored).toBeTruthy();
    first.unmount();

    // A fresh session re-fetches over HTTP and re-applies the persisted stage.
    const second = render(React.createElement(VocabularyReviewSession));
    await flush();
    await flush();
    expect(seen).toEqual([
      'GET /vocabulary/review-queue',
      'GET /vocabulary/review-queue',
    ]);
    expect(window.localStorage.getItem('sola_vocabulary_progress')).toBe(stored);
    second.unmount();
  });
});

describe('RV3 — required-payload policy at the typed adapter', () => {
  /**
   * 204/205 and empty bodies resolve to `undefined` in EVERY mode at the
   * transport layer (that generic behaviour is correct and must be retained).
   * These resources, however, have a REQUIRED typed payload, so the adapter must
   * turn that `undefined` into an explicit error rather than letting a component
   * dereference it during render.
   */
  it('should keep the generic apiClient 204 contract of resolving undefined', async () => {
    server.use(
      http.get(track('/no-content'), () => new HttpResponse(null, { status: 204 }))
    );

    const result = await apiClient<void>('/no-content');
    expect(result).toBeUndefined();
  });

  it('should reject a 204 review queue instead of normalising it to an empty success', async () => {
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        seen.push('GET /vocabulary/review-queue');
        return new HttpResponse(null, { status: 204 });
      })
    );

    await expect(fetchVocabularyReviewQueue()).rejects.toThrow(/no content/i);
  });

  it('should reject a 205 review queue', async () => {
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        seen.push('GET /vocabulary/review-queue');
        return new HttpResponse(null, { status: 205 });
      })
    );

    await expect(fetchVocabularyReviewQueue()).rejects.toThrow(/no content/i);
  });

  it('should reject an empty-body 200 review queue', async () => {
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        seen.push('GET /vocabulary/review-queue');
        return new HttpResponse('', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );

    await expect(fetchVocabularyReviewQueue()).rejects.toThrow(/no content/i);
  });

  it('should reject a malformed review-queue shape rather than faking an empty queue', async () => {
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        seen.push('GET /vocabulary/review-queue');
        return HttpResponse.json({ stats: mockVocabularyStats });
      })
    );

    await expect(fetchVocabularyReviewQueue()).rejects.toThrow(/unexpected payload/i);
  });

  it('should reject a 204 mistake notebook', async () => {
    server.use(
      http.get(track('/mistakes'), () => {
        seen.push('GET /mistakes');
        return new HttpResponse(null, { status: 204 });
      })
    );

    await expect(fetchMistakeNotebook()).rejects.toThrow(/no content/i);
  });

  it('should reject a malformed notebook shape', async () => {
    server.use(
      http.get(track('/mistakes'), () => {
        seen.push('GET /mistakes');
        return HttpResponse.json({ stats: mockMistakeStats });
      })
    );

    await expect(fetchMistakeNotebook()).rejects.toThrow(/unexpected payload/i);
  });

  it('should render a coherent error and retry in the review UI for a 204, without crashing', async () => {
    let attempt = 0;
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        attempt += 1;
        seen.push(`GET /vocabulary/review-queue#${attempt}`);
        if (attempt === 1) {
          return new HttpResponse(null, { status: 204 });
        }
        return HttpResponse.json(queueWith(mockReviewQueueWords));
      })
    );

    const { container, unmount } = render(React.createElement(VocabularyReviewSession));
    await flush();
    await flush();

    // The undefined payload became an explicit, retryable error — not a crash
    // and not a fake "session complete".
    expect(container.textContent).toMatch(/couldn'?t load your review queue/i);
    expect(container.textContent).not.toMatch(/session complete/i);

    const retry = Array.from(container.querySelectorAll('button')).find((button) =>
      /try again/i.test(button.textContent ?? '')
    );
    click(retry!);
    await flush();
    await flush();

    expect(container.textContent).not.toMatch(/couldn'?t load/i);
    expect(container.textContent).toContain(mockReviewQueueWords[0].word);
    unmount();
  });

  it('should render the notebook error banner and retry for a 204, without crashing', async () => {
    const { MistakesDashboard } = await import('@/modules/mistakes/components/MistakesDashboard');

    let attempt = 0;
    server.use(
      http.get(track('/mistakes'), () => {
        attempt += 1;
        seen.push(`GET /mistakes#${attempt}`);
        if (attempt === 1) {
          return new HttpResponse(null, { status: 204 });
        }
        return HttpResponse.json({ mistakes: mockMistakeItems, stats: mockMistakeStats });
      })
    );

    const { container, unmount } = render(React.createElement(MistakesDashboard));
    await flush();
    await flush();

    expect(container.textContent).toMatch(/couldn'?t load your mistake notebook/i);

    const retry = Array.from(container.querySelectorAll('button')).find((button) =>
      /try again/i.test(button.textContent ?? '')
    );
    click(retry!);
    await flush();
    await flush();

    expect(container.textContent).not.toMatch(/couldn'?t load/i);
    expect(container.textContent).toContain(mockMistakeItems[0].userAnswer);
    unmount();
  });
});

describe('RV4 — the runner follows the route id on a retained instance', () => {
  /**
   * `resourceKey` is the route id. Before the fix the loader was keyed only on
   * the reload token, so a retained runner kept rendering the previous drill
   * after a client-side id change — and a late reply for the OLD id could
   * overwrite the new one.
   */
  const drillA = {
    mistakeId: 'mis-A',
    category: 'grammar',
    userMistakeSentence: 'DRILL_A_MISTAKE',
    correctSentence: 'DRILL_A_CORRECT',
    mistakeHighlight: 'DRILL_A_MISTAKE',
    correctHighlight: 'DRILL_A_CORRECT',
    ruleExplanation: 'DRILL_A_RULE',
    moreExamples: [{ sentence: 'DRILL_A_EXAMPLE', isCorrect: true }],
    questions: [
      {
        questionNumber: 1,
        prompt: 'DRILL_A_PROMPT',
        options: [
          { key: 'A', text: 'DRILL_A_OPT_A', isCorrect: true },
          { key: 'B', text: 'DRILL_A_OPT_B', isCorrect: false },
        ],
        explanation: 'DRILL_A_Q_EXPL',
      },
    ],
  };

  const drillB = {
    ...drillA,
    mistakeId: 'mis-B',
    userMistakeSentence: 'DRILL_B_MISTAKE',
    correctSentence: 'DRILL_B_CORRECT',
    mistakeHighlight: 'DRILL_B_MISTAKE',
    correctHighlight: 'DRILL_B_CORRECT',
    ruleExplanation: 'DRILL_B_RULE',
    moreExamples: [{ sentence: 'DRILL_B_EXAMPLE', isCorrect: true }],
    questions: [
      {
        questionNumber: 1,
        prompt: 'DRILL_B_PROMPT',
        options: [
          { key: 'A', text: 'DRILL_B_OPT_A', isCorrect: true },
          { key: 'B', text: 'DRILL_B_OPT_B', isCorrect: false },
        ],
        explanation: 'DRILL_B_Q_EXPL',
      },
    ],
  };

  it('should show the new drill when the retained runner receives a new id', async () => {
    server.use(
      http.get(track('/mistakes/:id/drill'), ({ params }) => {
        const id = String(params.id);
        seen.push(`GET /mistakes/${id}/drill`);
        return HttpResponse.json({ drill: id === 'mis-A' ? drillA : drillB });
      })
    );

    const { container, rerender, unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-A' })
    );
    await flush();
    await flush();

    expect(seen).toEqual(['GET /mistakes/mis-A/drill']);
    expect(container.textContent).toContain('DRILL_A_MISTAKE');

    // Same component instance, new route id.
    rerender(React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-B' }));
    await flush();
    await flush();

    expect(seen).toEqual(['GET /mistakes/mis-A/drill', 'GET /mistakes/mis-B/drill']);
    expect(container.textContent).toContain('DRILL_B_MISTAKE');
    expect(container.textContent).not.toContain('DRILL_A_MISTAKE');
    unmount();
  });

  it('should ignore a late reply for the previous id after the key changes', async () => {
    const gateA: { release?: () => void } = {};

    server.use(
      http.get(track('/mistakes/:id/drill'), async ({ params }) => {
        const id = String(params.id);
        seen.push(`GET /mistakes/${id}/drill`);

        if (id === 'mis-A') {
          // Hold A open so it resolves AFTER B has already been rendered.
          await new Promise<void>((resolve) => {
            gateA.release = resolve;
          });
          return HttpResponse.json({ drill: drillA });
        }
        return HttpResponse.json({ drill: drillB });
      })
    );

    const { container, rerender, unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-A' })
    );
    await flush();

    // Switch to B while A is still in flight.
    rerender(React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-B' }));
    await flush();
    await flush();

    expect(seen).toEqual(['GET /mistakes/mis-A/drill', 'GET /mistakes/mis-B/drill']);
    expect(container.textContent).toContain('DRILL_B_MISTAKE');

    // A finally resolves: it must NOT overwrite B. The gate must genuinely have
    // been captured, otherwise this assertion would be skipped, not passed.
    expect(typeof gateA.release).toBe('function');
    gateA.release!();
    await flush();
    await flush();

    expect(container.textContent).toContain('DRILL_B_MISTAKE');
    expect(container.textContent).not.toContain('DRILL_A_MISTAKE');
    unmount();
  });

  it('should not reload or reset interaction when the same id is re-rendered', async () => {
    server.use(
      http.get(track('/mistakes/:id/drill'), ({ params }) => {
        seen.push(`GET /mistakes/${String(params.id)}/drill`);
        return HttpResponse.json({ drill: drillA });
      })
    );

    const { container, rerender, unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-A' })
    );
    await flush();
    await flush();
    expect(seen).toEqual(['GET /mistakes/mis-A/drill']);

    // Select an answer so the instance holds observable interaction state.
    const firstOption = Array.from(container.querySelectorAll('button')).find((button) =>
      /DRILL_A_OPT_A/.test(button.textContent ?? '')
    );
    expect(firstOption).toBeDefined();
    click(firstOption!);
    await flush();
    const afterClick = container.textContent;

    // Re-rendering with the SAME id must be inert: no extra request, and the
    // learner's answer is not thrown away.
    rerender(React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-A' }));
    await flush();
    await flush();

    expect(seen).toEqual(['GET /mistakes/mis-A/drill']);
    expect(container.textContent).toBe(afterClick);
    unmount();
  });

  it('should reset the previous drill state when the id changes', async () => {
    server.use(
      http.get(track('/mistakes/:id/drill'), ({ params }) => {
        const id = String(params.id);
        seen.push(`GET /mistakes/${id}/drill`);
        return HttpResponse.json({ drill: id === 'mis-A' ? drillA : drillB });
      })
    );

    const { container, rerender, unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-A' })
    );
    await flush();
    await flush();

    // Interact with A first.
    const optionA = Array.from(container.querySelectorAll('button')).find((button) =>
      /DRILL_A_OPT_A/.test(button.textContent ?? '')
    );
    click(optionA!);
    await flush();
    expect(container.textContent).toContain('DRILL_A_MISTAKE');

    rerender(React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-B' }));
    await flush();
    await flush();

    // B's content replaced A's entirely, and A's question/answer text is gone.
    expect(container.textContent).toContain('DRILL_B_MISTAKE');
    expect(container.textContent).not.toContain('DRILL_A_MISTAKE');
    expect(container.textContent).not.toContain('DRILL_A_OPT_A');
    expect(container.textContent).not.toContain('DRILL_A_MISTAKE');
    unmount();
  });

  it('should encode the id in the request path', async () => {
    server.use(
      http.get(track('/mistakes/:id/drill'), ({ request }) => {
        seen.push(new URL(request.url).pathname);
        return HttpResponse.json({ drill: null });
      })
    );

    const { unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: 'mis/x y' })
    );
    await flush();
    await flush();

    expect(seen).toEqual(['/mistakes/mis%2Fx%20y/drill']);
    unmount();
  });
});
