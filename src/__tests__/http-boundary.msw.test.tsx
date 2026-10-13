// @vitest-environment happy-dom
import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach, vi } from 'vitest';
import React from 'react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { apiClient } from '@/shared/api/api-client';
import { ApiError } from '@/shared/api/api-error';
import { fetchVocabularyReviewQueue } from '@/modules/vocabulary/api/vocabulary-api';
import {
  fetchMistakeDrill,
  fetchMistakeNotebook,
  fetchMistakePractice,
} from '@/modules/mistakes/api/mistakes-api';
import { VocabularyDashboard } from '@/modules/vocabulary/components/VocabularyDashboard';
import { MistakesDashboard } from '@/modules/mistakes/components/MistakesDashboard';
import { PracticeMistakeRunner } from '@/modules/mistakes/components/PracticeMistakeRunner';
import { mockReviewQueueWords, mockVocabularyStats } from '@/mocks/vocabulary.mock';
import { mockMistakeItems, mockMistakeStats } from '@/mocks/mistakes.mock';
import { click, flush, render } from './helpers/dom';

vi.mock('next/navigation', () => ({
  usePathname: () => '/vocabulary',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

/**
 * Real HTTP interception via MSW.
 *
 * `NEXT_PUBLIC_USE_MOCK_DATA === 'false'` is what routes the production domain
 * adapters to HTTP, so the requests below are issued by the real `apiClient`
 * (`fetch`) and observed by MSW — no domain fetcher is stubbed.
 */
const API_BASE = 'https://api.sola.test';
const server = setupServer();

/** Requests MSW actually observed, for URL/ID assertions. */
const seen: string[] = [];

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_URL = API_BASE;
  process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'false';
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  seen.length = 0;
});

afterAll(() => {
  server.close();
  delete process.env.NEXT_PUBLIC_USE_MOCK_DATA;
});

beforeEach(() => {
  document.body.innerHTML = '';
});

function track(path: string) {
  return `${API_BASE}${path}`;
}

/** The dashboard's ready-state refresh control (production `resource.reload`). */
function refreshButton(container: HTMLElement): HTMLButtonElement {
  const button = Array.from(container.querySelectorAll('button')).find(
    (candidate) => candidate.getAttribute('aria-label') === 'Refresh your mistake notebook'
  );
  expect(button).toBeDefined();
  return button as HTMLButtonElement;
}

/** The dashboard's keyboard-accessible retry control. */
function retryButton(container: HTMLElement): HTMLButtonElement {
  const button = Array.from(container.querySelectorAll('button')).find((candidate) =>
    /retry|try again|reload/i.test(candidate.textContent ?? '')
  );
  expect(button).toBeDefined();
  return button as HTMLButtonElement;
}

describe('apiClient — strict success vs tolerant error bodies (QA-5)', () => {
  it('should surface a malformed 200 as an ApiError instead of typed success', async () => {
    server.use(
      http.get(track('/broken'), () => {
        seen.push('GET /broken');
        return new HttpResponse('{ not json', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );

    await expect(apiClient<{ ok: boolean }>('/broken')).rejects.toBeInstanceOf(ApiError);
    expect(seen).toEqual(['GET /broken']);
  });

  it('should not return a bare string typed as T for a non-JSON 200', async () => {
    server.use(
      http.get(track('/text'), () => {
        seen.push('GET /text');
        return new HttpResponse('plain text body', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
    );

    await expect(apiClient<{ value: number }>('/text')).rejects.toThrow(
      /Failed to parse a successful JSON response/
    );
    expect(seen).toEqual(['GET /text']);
  });

  it('should return a non-JSON 200 verbatim only in explicit text mode', async () => {
    server.use(
      http.get(track('/raw'), () => {
        seen.push('GET /raw');
        return new HttpResponse('raw payload', { status: 200 });
      })
    );

    await expect(apiClient<string>('/raw', { responseMode: 'text' })).resolves.toBe('raw payload');
    expect(seen).toEqual(['GET /raw']);
  });

  it('should resolve a 204 no-body endpoint to undefined', async () => {
    server.use(
      http.delete(track('/items/1'), () => {
        seen.push('DELETE /items/1');
        return new HttpResponse(null, { status: 204 });
      })
    );

    await expect(apiClient<void>('/items/1', { method: 'DELETE' })).resolves.toBeUndefined();
    expect(seen).toEqual(['DELETE /items/1']);
  });

  it('should resolve an empty 200 body to undefined', async () => {
    server.use(
      http.get(track('/empty'), () => {
        seen.push('GET /empty');
        return new HttpResponse('', { status: 200 });
      })
    );

    await expect(apiClient<void>('/empty')).resolves.toBeUndefined();
    expect(seen).toEqual(['GET /empty']);
  });

  it('should reject a body on a declared void endpoint', async () => {
    server.use(
      http.post(track('/commands'), () => {
        seen.push('POST /commands');
        return HttpResponse.json({ unexpected: true }, { status: 200 });
      })
    );

    await expect(
      apiClient<void>('/commands', { method: 'POST', responseMode: 'void' })
    ).rejects.toThrow(/Expected an empty body/);
    expect(seen).toEqual(['POST /commands']);
  });

  it('should keep error bodies tolerant across JSON, text and HTML', async () => {
    server.use(
      http.get(track('/json-err'), () => {
        seen.push('GET /json-err');
        return HttpResponse.json({ message: 'json message' }, { status: 422 });
      }),
      http.get(track('/text-err'), () => {
        seen.push('GET /text-err');
        return new HttpResponse('text message', { status: 500 });
      }),
      http.get(track('/html-err'), () => {
        seen.push('GET /html-err');
        return new HttpResponse('<html>boom</html>', { status: 502 });
      })
    );

    await expect(apiClient('/json-err')).rejects.toThrow('json message');
    await expect(apiClient('/text-err')).rejects.toThrow('text message');
    await expect(apiClient('/html-err')).rejects.toThrow('<html>boom</html>');
    expect(seen).toEqual(['GET /json-err', 'GET /text-err', 'GET /html-err']);
  });
});

describe('vocabulary boundary over real HTTP (QA-2)', () => {
  it('should request the documented endpoint and return the typed payload', async () => {
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        seen.push('GET /vocabulary/review-queue');
        return HttpResponse.json({ words: mockReviewQueueWords, stats: mockVocabularyStats });
      })
    );

    const result = await fetchVocabularyReviewQueue();
    expect(seen).toEqual(['GET /vocabulary/review-queue']);
    expect(result.words).toHaveLength(mockReviewQueueWords.length);
    expect(result.stats.totalWords).toBe(mockVocabularyStats.totalWords);
  });

  it('should reject when the endpoint returns a malformed 200', async () => {
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        seen.push('GET /vocabulary/review-queue');
        return new HttpResponse('nope', { status: 200 });
      })
    );

    await expect(fetchVocabularyReviewQueue()).rejects.toThrow(
      /Failed to parse a successful JSON response/
    );
    expect(seen).toEqual(['GET /vocabulary/review-queue']);
  });
});

describe('mistakes boundary over real HTTP (QA-2)', () => {
  it('should request the notebook endpoint', async () => {
    server.use(
      http.get(track('/mistakes'), () => {
        seen.push('GET /mistakes');
        return HttpResponse.json({ mistakes: mockMistakeItems, stats: mockMistakeStats });
      })
    );

    const result = await fetchMistakeNotebook();
    expect(seen).toEqual(['GET /mistakes']);
    expect(result.mistakes).toHaveLength(mockMistakeItems.length);
  });

  it('should request the drill by encoded id', async () => {
    let rawUrl = '';
    server.use(
      http.get(track('/mistakes/:id/drill'), ({ request }) => {
        // Assert the RAW url: MSW decodes path params, so `request.url` is the
        // only honest proof that the id was percent-encoded on the wire.
        rawUrl = request.url;
        seen.push('GET /mistakes/*/drill');
        return HttpResponse.json({ drill: null });
      })
    );

    const result = await fetchMistakeDrill('m/2');
    expect(seen).toEqual(['GET /mistakes/*/drill']);
    expect(rawUrl).toBe(track('/mistakes/m%2F2/drill'));
    expect(result.drill).toBeNull();
  });

  it('should not issue a request for an empty id', async () => {
    const result = await fetchMistakeDrill('   ');
    expect(result.drill).toBeNull();
    expect(seen).toEqual([]);
  });
});

describe('VocabularyDashboard — loading/error/empty/retry over HTTP (QA-2, QA-4)', () => {
  it('should render loading then the loaded payload', async () => {
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        seen.push('GET /vocabulary/review-queue');
        return HttpResponse.json({ words: mockReviewQueueWords, stats: mockVocabularyStats });
      })
    );

    const { container, unmount } = render(React.createElement(VocabularyDashboard));
    expect(container.textContent).toMatch(/loading/i);
    await flush();
    await flush();

    expect(seen).toEqual(['GET /vocabulary/review-queue']);
    expect(container.textContent).toContain(String(mockVocabularyStats.totalWords));
    unmount();
  });

  it('should render an error state and recover on retry (same payload counts)', async () => {
    let attempt = 0;
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        attempt += 1;
        seen.push(`GET /vocabulary/review-queue#${attempt}`);
        if (attempt === 1) {
          return new HttpResponse('boom', { status: 500 });
        }
        return HttpResponse.json({ words: mockReviewQueueWords, stats: mockVocabularyStats });
      })
    );

    const { container, unmount } = render(React.createElement(VocabularyDashboard));
    await flush();
    await flush();

    expect(container.textContent).toMatch(/couldn'?t load|could not load|unable to load/i);

    click(retryButton(container));
    await flush();
    await flush();

    expect(seen.length).toBeGreaterThanOrEqual(2);
    expect(container.textContent).toContain(String(mockVocabularyStats.totalWords));
    unmount();
  });

  it('should render a coherent empty state with zero stats (empty0)', async () => {
    server.use(
      http.get(track('/vocabulary/review-queue'), () => {
        seen.push('GET /vocabulary/review-queue');
        return HttpResponse.json({
          words: [],
          stats: {
            newCount: 0,
            learningCount: 0,
            familiarCount: 0,
            strongCount: 0,
            masteredCount: 0,
            totalWords: 0,
          },
        });
      })
    );

    const { container, unmount } = render(React.createElement(VocabularyDashboard));
    await flush();
    await flush();

    expect(container.textContent).toMatch(/empty|no words|nothing/i);
    // Coherent 0 stats — not a null stats panel.
    expect(container.textContent).toContain('0');
    unmount();
  });
});

describe('MistakesDashboard — same-count payloads are distinguished (QA-4)', () => {
  /**
   * Payload identity, not payload size, decides what is rendered.
   *
   * `payloadA` and `payloadB` share ids, order and length — only the displayed
   * `userAnswer` differs. A count-based sync (`prev.length !== next.length`)
   * cannot tell them apart; a revision-keyed sync can.
   */
  const payloadA = mockMistakeItems.map((item) => ({
    ...item,
    userAnswer: `ALPHA answer for ${item.id}`,
  }));
  const payloadB = mockMistakeItems.map((item) => ({
    ...item,
    userAnswer: `BRAVO answer for ${item.id}`,
  }));

  it('should have equal length and equal ids across both payloads', () => {
    expect(payloadA).toHaveLength(payloadB.length);
    expect(payloadA.map((m) => m.id)).toEqual(payloadB.map((m) => m.id));
    expect(payloadA[0].userAnswer).not.toBe(payloadB[0].userAnswer);
  });

  /**
   * RV2 — the same mounted instance distinguishes A from B.
   *
   * The previous version of this regression UNMOUNTED between payloads, so it
   * only proved that a fresh mount loads fresh data. The real hazard is a
   * retained instance that already holds A: a count-based guard
   * (`prev.length !== next.length`) leaves A on screen because A and B have the
   * same ids, the same order and the same length, and the failure mode is silent
   * — the user simply keeps seeing stale content.
   *
   * This keeps ONE instance mounted for the whole test and drives it through the
   * production controls: Refresh on a ready A -> the refresh fails and the error
   * banner + Retry appear -> Retry resolves the distinct, equal-count B, which
   * must FULLY replace A (content and stats).
   *
   * Note the deliberate policy assertion: retaining the last successful list
   * while a refresh is failing is valid, so this test only requires that the
   * error and its Retry control are visible during the failure. It requires A's
   * actual removal after B resolves — that is the part a count-based guard gets
   * wrong.
   */
  it('should replace equal-count A with B on the SAME mounted instance', async () => {
    const statsA = { ...mockMistakeStats, grammarPct: 11 };
    const statsB = { ...mockMistakeStats, grammarPct: 88 };

    let request = 0;
    server.use(
      http.get(track('/mistakes'), () => {
        request += 1;
        if (request === 1) {
          seen.push('GET /mistakes#A');
          return HttpResponse.json({ mistakes: payloadA, stats: statsA });
        }
        if (request === 2) {
          seen.push('GET /mistakes#fail-refresh');
          return new HttpResponse('notebook down', { status: 500 });
        }
        seen.push('GET /mistakes#B');
        return HttpResponse.json({ mistakes: payloadB, stats: statsB });
      })
    );

    const { container, unmount } = render(React.createElement(MistakesDashboard));
    await flush();
    await flush();

    // 1. The retained instance holds A.
    expect(seen).toEqual(['GET /mistakes#A']);
    expect(container.textContent).toContain(`ALPHA answer for ${mockMistakeItems[0].id}`);
    expect(container.textContent).not.toContain(`BRAVO answer for ${mockMistakeItems[0].id}`);
    expect(container.textContent).toContain('11%');

    // 2. Refresh on the SAME instance fails: the error surface and its Retry
    //    control must both be reachable. The previously loaded list may remain
    //    (retain-last-good policy), but the stale stats must not be presented as
    //    current.
    click(refreshButton(container));
    await flush();
    await flush();

    expect(seen).toEqual(['GET /mistakes#A', 'GET /mistakes#fail-refresh']);
    expect(container.textContent).toMatch(/couldn'?t load/i);
    expect(retryButton(container)).toBeDefined();
    expect(container.textContent).not.toContain('11%');

    // 3. Retry resolves the DISTINCT, equal-count B and replaces A + its stats.
    click(retryButton(container));
    await flush();
    await flush();

    expect(seen).toEqual([
      'GET /mistakes#A',
      'GET /mistakes#fail-refresh',
      'GET /mistakes#B',
    ]);
    expect(container.textContent).not.toMatch(/couldn'?t load/i);
    // B has fully replaced A — the same-count guard would have left A in place.
    expect(container.textContent).toContain(`BRAVO answer for ${mockMistakeItems[0].id}`);
    expect(container.textContent).not.toContain(
      `ALPHA answer for ${mockMistakeItems[0].id}`
    );
    expect(container.textContent).toContain('88%');
    expect(container.textContent).not.toContain('11%');

    unmount();
  });
});

describe('practice drill boundary over real HTTP (QA-2)', () => {
  it('should treat an absent drill as unresolved and never borrow another entry', async () => {
    server.use(
      http.get(track('/mistakes/:id/drill'), ({ request }) => {
        seen.push(`GET ${new URL(request.url).pathname}`);
        return HttpResponse.json({ drill: null });
      }),
      http.get(track('/mistakes'), () => {
        seen.push('GET /mistakes');
        return HttpResponse.json({ mistakes: mockMistakeItems, stats: mockMistakeStats });
      })
    );

    const vocabularyEntry = mockMistakeItems.find((m) => m.category === 'vocabulary')!;
    const result = await fetchMistakePractice(vocabularyEntry.id);

    // The server is authoritative: no notebook call, no fabricated drill.
    expect(seen).toEqual([`GET /mistakes/${vocabularyEntry.id}/drill`]);
    expect(result.isResolved).toBe(false);
    expect(result.drill).toBeNull();
    expect(result.requestedId).toBe(vocabularyEntry.id);
  });

  it('should report an unsupported id as unresolved without fabricating a drill', async () => {
    server.use(
      http.get(track('/mistakes/:id/drill'), () => {
        seen.push('GET /mistakes/:id/drill');
        return HttpResponse.json({ drill: null });
      }),
      http.get(track('/mistakes'), () => {
        seen.push('GET /mistakes');
        return HttpResponse.json({ mistakes: mockMistakeItems, stats: mockMistakeStats });
      })
    );

    const result = await fetchMistakePractice('does-not-exist');
    expect(result.isResolved).toBe(false);
    expect(result.drill).toBeNull();
    expect(result.requestedId).toBe('does-not-exist');
  });

  it('should propagate a drill-endpoint failure instead of silently using fixtures', async () => {
    server.use(
      http.get(track('/mistakes/:id/drill'), () => {
        seen.push('GET /mistakes/:id/drill');
        return new HttpResponse('drill down', { status: 500 });
      })
    );

    await expect(fetchMistakePractice('mis-7')).rejects.toThrow('drill down');
    // The notebook fallback must NOT be attempted after a hard failure.
    expect(seen).toEqual(['GET /mistakes/:id/drill']);
  });

  it('should make no request for an empty route id', async () => {
    const result = await fetchMistakePractice('   ');
    expect(seen).toEqual([]);
    expect(result).toEqual({ drill: null, requestedId: '', isResolved: false });
  });
});

describe('PracticeMistakeRunner UI states over real HTTP (QA-2)', () => {
  const drill = {
    mistakeId: 'mis-7',
    category: 'grammar',
    title: 'Distinctly intercepted drill',
    userMistakeSentence: 'DRILL_MISTAKE_SENTENCE',
    correctSentence: 'DRILL_CORRECT_SENTENCE',
    mistakeHighlight: 'DRILL_MISTAKE_SENTENCE',
    correctHighlight: 'DRILL_CORRECT_SENTENCE',
    ruleExplanation: 'DRILL_RULE_EXPLANATION',
    moreExamples: [{ sentence: 'DRILL_EXAMPLE', isCorrect: true }],
    questions: [
      {
        questionNumber: 1,
        prompt: 'DRILL_PROMPT',
        options: [
          { key: 'A', text: 'DRILL_OPTION_A', isCorrect: true },
          { key: 'B', text: 'DRILL_OPTION_B', isCorrect: false },
        ],
        explanation: 'DRILL_QUESTION_EXPLANATION',
      },
    ],
  };

  it('should render loading then the intercepted drill content', async () => {
    server.use(
      http.get(track('/mistakes/:id/drill'), () => {
        seen.push('GET /mistakes/mis-7/drill');
        return HttpResponse.json({ drill });
      })
    );

    const { container, unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-7' })
    );
    expect(container.textContent).toMatch(/loading/i);

    await flush();
    await flush();

    expect(seen).toEqual(['GET /mistakes/mis-7/drill']);
    // Content comes from the intercepted payload, not from a local fixture.
    expect(container.textContent).toContain('DRILL_MISTAKE_SENTENCE');
    expect(container.textContent).toContain('DRILL_OPTION_A');
    expect(container.textContent).not.toContain('the hospital');
    unmount();
  });

  it('should show an error state and recover on retry', async () => {
    let attempt = 0;
    server.use(
      http.get(track('/mistakes/:id/drill'), () => {
        attempt += 1;
        seen.push(`GET /mistakes/mis-7/drill#${attempt}`);
        if (attempt === 1) {
          return new HttpResponse('drill down', { status: 500 });
        }
        return HttpResponse.json({ drill });
      })
    );

    const { container, unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-7' })
    );
    await flush();
    await flush();

    expect(container.textContent).toMatch(/couldn'?t load/i);
    expect(container.textContent).toContain('drill down');

    click(retryButton(container));
    await flush();
    await flush();

    expect(seen.length).toBe(2);
    expect(container.textContent).not.toMatch(/couldn'?t load/i);
    expect(container.textContent).toContain('DRILL_MISTAKE_SENTENCE');
    unmount();
  });

  it('should render the not-found state for an unresolved id', async () => {
    server.use(
      http.get(track('/mistakes/:id/drill'), () => {
        seen.push('GET /mistakes/ghost/drill');
        return HttpResponse.json({ drill: null });
      }),
      http.get(track('/mistakes'), () => {
        seen.push('GET /mistakes');
        return HttpResponse.json({ mistakes: mockMistakeItems, stats: mockMistakeStats });
      })
    );
    // A 404-style null drill resolves to the not-found UI without a notebook call.

    const { container, unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: 'ghost' })
    );
    await flush();
    await flush();

    expect(container.textContent).toMatch(/not found/i);
    // The requested id is echoed so the user knows what failed.
    expect(container.textContent).toContain('ghost');
    // No fabricated drill content is shown.
    expect(container.textContent).not.toContain('DRILL_MISTAKE_SENTENCE');
    unmount();
  });
});
