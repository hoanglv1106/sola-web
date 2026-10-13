// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { MOCK_SESSION_STORAGE_KEY, readMockSession } from '@/modules/learner';
import { click, findAll, flush, pressKey, render } from './helpers/dom';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/home',
}));

const { AppHeader } = await import('@/widgets/app-header/AppHeader');

function findByText(container: HTMLElement, text: string): HTMLElement | null {
  return (
    findAll(container, 'button, a').find((element) =>
      (element.textContent ?? '').includes(text)
    ) ?? null
  );
}

describe('AppHeader — mock profile and logout', () => {
  beforeEach(() => {
    pushMock.mockClear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    window.sessionStorage.clear();
  });

  it('should render the explicit guest profile when there is no session', async () => {
    const { container, unmount } = render(React.createElement(AppHeader));
    await flush();

    expect(container.textContent).toContain('Guest Learner');
    expect(container.textContent).toContain('Log in to save progress');
    unmount();
  });

  it('should derive the display profile from the stored mock session', async () => {
    window.sessionStorage.setItem(
      MOCK_SESSION_STORAGE_KEY,
      JSON.stringify({ name: 'Alex Nguyen', email: 'alex@example.com' })
    );

    const { container, unmount } = render(React.createElement(AppHeader));
    await flush();

    expect(container.textContent).toContain('Alex Nguyen');
    expect(container.textContent).toContain('Keep going!');
    unmount();
  });

  it('should fall back to the guest profile when storage holds malformed JSON', async () => {
    window.sessionStorage.setItem(MOCK_SESSION_STORAGE_KEY, '{broken');

    const { container, unmount } = render(React.createElement(AppHeader));
    await flush();

    expect(container.textContent).toContain('Guest Learner');
    unmount();
  });

  it('should open and close the account menu with proper ARIA state', async () => {
    const { container, unmount } = render(React.createElement(AppHeader));
    await flush();

    const trigger = findAll(container, 'button').find((button) =>
      (button.getAttribute('aria-label') ?? '').startsWith('Account menu for')
    );
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    click(trigger ?? null);
    await flush();

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(container.textContent).toContain('Not signed in');
    unmount();
  });

  it('should close the account menu on Escape and return focus to the trigger', async () => {
    const { container, unmount } = render(React.createElement(AppHeader));
    await flush();

    const trigger = findAll(container, 'button').find((button) =>
      (button.getAttribute('aria-label') ?? '').startsWith('Account menu for')
    );
    click(trigger ?? null);
    await flush();
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    pressKey('Escape');
    await flush();

    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
    unmount();
  });

  it('should clear the stored session and navigate to login on sign out', async () => {
    window.sessionStorage.setItem(
      MOCK_SESSION_STORAGE_KEY,
      JSON.stringify({ name: 'Alex Nguyen', email: 'alex@example.com' })
    );

    const { container, unmount } = render(React.createElement(AppHeader));
    await flush();

    const trigger = findAll(container, 'button').find((button) =>
      (button.getAttribute('aria-label') ?? '').startsWith('Account menu for')
    );
    click(trigger ?? null);
    await flush();

    const signOut = findByText(container, 'Sign out');
    expect(signOut).not.toBeNull();
    click(signOut);
    await flush();

    expect(readMockSession(window.sessionStorage)).toBeNull();
    expect(pushMock).toHaveBeenCalledWith('/login');
    // The header immediately reflects the guest profile.
    expect(container.textContent).toContain('Guest Learner');
    unmount();
  });

  it('should label the search field for assistive tech', async () => {
    const { container, unmount } = render(React.createElement(AppHeader));
    await flush();

    const input = container.querySelector('input[type="search"]');
    expect(input).not.toBeNull();
    const label = container.querySelector(`label[for="${input?.id}"]`);
    expect(label?.textContent).toContain('Search');
    unmount();
  });

  it('should expose the menu toggle with aria-expanded/aria-controls', async () => {
    const onMenuToggle = vi.fn();
    const { container, unmount } = render(
      React.createElement(AppHeader, {
        onMenuToggle,
        menuControlsId: 'sola-mobile-navigation',
        isMenuOpen: true,
      })
    );
    await flush();

    const toggle = findAll(container, 'button').find((button) =>
      (button.getAttribute('aria-label') ?? '').includes('navigation menu')
    );
    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    expect(toggle?.getAttribute('aria-controls')).toBe('sola-mobile-navigation');

    click(toggle ?? null);
    expect(onMenuToggle).toHaveBeenCalledTimes(1);
    unmount();
  });
});
