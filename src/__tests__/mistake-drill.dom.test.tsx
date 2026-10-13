// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { PracticeMistakeRunner } from '@/modules/mistakes/components/PracticeMistakeRunner';
import { findAll, flush, render } from './helpers/dom';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/mistakes/mis-2/practice',
}));

describe('PracticeMistakeRunner — route id resolution', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render the drill for a valid mistake id', async () => {
    const { container, unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-2' })
    );
    await flush();

    expect(container.textContent).not.toContain('Practice drill not found');
    // The drill's own fixture content is rendered, not a hardcoded frame.
    expect(container.textContent).toContain('Quick practice');
    unmount();
  });

  it('should show an explicit invalid state for an unknown id (no silent default)', async () => {
    const { container, unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-does-not-exist' })
    );
    await flush();

    expect(container.textContent).toContain('Practice drill not found');
    expect(container.textContent).toContain('mis-does-not-exist');
    // The default drill must NOT leak through.
    expect(container.textContent).not.toContain('Quick practice');
    unmount();
  });

  it('should show the invalid state for an empty id', async () => {
    const { container, unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: '' })
    );
    await flush();

    expect(container.textContent).toContain('Practice drill not found');
    expect(container.textContent).toContain('(empty id)');
    unmount();
  });

  it('should offer a route back to the mistake notebook from the invalid state', async () => {
    const { container, unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: 'nope' })
    );
    await flush();

    const back = findAll(container, 'button').find((button) =>
      (button.textContent ?? '').includes('Back to Mistakes')
    );
    expect(back).not.toBeNull();

    back?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await flush();
    expect(pushMock).toHaveBeenCalledWith('/mistakes');
    unmount();
  });

  it('should render the comparison boxes from the resolved drill fixture', async () => {
    const { container, unmount } = render(
      React.createElement(PracticeMistakeRunner, { mistakeId: 'mis-2' })
    );
    await flush();

    // The "am agree" mistake sentence comes from the fixture, emphasised rather
    // than hardcoded in the component.
    expect(container.textContent).toContain('I am agree with you.');
    expect(container.textContent).toContain('I agree with you.');
    unmount();
  });
});
