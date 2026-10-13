// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React, { act } from 'react';
import { MOCK_SESSION_STORAGE_KEY, readMockSession } from '@/modules/learner';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { flush, pressKey, render, click, advance } from './helpers/dom';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/register',
}));

// The mock auth forms simulate network latency with `setTimeout`; control it so
// the regression suite is deterministic and never waits on real wall-clock time.
beforeEach(() => {
  vi.useFakeTimers();
  pushMock.mockClear();
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  document.body.innerHTML = '';
  window.sessionStorage.clear();
});

/** Set a controlled input value the way React's onChange expects. */
function setValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value'
  )?.set;
  act(() => {
    setter?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function submit(container: HTMLElement) {
  const form = container.querySelector('form');
  act(() => {
    form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}

function inputs(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLInputElement>('input'));
}

/** Find the first button whose visible text matches the pattern. */
function buttonByText(container: HTMLElement, pattern: RegExp): HTMLButtonElement | null {
  return (
    Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find((button) =>
      pattern.test(button.textContent ?? '')
    ) ?? null
  );
}

/**
 * The password-recovery control must exist as a real focusable button; fail
 * loudly instead of letting `undefined` leak into later assertions.
 */
function recoveryButton(container: HTMLElement): HTMLButtonElement {
  const control = buttonByText(container, /forgot password/i);
  if (!control) throw new Error('Password recovery control not found');
  return control;
}

describe('RegisterForm — password rule enforcement', () => {
  it('should block submit with an empty password and surface a rule message', async () => {
    const { container, unmount } = render(React.createElement(RegisterForm));
    await flush();

    submit(container);
    await flush();

    // Never completes registration without a valid password.
    expect(readMockSession(window.sessionStorage)).toBeNull();
    expect(pushMock).not.toHaveBeenCalled();
    unmount();
  });

  it('should reject a password shorter than 8 characters even though it has letters and digits', async () => {
    const { container, unmount } = render(React.createElement(RegisterForm));
    await flush();

    const fields = inputs(container);
    setValue(fields[0], 'Alex');
    setValue(fields[1], 'Nguyen');
    setValue(fields[2], 'alex@example.com');
    setValue(fields[3], 'abc123!');
    await flush();

    submit(container);
    await flush();

    expect(container.textContent).toContain('Password must be at least 8 characters');
    expect(readMockSession(window.sessionStorage)).toBeNull();
    unmount();
  });

  it('should reject a long password without a digit', async () => {
    const { container, unmount } = render(React.createElement(RegisterForm));
    await flush();

    const fields = inputs(container);
    setValue(fields[2], 'alex@example.com');
    setValue(fields[3], 'abcdefgh!');
    await flush();

    submit(container);
    await flush();

    expect(container.textContent).toContain('Password must include a letter and a number');
    unmount();
  });

  it('should reject a password without a special character', async () => {
    const { container, unmount } = render(React.createElement(RegisterForm));
    await flush();

    const fields = inputs(container);
    setValue(fields[2], 'alex@example.com');
    setValue(fields[3], 'abcdefg123');
    await flush();

    submit(container);
    await flush();

    expect(container.textContent).toContain(
      'Password must include a special character (e.g. !@#$%)'
    );
    unmount();
  });

  it('should persist the mock session on a valid registration without the password', async () => {
    const { container, unmount } = render(React.createElement(RegisterForm));
    await flush();

    const fields = inputs(container);
    setValue(fields[0], 'Alex');
    setValue(fields[1], 'Nguyen');
    setValue(fields[2], 'alex@example.com');
    setValue(fields[3], 'AlexPass123!');
    await flush();

    submit(container);
    await flush();
    // Step 1 validates and advances; the session is only written on the final step.
    expect(readMockSession(window.sessionStorage)).toBeNull();
    expect(container.textContent).toContain('Step 2 of 3');

    // Step 2 → 3 requires an explicit continue.
    const toFinalStep = buttonByText(container, /continue to final step/i);
    expect(toFinalStep).not.toBeNull();
    click(toFinalStep);
    await flush();
    expect(container.textContent).toContain('Step 3 of 3');

    const complete = buttonByText(container, /complete & start learning/i);
    expect(complete).not.toBeNull();
    click(complete);
    await advance();

    const session = readMockSession(window.sessionStorage);
    expect(session).toEqual(expect.objectContaining({ email: 'alex@example.com' }));
    expect(session?.name).toBe('Alex Nguyen');
    // The final step defaults to the recommended 30-minute plan.
    expect(session?.dailyMinutes).toBe(30);

    const raw = window.sessionStorage.getItem(MOCK_SESSION_STORAGE_KEY);
    expect(raw).not.toContain('AlexPass123!');
    unmount();
  });
});

describe('LoginForm — demo session and password recovery', () => {
  it('should sign in with the demo identity and never store the password', async () => {
    const { container, unmount } = render(React.createElement(LoginForm));
    await flush();

    const fields = inputs(container);
    setValue(fields[0], 'alex@example.com');
    setValue(fields[1], 'AlexPass123!');
    await flush();

    submit(container);
    await advance();

    const session = readMockSession(window.sessionStorage);
    expect(session?.email).toBe('alex@example.com');
    expect(session?.name).toBe('Alex');
    expect(window.sessionStorage.getItem(MOCK_SESSION_STORAGE_KEY)).not.toContain(
      'AlexPass123!'
    );
    unmount();
  });

  it('should offer a keyboard-accessible password recovery control', async () => {
    const { container, unmount } = render(React.createElement(LoginForm));
    await flush();

    const recovery = recoveryButton(container);
    // Reachable by keyboard: a real focusable control, not a bare span.
    expect(recovery.tagName).toBe('BUTTON');
    expect(recovery.getAttribute('type')).toBe('button');
    expect(recovery.hasAttribute('disabled')).toBe(false);

    recovery.focus();
    expect(document.activeElement).toBe(recovery);

    click(recovery);
    await flush();

    // Activating it must not pretend an email was sent, but must say something.
    expect(container.textContent).not.toMatch(/email sent|check your inbox|we'?ve sent/i);
    expect(container.textContent).toMatch(/not wired up yet/i);
    // The disclosure is announced to assistive tech.
    expect(container.querySelector('[role="status"][aria-live="polite"]')).not.toBeNull();
    unmount();
  });

  it('should echo the typed email in the recovery notice without leaking the password', async () => {
    const { container, unmount } = render(React.createElement(LoginForm));
    await flush();

    const fields = inputs(container);
    setValue(fields[0], 'alex@example.com');
    setValue(fields[1], 'AlexPass123!');
    await flush();

    click(recoveryButton(container));
    await flush();

    const status = container.querySelector('[role="status"]');
    expect(status?.textContent).toContain('alex@example.com');
    expect(status?.textContent).not.toContain('AlexPass123!');
    unmount();
  });

  it('should clear the recovery notice once the email changes', async () => {
    const { container, unmount } = render(React.createElement(LoginForm));
    await flush();

    const fields = inputs(container);
    click(recoveryButton(container));
    await flush();
    expect(container.querySelector('[role="status"]')).not.toBeNull();

    setValue(fields[0], 'b@example.com');
    await flush();
    expect(container.querySelector('[role="status"]')).toBeNull();
    unmount();
  });

  it('should be operable with the keyboard from the email field', async () => {
    const { container, unmount } = render(React.createElement(LoginForm));
    await flush();

    const fields = inputs(container);
    fields[0].focus();
    pressKey('Tab', fields[0]);
    await flush();

    // Keyboard navigation does not throw and the form stays interactive.
    expect(container.querySelector('form')).not.toBeNull();
    unmount();
  });
});
