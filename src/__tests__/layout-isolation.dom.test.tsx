// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import DashboardLayout from '@/app/(dashboard)/layout';
import OnboardingPage from '@/app/(public)/onboarding/page';
import { advance, click, findAll, flush, pressKey, render } from './helpers/dom';

// Only the Next host integrations are stubbed; the production drawer, hook and
// handlers under test are the real ones.
vi.mock('next/navigation', () => ({
  usePathname: () => '/home',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

const DRAWER_LABEL = 'Navigation menu';

/**
 * Controllable `matchMedia` stub.
 *
 * happy-dom reports `(min-width: 1024px).matches === true` by default (a desktop
 * viewport at innerWidth 1024), so the layouts' own breakpoint effect would
 * legitimately close the drawer immediately. This stub models a real mobile
 * viewport and lets a test flip the desktop query to prove the resize-release path.
 */
function installMatchMedia(initialDesktop = false) {
  let matchesDesktop = initialDesktop;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const impl = (query: string): MediaQueryList => {
    const isDesktopQuery = /min-width:\s*1024px/.test(query);
    return {
      get matches() {
        return isDesktopQuery ? matchesDesktop : !matchesDesktop;
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, cb: (event: MediaQueryListEvent) => void) => {
        if (isDesktopQuery) listeners.add(cb);
      },
      removeEventListener: (_type: string, cb: (event: MediaQueryListEvent) => void) => {
        if (isDesktopQuery) listeners.delete(cb);
      },
      addListener: (cb: (event: MediaQueryListEvent) => void) => {
        if (isDesktopQuery) listeners.add(cb);
      },
      removeListener: (cb: (event: MediaQueryListEvent) => void) => {
        if (isDesktopQuery) listeners.delete(cb);
      },
      dispatchEvent: () => true,
    } as unknown as MediaQueryList;
  };

  const spy = vi
    .spyOn(window, 'matchMedia')
    .mockImplementation(impl as unknown as typeof window.matchMedia);

  return {
    /** Simulate the viewport crossing into the desktop breakpoint. */
    resizeToDesktop() {
      matchesDesktop = true;
      listeners.forEach((cb) =>
        cb({ matches: true, media: '(min-width: 1024px)' } as MediaQueryListEvent)
      );
    },
    listenerCount: () => listeners.size,
    restore: () => spy.mockRestore(),
  };
}

/** Open the drawer through its real trigger (selected by exact aria-controls). */
function openDrawer(container: HTMLElement, drawerId: string): HTMLButtonElement {
  const trigger = container.querySelector<HTMLButtonElement>(
    `button[aria-controls="${drawerId}"]`
  );
  expect(trigger).not.toBeNull();
  click(trigger);
  return trigger as HTMLButtonElement;
}

function dialog(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>('[role="dialog"]');
}

/**
 * The isolated background branches: siblings of the dialog at every ancestor
 * level. `header`/`main` live *inside* one of these branches rather than being
 * direct siblings of the dialog, so isolation is asserted on the branches.
 */
function isolatedBranches(container: HTMLElement, dialogEl: HTMLElement): HTMLElement[] {
  const branches: HTMLElement[] = [];
  let current: HTMLElement | null = dialogEl;
  while (current && current !== document.body) {
    const parent: HTMLElement | null = current.parentElement;
    if (!parent) break;
    Array.from(parent.children).forEach((child) => {
      if (child instanceof HTMLElement && child !== current && !child.contains(dialogEl)) {
        branches.push(child);
      }
    });
    if (parent === container) break;
    current = parent;
  }
  return branches;
}

/** The isolated branch that holds the app header + main viewport. */
function contentBranch(container: HTMLElement, dialogEl: HTMLElement): HTMLElement {
  const branch = isolatedBranches(container, dialogEl).find((el) => el.querySelector('header'));
  expect(branch).toBeDefined();
  return branch!;
}

describe.each([
  ['DashboardLayout', DashboardLayout, 'sola-mobile-navigation'],
  ['OnboardingPage', OnboardingPage, 'sola-onboarding-navigation'],
])('%s — reversible background isolation (real layout)', (_name, Component, drawerId) => {
  let media: ReturnType<typeof installMatchMedia>;

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    document.body.style.overflow = '';
    media = installMatchMedia(false);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    media.restore();
    document.body.innerHTML = '';
    document.body.style.overflow = '';
    vi.restoreAllMocks();
  });

  /** Open the drawer and settle the hook's deferred focus + isolation timers. */
  async function openAndSettle(container: HTMLElement): Promise<HTMLButtonElement> {
    const trigger = openDrawer(container, drawerId as string);
    await advance();
    return trigger;
  }

  it('should render the drawer as a labelled modal dialog', async () => {
    const { container, unmount } = render(React.createElement(Component, null, null));
    await flush();

    expect(dialog(container)).toBeNull();

    await openAndSettle(container);

    const drawer = dialog(container);
    expect(drawer).not.toBeNull();
    expect(drawer!.id).toBe(drawerId as string);
    expect(drawer!.getAttribute('aria-modal')).toBe('true');
    expect(drawer!.getAttribute('aria-label')).toBe(DRAWER_LABEL);
    unmount();
  });

  it('should make background siblings inert and aria-hidden while open', async () => {
    const { container, unmount } = render(React.createElement(Component, null, null));
    await flush();

    await openAndSettle(container);

    const drawer = dialog(container)!;
    const branches = isolatedBranches(container, drawer);
    expect(branches.length).toBeGreaterThan(0);

    // Every sibling branch of the dialog is inert + aria-hidden.
    for (const el of branches) {
      expect(el.hasAttribute('inert')).toBe(true);
      expect(el.getAttribute('aria-hidden')).toBe('true');
    }

    // The visible page branch (header + main) is isolated too.
    const page = contentBranch(container, drawer);
    expect(page.hasAttribute('inert')).toBe(true);
    expect(page.querySelector('header')).not.toBeNull();
    expect(page.querySelector('main')).not.toBeNull();

    // The dialog itself must never be hidden.
    expect(drawer.hasAttribute('inert')).toBe(false);
    expect(drawer.getAttribute('aria-hidden')).toBeNull();
    unmount();
  });

  it('should keep background focus out of the dialog and contain Tab in it', async () => {
    const { container, unmount } = render(React.createElement(Component, null, null));
    await flush();

    await openAndSettle(container);

    const drawer = dialog(container)!;
    const page = contentBranch(container, drawer);
    const backgroundFocusable = findAll(page, 'button, a[href], input').filter(
      (el) => !el.hasAttribute('disabled')
    );

    // Programmatic focus on background targets must not take focus while open.
    if (backgroundFocusable.length > 0) {
      backgroundFocusable[0].focus();
      const active = document.activeElement as HTMLElement | null;
      expect(drawer.contains(active) || active === document.body).toBe(true);
    }

    // Tab cycles inside the dialog, never leaving it.
    const drawerFocusable = findAll(drawer, 'button, a[href], input');
    expect(drawerFocusable.length).toBeGreaterThan(0);
    drawerFocusable[0].focus();
    pressKey('Tab', drawerFocusable[0]);
    await flush();

    const afterTab = document.activeElement as HTMLElement | null;
    expect(afterTab).not.toBeNull();
    expect(drawer.contains(afterTab)).toBe(true);
    unmount();
  });

  it('should restore prior inert/aria-hidden/overflow state on close', async () => {
    const { container, unmount } = render(React.createElement(Component, null, null));
    await flush();

    // Capture the branch that WILL be isolated, before opening. `header`'s parent
    // is the shell's content sibling — the same live node the hook isolates.
    const header = container.querySelector('header')!;
    const liveBranch = header.parentElement!;
    expect(liveBranch).not.toBeNull();

    // Pre-existing state on the isolated branch itself, plus a nested override.
    liveBranch.setAttribute('aria-hidden', 'false');
    header.setAttribute('data-preexisting', 'kept');
    document.body.style.overflow = 'scroll';

    await openAndSettle(container);

    // The hook isolated the exact live branch and did not replace it.
    expect(header.parentElement).toBe(liveBranch);
    expect(liveBranch.hasAttribute('inert')).toBe(true);
    expect(liveBranch.getAttribute('aria-hidden')).toBe('true');
    // The dialog must never sit under a hidden/inert ancestor.
    const drawer = dialog(container)!;
    expect(liveBranch.contains(drawer)).toBe(false);
    expect(drawer.getAttribute('aria-hidden')).toBeNull();
    expect(drawer.hasAttribute('inert')).toBe(false);

    // Escape closes and restores everything verbatim.
    pressKey('Escape');
    await flush();

    expect(dialog(container)).toBeNull();
    expect(liveBranch.hasAttribute('inert')).toBe(false);
    // Pre-existing value restored exactly, not removed.
    expect(liveBranch.getAttribute('aria-hidden')).toBe('false');
    // A nested node's own attribute was never touched.
    expect(header.getAttribute('data-preexisting')).toBe('kept');
    expect(document.body.style.overflow).toBe('scroll');

    unmount();
  });

  it('should not re-isolate the background when closed before the timer runs', async () => {
    const { container, unmount } = render(React.createElement(Component, null, null));
    await flush();

    const header = container.querySelector('header')!;
    const liveBranch = header.parentElement!;
    expect(liveBranch.hasAttribute('inert')).toBe(false);

    // Open, then close before the deferred isolation/focus timer fires.
    const trigger = openDrawer(container, drawerId as string);
    pressKey('Escape');
    await flush();
    // Now let any pending timers run: a leftover callback must not isolate.
    await advance();

    expect(dialog(container)).toBeNull();
    expect(liveBranch.hasAttribute('inert')).toBe(false);
    expect(liveBranch.getAttribute('aria-hidden')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(trigger);

    unmount();
  });

  it('should return focus to the trigger after Escape', async () => {
    const { container, unmount } = render(React.createElement(Component, null, null));
    await flush();

    const trigger = await openAndSettle(container);
    expect(dialog(container)).not.toBeNull();

    pressKey('Escape');
    await flush();

    expect(dialog(container)).toBeNull();
    expect(document.activeElement).toBe(trigger);
    unmount();
  });

  it('should release isolation when the viewport reaches the desktop breakpoint', async () => {
    const { container, unmount } = render(React.createElement(Component, null, null));
    await flush();

    await openAndSettle(container);

    const page = contentBranch(container, dialog(container)!);
    expect(page.hasAttribute('inert')).toBe(true);
    expect(media.listenerCount()).toBeGreaterThan(0);

    // Simulate a resize past lg: the drawer closes and isolation is released.
    media.resizeToDesktop();
    await flush();

    expect(dialog(container)).toBeNull();
    expect(page.hasAttribute('inert')).toBe(false);
    expect(page.getAttribute('aria-hidden')).toBeNull();

    // The media listener is cleaned up when the drawer closes.
    expect(media.listenerCount()).toBe(0);
    unmount();
  });
});
