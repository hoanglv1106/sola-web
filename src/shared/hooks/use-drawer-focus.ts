'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => isVisibleFocusable(element)
  );
}

/**
 * Whether an element can actually receive focus.
 *
 * An element that is `display:none`, `visibility:hidden`, `hidden` or inside an
 * `inert` subtree must be skipped by the focus trap, otherwise Tab would move
 * focus to something the user cannot see. `offsetParent` is the cheapest real
 * signal, but it is not available in DOM implementations without layout, so the
 * explicit attribute/computed-style checks run as well.
 */
function isVisibleFocusable(element: HTMLElement): boolean {
  if (element === document.activeElement) return true;
  if (element.hasAttribute('hidden') || element.hasAttribute('inert')) return false;
  if (element.closest('[inert], [hidden]')) return false;

  const view = element.ownerDocument?.defaultView;
  if (view && typeof view.getComputedStyle === 'function') {
    const style = view.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    if (style.getPropertyValue('visibility') === 'hidden') return false;
  }

  return element.offsetParent !== null;
}

/**
 * Normalise a `document.body.style.overflow` value into the raw inline value so
 * it can be restored verbatim when a modal/drawer closes.
 */
export function readBodyOverflow(): string {
  if (typeof document === 'undefined') return '';
  return document.body.style.overflow;
}

export interface UseModalA11yOptions {
  isOpen: boolean;
  onClose: () => void;
  /** Return focus here when the dialog closes (usually the trigger button). */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /**
   * Element that contains the dialog. Its siblings are treated as "background"
   * and isolated while the dialog is open. Defaults to the dialog's parent.
   */
  backgroundRoot?: React.RefObject<HTMLElement | null>;
}

export interface UseModalA11yResult {
  /** Attach to the dialog container element. */
  dialogRef: React.RefObject<HTMLDivElement | null>;
}

interface IsolatedElement {
  element: HTMLElement;
  hadInert: boolean;
  previousInert: string | null;
  hadAriaHidden: boolean;
  previousAriaHidden: string | null;
}

/**
 * Hide everything outside the dialog from both assistive tech and the tab order.
 *
 * Walks up from the dialog and isolates its siblings at every ancestor level up
 * to (and including) `document.body`. Siblings are the only elements that can
 * safely take `aria-hidden`/`inert`: an *ancestor* of the dialog must never be
 * touched, because hiding it would hide the dialog too. This is why the app
 * shell's header/main — nested inside a sibling branch rather than being direct
 * siblings of the dialog — are still reached.
 *
 * `inert` blocks focus, pointer events and the accessibility tree; `aria-hidden`
 * mirrors it for engines without inert support. Every mutated attribute is
 * recorded so the exact prior state can be restored verbatim on close/unmount.
 */
export function isolateBackground(
  dialog: HTMLElement,
  backgroundRoot?: HTMLElement | null
): IsolatedElement[] {
  const boundary = backgroundRoot ?? document.body;
  const isolated: IsolatedElement[] = [];

  const applyTo = (element: HTMLElement) => {
    if (element === dialog || element.contains(dialog) || dialog.contains(element)) return;
    // Never isolate the same element twice (nested sibling walks can overlap).
    if (isolated.some((entry) => entry.element === element)) return;
    isolated.push({
      element,
      hadInert: element.hasAttribute('inert'),
      previousInert: element.getAttribute('inert'),
      hadAriaHidden: element.hasAttribute('aria-hidden'),
      previousAriaHidden: element.getAttribute('aria-hidden'),
    });
    element.setAttribute('inert', '');
    element.setAttribute('aria-hidden', 'true');
  };

  // Walk from the dialog upward, isolating siblings at each level.
  let current: HTMLElement | null = dialog;
  while (current && current !== document.body) {
    const parent: HTMLElement | null = current.parentElement;
    if (!parent) break;

    Array.from(parent.children).forEach((child) => {
      if (child instanceof HTMLElement && child !== current) applyTo(child);
    });

    if (parent === boundary) break;
    current = parent;
  }

  return isolated;
}

/** Restore each isolated element to the exact attribute state it had before. */
export function restoreIsolated(isolated: IsolatedElement[]): void {
  isolated.forEach(
    ({ element, hadInert, previousInert, hadAriaHidden, previousAriaHidden }) => {
      if (hadInert && previousInert !== null) {
        element.setAttribute('inert', previousInert);
      } else {
        element.removeAttribute('inert');
      }

      if (hadAriaHidden && previousAriaHidden !== null) {
        element.setAttribute('aria-hidden', previousAriaHidden);
      } else {
        element.removeAttribute('aria-hidden');
      }
    }
  );
}

/**
 * Keyboard + scroll + background behaviour shared by the mobile drawer and the
 * onboarding overlay:
 *
 * - Escape closes the dialog;
 * - Tab / Shift+Tab are contained inside the dialog;
 * - the page scroll is locked while open and the *previous* inline overflow value
 *   is restored on close and on unmount (never blindly reset to `unset`);
 * - background siblings are made `inert` + `aria-hidden` and restored verbatim;
 * - focus moves into the dialog on open and returns to the trigger on close.
 */
export function useModalA11y({
  isOpen,
  onClose,
  triggerRef,
  backgroundRoot,
}: UseModalA11yOptions): UseModalA11yResult {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    const previouslyFocused =
      triggerRef?.current ?? (document.activeElement as HTMLElement | null);
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    // Isolate the background so screen readers and programmatic focus cannot
    // escape the dialog. Applied after paint so `dialogRef` is populated.
    let isolated: IsolatedElement[] = [];
    const isolateTimer = window.setTimeout(() => {
      if (dialogRef.current) {
        isolated = isolateBackground(dialogRef.current, backgroundRoot?.current);
      }
    }, 0);

    // Move focus into the dialog after paint so the element exists.
    const focusTimer = window.setTimeout(() => {
      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        dialogRef.current?.focus();
      }
    }, 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !dialogRef.current?.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last || !dialogRef.current?.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.clearTimeout(isolateTimer);
      document.removeEventListener('keydown', handleKeyDown);
      restoreIsolated(isolated);
      isolated = [];
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose, triggerRef, backgroundRoot]);

  return { dialogRef };
}

/**
 * Lock page scroll while a drawer is open and restore the value that was present
 * before it opened (including an empty inline value).
 */
export function useScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked || typeof document === 'undefined') return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocked]);
}
