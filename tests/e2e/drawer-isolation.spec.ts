import { test, expect, type Page } from '@playwright/test';

/**
 * QA-1 browser evidence: real Chromium, real SOLA app, real interactions.
 *
 * The unit/DOM suite proves the logic; this proves the *browser* behaviour with
 * a genuine focus/tab order engine — `inert` support, pointer blocking, and the
 * `(min-width: 1024px)` breakpoint are all real here, not stubbed.
 */

const DRAWER_ID = 'sola-mobile-navigation';
const DRAWER_LABEL = 'Navigation menu';

const trigger = (page: Page) => page.locator(`button[aria-controls="${DRAWER_ID}"]`);
const drawer = (page: Page) => page.locator(`#${DRAWER_ID}`);

async function openDrawer(page: Page): Promise<void> {
  await trigger(page).click();
  await expect(drawer(page)).toBeVisible();
}

/** The app-shell branch that holds the page header + main content. */
const contentBranch = (page: Page) =>
  page.locator(`div:has(> header):has(> main):not(:has(#${DRAWER_ID}))`).first();

test.describe('mobile drawer — real background isolation', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, 'desktop does not use the drawer');

  test('should expose the drawer as a labelled modal dialog', async ({ page }) => {
    await page.goto('/home');

    await expect(drawer(page)).toHaveCount(0);
    await openDrawer(page);

    await expect(drawer(page)).toHaveAttribute('role', 'dialog');
    await expect(drawer(page)).toHaveAttribute('aria-modal', 'true');
    await expect(drawer(page)).toHaveAttribute('aria-label', DRAWER_LABEL);
    await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true');
  });

  test('should make the background inert while the drawer is open', async ({ page }) => {
    await page.goto('/home');
    await openDrawer(page);

    // Real Chromium `inert` — the page content branch is not focusable.
    const branch = contentBranch(page);
    await expect(branch).toHaveAttribute('inert', '');
    await expect(branch).toHaveAttribute('aria-hidden', 'true');

    // The dialog itself is never hidden and has no hidden ancestor.
    await expect(drawer(page)).not.toHaveAttribute('aria-hidden', 'true');
    const dialogHiddenByAncestor = await drawer(page).evaluate((node) =>
      Boolean(node.closest('[aria-hidden="true"]'))
    );
    expect(dialogHiddenByAncestor).toBe(false);
  });

  test('should refuse focus on background controls and contain Tab in the drawer', async ({
    page,
  }) => {
    await page.goto('/home');
    await openDrawer(page);

    // A background control must not be able to take focus while the drawer is open.
    const backgroundFocused = await page.evaluate((id) => {
      const background = document
        .querySelectorAll('button')
        .length
        ? Array.from(document.querySelectorAll<HTMLElement>('header button, main button'))
        : [];
      const candidate = background.find((el) => !el.closest(`#${id}`));
      if (!candidate) return null;
      candidate.focus();
      return document.activeElement === candidate;
    }, DRAWER_ID);
    expect(backgroundFocused).toBe(false);

    // Tab stays inside the dialog across several presses.
    const activeInside = async () =>
      page.evaluate((id) => {
        const dialog = document.getElementById(id);
        const active = document.activeElement;
        return Boolean(dialog && active && dialog.contains(active));
      }, DRAWER_ID);

    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press('Tab');
      expect(await activeInside()).toBe(true);
    }
    // Shift+Tab wraps backwards without escaping either.
    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press('Shift+Tab');
      expect(await activeInside()).toBe(true);
    }
  });

  test('should restore the background and the trigger focus on Escape', async ({ page }) => {
    await page.goto('/home');

    const bodyOverflowBefore = await page.evaluate(() => document.body.style.overflow);
    await openDrawer(page);
    await expect(contentBranch(page)).toHaveAttribute('inert', '');

    await page.keyboard.press('Escape');
    await expect(drawer(page)).toHaveCount(0);

    // Isolation released and scroll state restored exactly.
    await expect(contentBranch(page)).not.toHaveAttribute('inert', '');
    await expect(contentBranch(page)).not.toHaveAttribute('aria-hidden', 'true');
    expect(await page.evaluate(() => document.body.style.overflow)).toBe(bodyOverflowBefore);

    // Focus returned to the control that opened the drawer.
    await expect(trigger(page)).toBeFocused();
  });

  test('should close the drawer and release isolation when crossing the lg breakpoint', async ({
    page,
  }) => {
    await page.goto('/home');
    await openDrawer(page);
    await expect(contentBranch(page)).toHaveAttribute('inert', '');

    // Real viewport resize past Tailwind's lg breakpoint (1024px).
    await page.setViewportSize({ width: 1280, height: 900 });

    await expect(drawer(page)).toHaveCount(0);
    await expect(contentBranch(page)).not.toHaveAttribute('inert', '');
    expect(
      await page.evaluate(() => Boolean(document.querySelector('[aria-hidden="true"] header')))
    ).toBe(false);
  });
});

test.describe('desktop — background is never isolated', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, 'mobile/tablet use the drawer');

  test('should never isolate the background and never focus-trap', async ({ page }) => {
    await page.goto('/home');

    // No mobile drawer trigger is rendered at desktop width.
    await expect(trigger(page)).toBeHidden();
    await expect(page.locator(`#${DRAWER_ID}`)).toHaveCount(0);

    // Nothing in the shell is inert, and the sidebar nav is reachable by Tab.
    expect(await page.evaluate(() => document.querySelectorAll('[inert]').length)).toBe(0);

    await page.keyboard.press('Tab');
    const activeTag = await page.evaluate(() => document.activeElement?.tagName ?? '');
    expect(activeTag).not.toBe('BODY');
  });
});
