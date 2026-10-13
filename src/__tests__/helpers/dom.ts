import React from 'react';
import { act } from 'react';
import { vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';

// React 19 requires this flag for `act()` outside react-dom/test-utils.
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

export interface RenderResult {
  container: HTMLElement;
  unmount: () => void;
  rerender: (element: React.ReactElement) => void;
}

/**
 * Minimal React 19 test renderer built on `react-dom/client` + `react.act`.
 *
 * Deliberately avoids adding a testing-library dependency: the component suites
 * only need real DOM mounting, querying and event dispatch.
 */
export function render(element: React.ReactElement): RenderResult {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(element);
  });

  return {
    container,
    rerender: (next: React.ReactElement) => {
      act(() => {
        root.render(next);
      });
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

/** Dispatch a bubbling click on an element inside act(). */
export function click(element: Element | null): void {
  if (!element) throw new Error('click(): element not found');
  act(() => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
}

/** Fire a keyboard event on document (bubbling) inside act(). */
export function pressKey(
  key: string,
  target: EventTarget = document,
  options: KeyboardEventInit = {}
): void {
  act(() => {
    target.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options })
    );
  });
}

/** Settle pending promise callbacks (effects triggered by async loaders). */
export async function flush(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

/**
 * Advance the simulated `setTimeout` latency the mock auth forms use, then
 * settle the resulting state updates. Requires `vi.useFakeTimers()`.
 */
export async function advance(ms = 1000): Promise<void> {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
  await flush();
}

export function findAll(container: HTMLElement, selector: string): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

export function find(container: HTMLElement, selector: string): HTMLElement | null {
  return container.querySelector<HTMLElement>(selector);
}

export function byText(container: HTMLElement, text: string): HTMLElement | null {
  return (
    findAll(container, 'button, a, [role="radio"], [role="menuitem"]').find((element) =>
      (element.textContent ?? '').includes(text)
    ) ?? null
  );
}
