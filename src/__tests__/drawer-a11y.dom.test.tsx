// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { getFocusableElements, readBodyOverflow } from '@/shared/hooks/use-drawer-focus';

/**
 * Focus/scroll behaviour of the shared modal helper.
 *
 * The hook itself is exercised through a real dialog fixture (the same DOM shape
 * the dashboard drawer renders) so the assertions cover the code the UI uses.
 */

interface FixtureProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  outsideFocusRef?: React.RefObject<HTMLButtonElement | null>;
}

function DialogFixture({ isOpen, onClose, triggerRef, outsideFocusRef }: FixtureProps) {
  const { dialogRef } = useModalA11y({ isOpen, onClose, triggerRef });

  return React.createElement(
    'div',
    null,
    React.createElement(
      'button',
      { ref: triggerRef, type: 'button', id: 'trigger' },
      'Open menu'
    ),
    outsideFocusRef
      ? React.createElement('button', { ref: outsideFocusRef, type: 'button', id: 'outside' }, 'Outside')
      : null,
    isOpen
      ? React.createElement(
          'div',
          {
            ref: dialogRef,
            role: 'dialog',
            'aria-modal': 'true',
            'aria-label': 'Navigation menu',
            tabIndex: -1,
            id: 'dialog',
          },
          React.createElement('a', { href: '/home', id: 'nav-home' }, 'Home'),
          React.createElement('button', { type: 'button', id: 'close' }, 'Close')
        )
      : null
  );
}

// Imported after the fixture so the module graph mirrors the UI usage.
const { useModalA11y } = await import('@/shared/hooks/use-drawer-focus');

async function renderDialog(props: FixtureProps) {
  const { render, flush } = await import('./helpers/dom');
  const result = render(React.createElement(DialogFixture, props));
  await flush();
  return result;
}

describe('useModalA11y (shared drawer/dialog behaviour)', () => {
  let onClose: () => void;
  let closeCount: number;

  beforeEach(() => {
    closeCount = 0;
    onClose = () => {
      closeCount += 1;
    };
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should render nothing focus-trapping while closed but keep scroll untouched', async () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    const { container, unmount } = await renderDialog({ isOpen: false, onClose, triggerRef });

    expect(container.querySelector('#dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    unmount();
  });

  it('should expose dialog semantics with an accessible name when open', async () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    const { container, unmount } = await renderDialog({ isOpen: true, onClose, triggerRef });

    const dialog = container.querySelector('#dialog');
    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute('role')).toBe('dialog');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.getAttribute('aria-label')).toBe('Navigation menu');
    unmount();
  });

  it('should lock page scroll while open and restore the previous value on unmount', async () => {
    document.body.style.overflow = 'scroll';
    const triggerRef = React.createRef<HTMLButtonElement>();

    const { unmount } = await renderDialog({ isOpen: true, onClose, triggerRef });
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    // The pre-existing inline value is restored, not blindly reset to `unset`.
    expect(document.body.style.overflow).toBe('scroll');
    expect(readBodyOverflow()).toBe('scroll');
  });

  it('should close on Escape', async () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    const { pressKey } = await import('./helpers/dom');
    const { unmount } = await renderDialog({ isOpen: true, onClose, triggerRef });

    pressKey('Escape');
    expect(closeCount).toBe(1);
    unmount();
  });

  it('should return focus to the trigger when the dialog closes', async () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    const { rerender, unmount } = await renderDialog({
      isOpen: true,
      onClose,
      triggerRef,
    });

    // Focus moved into the dialog on open.
    expect(document.activeElement?.id).not.toBe('trigger');

    rerender(React.createElement(DialogFixture, { isOpen: false, onClose, triggerRef }));
    expect(document.activeElement?.id).toBe('trigger');
    unmount();
  });

  it('should contain Tab within the dialog and wrap Shift+Tab to the last item', async () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    const { pressKey } = await import('./helpers/dom');
    const { container, unmount } = await renderDialog({
      isOpen: true,
      onClose,
      triggerRef,
    });

    const close = container.querySelector<HTMLElement>('#close');
    const home = container.querySelector<HTMLElement>('#nav-home');
    expect(close && home).toBeTruthy();

    close?.focus();
    pressKey('Tab');
    // Tab from the last focusable wraps to the first.
    expect(document.activeElement?.id).toBe('nav-home');

    pressKey('Tab', document, { shiftKey: true });
    // Shift+Tab from the first focusable wraps to the last.
    expect(document.activeElement?.id).toBe('close');
    unmount();
  });

  it('should exclude hidden and inert elements from the focusable list', async () => {
    const container = document.createElement('div');

    const displayNone = document.createElement('button');
    displayNone.id = 'display-none';
    displayNone.style.display = 'none';

    const visibilityHidden = document.createElement('button');
    visibilityHidden.id = 'visibility-hidden';
    visibilityHidden.style.visibility = 'hidden';

    const hiddenAttr = document.createElement('button');
    hiddenAttr.id = 'hidden-attr';
    hiddenAttr.setAttribute('hidden', '');

    const inertWrapper = document.createElement('div');
    inertWrapper.setAttribute('inert', '');
    const inertChild = document.createElement('button');
    inertChild.id = 'inert-child';
    inertWrapper.append(inertChild);

    const disabled = document.createElement('button');
    disabled.id = 'disabled';
    disabled.setAttribute('disabled', '');

    const visible = document.createElement('button');
    visible.id = 'visible';

    container.append(
      displayNone,
      visibilityHidden,
      hiddenAttr,
      inertWrapper,
      disabled,
      visible
    );
    document.body.append(container);

    const focusable = getFocusableElements(container);
    const ids = focusable.map((element) => element.id);

    // Only the genuinely reachable control is listed.
    expect(ids).toEqual(['visible']);
    expect(ids).not.toContain('display-none');
    expect(ids).not.toContain('visibility-hidden');
    expect(ids).not.toContain('hidden-attr');
    expect(ids).not.toContain('inert-child');
    expect(ids).not.toContain('disabled');

    container.remove();
  });
});
