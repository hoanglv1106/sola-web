import { test, expect, type Page } from '@playwright/test';

/**
 * Onboarding mobile-drawer isolation in a REAL browser.
 *
 * This is the browser counterpart of the DOM-level layout-isolation suite: it
 * asserts the real `inert` attribute the browser enforces, real focus behaviour,
 * real Escape handling, `document.body` overflow restoration, and the real lg
 * breakpoint release. Nothing is injected into the DOM or force-clicked.
 *
 * Viewport policy (mirrors the app's own `lg` breakpoint at 1024px):
 * - mobile + tablet (< 1024px): the trigger exists and the drawer can open.
 * - desktop (>= 1024px): the trigger is hidden by the app, so the "never
 *   isolates" assertion runs here. Both branches are therefore exercised across
 *   the three projects, and no project is skipped entirely.
 */

const DRAWER = '#sola-onboarding-navigation';

function trigger(page: Page) {
  return page.locator('button[aria-controls="sola-onboarding-navigation"]');
}

async function openDrawer(page: Page) {
  const button = trigger(page);
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.locator(DRAWER)).toBeVisible();
}

/** Count elements the browser is actually treating as inert. */
function inertCount(page: Page) {
  return page.evaluate(() => document.querySelectorAll('[inert]').length);
}

test.describe('onboarding drawer isolation in a real browser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding');
  });

  test('should expose the drawer as a labelled modal dialog via an accessible trigger', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'drawer is mobile/tablet only');

    const button = trigger(page);
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('aria-expanded', 'false');

    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');

    const dialog = page.locator(DRAWER);
    await expect(dialog).toHaveAttribute('role', 'dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-label', 'Navigation menu');
    await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toBeVisible();
  });

  test('should make the background really inert while the drawer is open', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'drawer is mobile/tablet only');

    expect(await inertCount(page)).toBe(0);

    await openDrawer(page);

    // The browser must genuinely report inert background elements — this is the
    // real attribute, not a synthetic test div.
    expect(await inertCount(page)).toBeGreaterThan(0);

    // The drawer itself is never inert (nor is any ancestor of it), otherwise it
    // would be unreachable.
    await expect(page.locator(DRAWER)).not.toHaveAttribute('inert', /.*/);

    await page.screenshot({ path: testInfo.outputPath('drawer-open.png'), fullPage: false });
  });

  test('should refuse focus on background controls and contain Tab in the drawer', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'drawer is mobile/tablet only');

    await openDrawer(page);

    // A background control cannot be focused while the drawer is open.
    const backgroundReachable = await page.evaluate(() => {
      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>('main a, main button, header button')
      ).filter((element) => !element.closest('#sola-onboarding-navigation'));
      const target = candidates[0];
      if (!target) return null;
      target.focus();
      return document.activeElement === target;
    });
    expect(backgroundReachable).toBe(false);

    // Tab and Shift+Tab must stay inside the dialog.
    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press('Tab');
    }
    const inDrawerAfterTab = await page.evaluate((selector) => {
      const dialog = document.querySelector(selector);
      return Boolean(dialog && document.activeElement && dialog.contains(document.activeElement));
    }, DRAWER);
    expect(inDrawerAfterTab).toBe(true);

    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press('Shift+Tab');
    }
    const inDrawerAfterShiftTab = await page.evaluate((selector) => {
      const dialog = document.querySelector(selector);
      return Boolean(dialog && document.activeElement && dialog.contains(document.activeElement));
    }, DRAWER);
    expect(inDrawerAfterShiftTab).toBe(true);
  });

  test('should restore the background and the trigger focus on Escape', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'drawer is mobile/tablet only');

    const overflowBefore = await page.evaluate(() => document.body.style.overflow);

    await openDrawer(page);
    expect(await inertCount(page)).toBeGreaterThan(0);

    await page.keyboard.press('Escape');

    await expect(page.locator(DRAWER)).toHaveCount(0);
    expect(await inertCount(page)).toBe(0);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe(overflowBefore);

    // Focus returns to the trigger that opened the drawer.
    const focusedIsTrigger = await page.evaluate(() => {
      const active = document.activeElement;
      return Boolean(active && active.getAttribute('aria-controls') === 'sola-onboarding-navigation');
    });
    expect(focusedIsTrigger).toBe(true);
  });

  test('should close the drawer and release isolation when crossing the lg breakpoint', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'drawer is mobile/tablet only');

    await openDrawer(page);
    expect(await inertCount(page)).toBeGreaterThan(0);

    // A REAL viewport change across the app's own 1024px breakpoint.
    await page.setViewportSize({ width: 1280, height: 900 });

    await expect(page.locator(DRAWER)).toHaveCount(0);
    expect(await inertCount(page)).toBe(0);

    // The desktop sidebar is the positive counterpart at this width.
    await expect(page.locator('aside, nav').first()).toBeVisible();
  });

  test('should never isolate the background at desktop width', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'desktop-only counterpart');

    // The same accessible trigger the mobile tests use is hidden here by the app,
    // so the drawer state is simply unreachable — and nothing is isolated.
    await expect(trigger(page)).toBeHidden();
    await expect(page.locator(DRAWER)).toHaveCount(0);

    expect(await inertCount(page)).toBe(0);

    // Tab still reaches a real control, proving the page is not trapped.
    await page.keyboard.press('Tab');
    const reachedSomething = await page.evaluate(
      () => document.activeElement !== document.body && document.activeElement !== null
    );
    expect(reachedSomething).toBe(true);

    await page.screenshot({ path: testInfo.outputPath('desktop-no-isolation.png'), fullPage: false });
  });
});
