import { test, expect, type Page, type Route } from '@playwright/test';

/**
 * QA-2 browser evidence: real HTTP boundaries intercepted with `page.route`.
 *
 * The app is served with `NEXT_PUBLIC_USE_MOCK_DATA=false` so the production
 * domain adapters issue real `fetch` calls; `page.route` then answers them.
 * This proves the request URL/ID the browser actually sends, the real
 * loading/error/empty/ready transitions, and the retry path end-to-end.
 */

const API_BASE = 'https://api.sola.test';

const stats = {
  newCount: 3,
  learningCount: 2,
  familiarCount: 2,
  strongCount: 1,
  masteredCount: 1,
  totalWords: 9,
};

const reviewQueue = {
  stats,
  words: [
    {
      id: 'w-1',
      word: 'opportunity',
      phonetic: '/,ɒpə\'tju:nəti/',
      partOfSpeech: 'noun',
      definition: 'a chance for something good to happen',
      exampleSentence: 'This internship is a great opportunity.',
      highlightedWord: 'opportunity',
      collocations: ['a great opportunity'],
      similarWords: ['chance'],
      topic: 'Work & Career',
      examTag: 'IELTS',
      professionalUsage: 'business',
      stage: 'learning',
      timesSeen: 2,
    },
  ],
};

/** Intercept all API traffic for the app under test. */
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

test.describe('vocabulary boundary over real browser HTTP', () => {
  test('should request the documented endpoint and render the loaded payload', async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    const seen = await installApiRoutes(page, async (route, url) => {
      if (url.pathname === '/vocabulary/review-queue') {
        await gate; // hold the response so the loading state is observable
        await json(route, reviewQueue);
        return true;
      }
      return false;
    });

    await page.goto('/vocabulary');

    // Loading state is real, not a placeholder assertion.
    await expect(page.getByRole('status')).toBeVisible();

    release();
    await expect(page.getByText('opportunity', { exact: false }).first()).toBeVisible();
    expect(seen).toEqual(['GET /vocabulary/review-queue']);
  });

  test('should show an error state with a retry control, then recover', async ({ page }) => {
    let attempt = 0;
    const seen = await installApiRoutes(page, async (route, url) => {
      if (url.pathname !== '/vocabulary/review-queue') return false;
      attempt += 1;
      if (attempt === 1) {
        await route.fulfill({ status: 500, contentType: 'text/plain', body: 'server exploded' });
        return true;
      }
      await json(route, reviewQueue);
      return true;
    });

    await page.goto('/vocabulary');

    await expect(page.getByText(/couldn'?t load/i)).toBeVisible();
    await expect(page.getByText('server exploded')).toBeVisible();

    await page.getByRole('button', { name: /try again|retry/i }).click();

    await expect(page.getByText(/couldn'?t load/i)).toHaveCount(0);
    await expect(page.getByText('opportunity', { exact: false }).first()).toBeVisible();
    expect(seen).toEqual(['GET /vocabulary/review-queue', 'GET /vocabulary/review-queue']);
  });

  test('should render a coherent empty state when the queue is empty', async ({ page }) => {
    const seen = await installApiRoutes(page, async (route, url) => {
      if (url.pathname !== '/vocabulary/review-queue') return false;
      await json(route, {
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
      return true;
    });

    await page.goto('/vocabulary');

    await expect(page.getByText(/empty/i).first()).toBeVisible();
    await expect(page.getByText(/couldn'?t load/i)).toHaveCount(0);
    expect(seen).toEqual(['GET /vocabulary/review-queue']);
  });

  test('should surface a malformed 200 as an error, not as typed data', async ({ page }) => {
    await installApiRoutes(page, async (route, url) => {
      if (url.pathname !== '/vocabulary/review-queue') return false;
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{ not json' });
      return true;
    });

    await page.goto('/vocabulary');

    // The malformed body must never be rendered as a successful payload.
    await expect(page.getByText(/couldn'?t load/i)).toBeVisible();
  });
});

test.describe('mistakes boundary over real browser HTTP', () => {
  const mistakesPayload = (answer: string) => ({
    stats: { totalMistakes: 1, masteredCount: 0, inReviewCount: 1, weeklyNewCount: 1 },
    mistakes: [
      {
        id: 'mis-1',
        category: 'grammar',
        subcategory: 'Article usage',
        date: 'Oct 24, 2024',
        userAnswer: answer,
        userHighlight: 'the hospital',
        correctAnswer: 'I went to a hospital yesterday.',
        correctHighlight: 'a hospital',
        explanation: 'Use "a hospital" for any hospital in general.',
        timesSeen: 3,
        isAddedToReview: true,
      },
    ],
  });

  test('should request the notebook endpoint and render the payload', async ({ page }) => {
    const seen = await installApiRoutes(page, async (route, url) => {
      if (url.pathname !== '/mistakes') return false;
      await json(route, mistakesPayload('ALPHA answer'));
      return true;
    });

    await page.goto('/mistakes');

    await expect(page.getByText('ALPHA answer')).toBeVisible();
    expect(seen).toEqual(['GET /mistakes']);
  });

  const fullDrill = (sentence: string) => ({
    drill: {
      mistakeId: 'mis-1',
      category: 'grammar',
      title: 'Distinctly intercepted drill',
      currentStep: 1,
      totalSteps: 4,
      userMistakeSentence: sentence,
      mistakeHighlight: sentence,
      correctSentence: 'DRILL_CORRECT_SENTENCE',
      correctHighlight: 'DRILL_CORRECT_SENTENCE',
      ruleTitle: 'DRILL_RULE_TITLE',
      ruleExplanation: 'DRILL_RULE_EXPLANATION',
      moreExamples: [{ sentence: 'DRILL_EXAMPLE', isCorrect: true }],
      confidenceScore: 60,
      questions: [
        {
          id: 'q-1',
          questionNumber: 1,
          prompt: 'DRILL_PROMPT',
          options: [
            { key: 'A', text: 'DRILL_OPTION_A', isCorrect: true },
            { key: 'B', text: 'DRILL_OPTION_B', isCorrect: false },
          ],
          explanation: 'DRILL_QUESTION_EXPLANATION',
        },
      ],
    },
  });

  test('should render a drill from a distinct intercepted payload, never a fixture', async ({
    page,
  }) => {
    const seen = await installApiRoutes(page, async (route, url) => {
      if (url.pathname === '/mistakes/mis-1/drill') {
        await json(route, fullDrill('DRILL_MISTAKE_SENTENCE'));
        return true;
      }
      return false;
    });

    await page.goto('/mistakes/mis-1/practice');

    // Content comes from the intercepted HTTP payload.
    await expect(page.getByText('DRILL_MISTAKE_SENTENCE')).toBeVisible();
    await expect(page.getByText('DRILL_OPTION_A')).toBeVisible();
    // The bundled fixture text must NOT appear — proving the runner no longer
    // reads the local mock directly.
    await expect(page.getByText('I went to the hospital yesterday.')).toHaveCount(0);

    // The exact by-id request was issued, once.
    expect(seen).toEqual(['GET /mistakes/mis-1/drill']);
  });

  test('should show an error state and recover on retry for the same drill id', async ({ page }) => {
    let attempt = 0;
    const seen = await installApiRoutes(page, async (route, url) => {
      if (url.pathname !== '/mistakes/mis-1/drill') return false;
      attempt += 1;
      if (attempt === 1) {
        await route.fulfill({ status: 500, contentType: 'text/plain', body: 'drill endpoint down' });
        return true;
      }
      await json(route, fullDrill('RECOVERED_DRILL_SENTENCE'));
      return true;
    });

    await page.goto('/mistakes/mis-1/practice');

    await expect(page.getByText(/couldn'?t load this practice drill/i)).toBeVisible();
    await expect(page.getByText('drill endpoint down')).toBeVisible();

    await page.getByRole('button', { name: /try again/i }).click();

    await expect(page.getByText(/couldn'?t load this practice drill/i)).toHaveCount(0);
    await expect(page.getByText('RECOVERED_DRILL_SENTENCE')).toBeVisible();
    // Retry re-requested the SAME id.
    expect(seen).toEqual(['GET /mistakes/mis-1/drill', 'GET /mistakes/mis-1/drill']);
  });

  test('should render the not-found state for an unsupported drill id', async ({ page }) => {
    const seen = await installApiRoutes(page, async (route, url) => {
      if (url.pathname === '/mistakes/ghost/drill') {
        await json(route, { drill: null });
        return true;
      }
      return false;
    });

    await page.goto('/mistakes/ghost/practice');

    await expect(page.getByText(/practice drill not found/i)).toBeVisible();
    await expect(page.getByText('ghost')).toBeVisible();
    // Exactly one lookup, and no notebook fallback in HTTP mode.
    expect(seen).toEqual(['GET /mistakes/ghost/drill']);
  });
});
