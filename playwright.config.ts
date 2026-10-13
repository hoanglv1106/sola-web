import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for SOLA critical-flow browser coverage.
 *
 * Runs against a dedicated Next dev server started by Playwright itself on
 * TEST_PORT (default 3100) — never the DSH-managed GUI server. Set
 * PLAYWRIGHT_BROWSERS_PATH to the workspace cache when browsers were installed
 * there, e.g.:
 *
 *   PLAYWRIGHT_BROWSERS_PATH="$PWD/.cache/ms-playwright" npm run test:e2e
 */
const PORT = Number(process.env.TEST_PORT ?? 3100);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'tablet',
      // Only Chromium is installed in the workspace cache, so the iPad viewport
      // is expressed explicitly rather than via a WebKit-backed device preset.
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 834, height: 1112 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: `npx next dev --port ${PORT} --hostname 127.0.0.1`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      // Route the production domain adapters through real HTTP so `page.route`
      // can intercept them (the app defaults to local mock data otherwise).
      NEXT_PUBLIC_USE_MOCK_DATA: 'false',
      NEXT_PUBLIC_API_URL: 'https://api.sola.test',
    },
  },
});
