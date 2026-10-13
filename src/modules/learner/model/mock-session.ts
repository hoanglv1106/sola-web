/**
 * Explicit mock-session adapter.
 *
 * SOLA has no backend yet: authentication is an intentional, clearly-labelled
 * simulation backed by `sessionStorage`. Nothing here is real auth, and no
 * password is ever persisted.
 */

export const MOCK_SESSION_STORAGE_KEY = 'sola_auth_user';

export interface MockSession {
  /** Display name shown in the header and greeting copy. */
  name: string;
  email: string;
  /** Optional onboarding/registration extras. */
  goal?: string;
  dailyMinutes?: number;
  registeredAt?: string;
}

export interface SessionStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const GUEST_SESSION: MockSession = {
  name: 'Guest Learner',
  email: '',
};

function resolveStorage(
  storage?: SessionStorageLike | null
): SessionStorageLike | null {
  if (storage !== undefined) return storage;
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    // Storage can throw when blocked by browser privacy settings.
    return null;
  }
}

function toNonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/**
 * Read the mock session. Malformed, partial or blocked storage falls back to the
 * guest session so the UI always has a coherent profile to render.
 */
export function readMockSession(
  storage?: SessionStorageLike | null
): MockSession | null {
  const store = resolveStorage(storage);
  if (!store) return null;

  let raw: string | null = null;
  try {
    raw = store.getItem(MOCK_SESSION_STORAGE_KEY);
  } catch {
    return null;
  }

  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== 'object') return null;

  const record = parsed as Record<string, unknown>;
  const email = toNonEmptyString(record.email) ?? '';
  const name = toNonEmptyString(record.name) ?? (email ? email.split('@')[0] : null);

  if (!name) return null;

  const dailyMinutes =
    typeof record.dailyMinutes === 'number' && Number.isFinite(record.dailyMinutes)
      ? record.dailyMinutes
      : undefined;

  return {
    name,
    email,
    goal: toNonEmptyString(record.goal) ?? undefined,
    dailyMinutes,
    registeredAt: toNonEmptyString(record.registeredAt) ?? undefined,
  };
}

/** Persist the mock session. Passwords are stripped and never written. */
export function writeMockSession(
  session: MockSession,
  storage?: SessionStorageLike | null
): boolean {
  const store = resolveStorage(storage);
  if (!store) return false;

  const safeSession: MockSession = {
    name: session.name,
    email: session.email,
    goal: session.goal,
    dailyMinutes: session.dailyMinutes,
    registeredAt: session.registeredAt,
  };

  try {
    store.setItem(MOCK_SESSION_STORAGE_KEY, JSON.stringify(safeSession));
    return true;
  } catch {
    return false;
  }
}

export function clearMockSession(storage?: SessionStorageLike | null): boolean {
  const store = resolveStorage(storage);
  if (!store) return false;
  try {
    store.removeItem(MOCK_SESSION_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve the profile to display. Falls back to the explicit guest profile when
 * there is no session, which keeps `/home` usable without any login.
 */
export function resolveDisplayProfile(
  storage?: SessionStorageLike | null
): MockSession {
  return readMockSession(storage) ?? GUEST_SESSION;
}

export function isGuestSession(session: MockSession): boolean {
  return session.name === GUEST_SESSION.name && !session.email;
}

/** Derive the avatar fallback letter from the session name. */
export function getProfileInitial(session: MockSession): string {
  const initial = session.name.trim().charAt(0);
  return initial ? initial.toUpperCase() : 'S';
}

/** Short greeting label used next to the avatar. */
export function getProfileGreeting(session: MockSession): string {
  return isGuestSession(session) ? 'Log in to save progress' : 'Keep going!';
}
