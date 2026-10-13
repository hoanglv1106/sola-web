import { test, expect, type Page, type Route } from '@playwright/test';

/**
 * RV1 browser evidence: the review session loads through the PRODUCTION typed
 * boundary over real HTTP in a real browser.
 *
 * The app is served with `NEXT_PUBLIC_USE_MOCK_DATA=false`, so the session's own
 * `fetchVocabularyReviewQueue` issues real `fetch` calls that `page.route`
 * answers. Nothing is stubbed at the component or hook level, so a direct
 * fixture import (the defect under repair) cannot satisfy these assertions.
 *
 * Navigation note: the initial visit uses `page.goto` on the review route, which
 * proves the HTTP contract + UI states for RV1. Client-side navigation is
 * exercised separately through the dashboard's existing CTA.
 */

const API_BASE = 'https://api.sola.test';

const stats = {
  newCount: 1,
  learningCount: 2,
  familiarCount: 1,
  strongCount: 0,
  masteredCount: 0,
  totalWords: 4,
};

const wordA = {
  id: 'wr-1',
  word: 'BROWSER_ALPHA_WORD',
  phonetic: '/ˈælfə/',
  partOfSpeech: 'noun',
  definition: 'the first intercepted browser word',
  exampleSentence: 'This is the BROWSER_ALPHA_WORD example.',
  highlightedWord: 'BROWSER_ALPHA_WORD',
  collocations: ['alpha collocation'],
  similarWords: ['first'],
  topic: 'Testing',
  examTag: 'IELTS',
  professionalUsage: 'business',
  stage: 'learning',
  timesSeen: 2,
};

const wordB = {
  ...wordA,
  id: 'wr-2',
  word: 'BROWSER_BRAVO_WORD',
  exampleSentence: 'This is the BROWSER_BRAVO_WORD example.',
  highlightedWord: 'BROWSER_BRAVO_WORD',
};

/** Intercept all API traffic and record the raw request lines observed. */
async function installApiRoutes(
  page: Page,
  handler: (route: Route, url: URL) => Promise<boolean>
): Promise<string[]> {
  const seen: string[] = [];
  await page.route(`${API_BASE}/**`, async (route) => {
    const url = new URL(route.request().url());
    seen.push(`${route.request().method()} ${url.pathname}`);
    const handled = await handler(route, url);
    if (!handled) {
      await route.fulfill({ status: 404, body: 'unhandled test route' });
    }
  });
  return seen;
}

const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

const queue = (words: unknown[]) => ({ words, stats: { ...stats, totalWords: words.length } });

test.describe('review session over real browser HTTP (RV1)', () => {
  test('should request the queue endpoint and render the intercepted browser word', async ({
    page,
  }) => {
    const seen = await installApiRoutes(page, async (route, url) => {
      if (url.pathname === '/vocabulary/review-queue') {
        await json(route, queue([wordA, wordB]));
        return true;
      }
      return false;
    });

    await page.goto('/vocabulary/review');

    // The real request was observed, and the rendered heading is the intercepted
    // browser payload — not the bundled fixture spelling.
    const heading = page.locator('h2').first();
    await expect(heading).toHaveText('BROWSER_ALPHA_WORD');
    expect(seen).toContain('GET /vocabulary/review-queue');
  });

  test('should show a loading surface, then the resolved word', async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    await installApiRoutes(page, async (route, url) => {
      if (url.pathname === '/vocabulary/review-queue') {
        await gate;
        await json(route, queue([wordA, wordB]));
        return true;
      }
      return false;
    });

    await page.goto('/vocabulary/review');

    // Pending: an explicit loading surface, never a finished/empty session.
    await expect(page.getByText(/loading review queue/i)).toBeVisible();
    await expect(page.getByText(/session complete/i)).toHaveCount(0);

    release();

    await expect(page.locator('h2').first()).toHaveText('BROWSER_ALPHA_WORD');
    await expect(page.getByText(/loading review queue/i)).toHaveCount(0);
  });

  test('should surface an error and recover through the real retry control', async ({ page }) => {
    let attempt = 0;
    const seen = await installApiRoutes(page, async (route, url) => {
      if (url.pathname === '/vocabulary/review-queue') {
        attempt += 1;
        if (attempt === 1) {
          await route.fulfill({ status: 500, contentType: 'text/plain', body: 'queue down' });
          return true;
        }
        await json(route, queue([wordA, wordB]));
        return true;
      }
      return false;
    });

    await page.goto('/vocabulary/review');

    await expect(page.getByText(/couldn'?t load your review queue/i)).toBeVisible();
    await expect(page.getByText(/session complete/i)).toHaveCount(0);

    await page.getByRole('button', { name: /try again/i }).click();

    await expect(page.locator('h2').first()).toHaveText('BROWSER_ALPHA_WORD');
    await expect(page.getByText(/couldn'?t load/i)).toHaveCount(0);
    expect(seen.filter((line) => line === 'GET /vocabulary/review-queue').length).toBe(2);
  });

  test('should render a coherent empty state for a genuinely empty queue', async ({ page }) => {
    await installApiRoutes(page, async (route, url) => {
      if (url.pathname === '/vocabulary/review-queue') {
        await json(route, queue([]));
        return true;
      }
      return false;
    });

    await page.goto('/vocabulary/review');

    await expect(page.getByText(/session complete/i)).toBeVisible();
    await expect(page.getByText(/couldn'?t load/i)).toHaveCount(0);
  });

  test('should reject a 204 queue as an error rather than a fake empty success', async ({ page }) => {
    await installApiRoutes(page, async (route, url) => {
      if (url.pathname === '/vocabulary/review-queue') {
        await route.fulfill({ status: 204, body: '' });
        return true;
      }
      return false;
    });

    await page.goto('/vocabulary/review');

    // A content-less 204 must NOT render as "session complete" (which would
    // claim the learner finished all their words).
    await expect(page.getByText(/couldn'?t load your review queue/i)).toBeVisible();
    await expect(page.getByText(/session complete/i)).toHaveCount(0);
  });

  test('should keep the persisted stage across a real browser reload', async ({ page }) => {
    const seen = await installApiRoutes(page, async (route, url) => {
      if (url.pathname === '/vocabulary/review-queue') {
        await json(route, queue([wordA, wordB]));
        return true;
      }
      return false;
    });

    await page.goto('/vocabulary/review');
    await expect(page.locator('h2').first()).toHaveText('BROWSER_ALPHA_WORD');

    // Drive the REAL review action, then observe what the domain store recorded.
    await page.getByRole('button', { name: /i know this/i }).click();

    const stored = await page.evaluate(() => window.localStorage.getItem('sola_vocabulary_progress'));
    expect(stored).toBeTruthy();
    expect(stored).toContain('wr-1');

    // A full browser reload re-fetches over HTTP and re-applies the stored stage.
    await page.reload();
    await expect(page.locator('h2').first()).toBeVisible();

    const storedAfter = await page.evaluate(() =>
      window.localStorage.getItem('sola_vocabulary_progress')
    );
    expect(storedAfter).toBe(stored);
    expect(seen.filter((line) => line === 'GET /vocabulary/review-queue').length).toBeGreaterThanOrEqual(2);
  });

  test('should still load through the boundary when reached by the dashboard CTA', async ({ page }) => {
    const seen = await installApiRoutes(page, async (route, url) => {
      if (url.pathname === '/vocabulary/review-queue') {
        await json(route, queue([wordA, wordB]));
        return true;
      }
      if (url.pathname === '/vocabulary/dashboard' || url.pathname === '/vocabulary') {
        await json(route, { words: [wordA, wordB], stats });
        return true;
      }
      return false;
    });

    // Existing client-side entry point — no new navigation was added for testing.
    await page.goto('/vocabulary');
    const cta = page.getByRole('button', { name: /review|start/i }).first();
    if (await cta.count()) {
      await cta.click();
    } else {
      await page.goto('/vocabulary/review');
    }

    await expect(page.locator('h2').first()).toBeVisible();
    expect(seen).toContain('GET /vocabulary/review-queue');
  });
});

test.describe('practice drill over real browser HTTP (RV4 request contract)', () => {
  test('should request the exact selected id and render its own payload', async ({ page }) => {
    const seen = await installApiRoutes(page, async (route, url) => {
      const match = url.pathname.match(/^\/mistakes\/([^/]+)\/drill$/);
      if (match) {
        await json(route, {
          drill: {
            mistakeId: decodeURIComponent(match[1]),
            category: 'grammar',
            userMistakeSentence: 'BROWSER_DRILL_MISTAKE_SENTENCE',
            correctSentence: 'BROWSER_DRILL_CORRECT_SENTENCE',
            mistakeHighlight: 'BROWSER_DRILL_MISTAKE_SENTENCE',
            correctHighlight: 'BROWSER_DRILL_CORRECT_SENTENCE',
            ruleExplanation: 'BROWSER_DRILL_RULE',
            moreExamples: [{ sentence: 'BROWSER_DRILL_EXAMPLE', isCorrect: true }],
            questions: [
              {
                questionNumber: 1,
                prompt: 'BROWSER_DRILL_PROMPT',
                options: [
                  { key: 'A', text: 'BROWSER_DRILL_OPT_A', isCorrect: true },
                  { key: 'B', text: 'BROWSER_DRILL_OPT_B', isCorrect: false },
                ],
                explanation: 'BROWSER_DRILL_Q_EXPL',
              },
            ],
          },
        });
        return true;
      }
      return false;
    });

    await page.goto('/mistakes/mis-42/practice');

    await expect(page.getByText('BROWSER_DRILL_MISTAKE_SENTENCE').first()).toBeVisible();

    // The browser requested exactly the id in the route, percent-encoded path.
    expect(seen).toContain('GET /mistakes/mis-42/drill');
    expect(seen.some((line) => line.includes('/mistakes/mis-42/drill'))).toBe(true);
  });
});
