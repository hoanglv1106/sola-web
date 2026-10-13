import { describe, it, expect, beforeEach } from 'vitest';
// Production mock-session adapter (no test-local reimplementation).
import {
  MOCK_SESSION_STORAGE_KEY,
  GUEST_SESSION,
  readMockSession,
  writeMockSession,
  clearMockSession,
  resolveDisplayProfile,
  isGuestSession,
  getProfileInitial,
  getProfileGreeting,
  type SessionStorageLike,
} from '@/modules/learner';

/** In-memory stand-in for window.sessionStorage. */
function createStorage(initial: Record<string, string> = {}): SessionStorageLike & {
  dump: () => Record<string, string>;
} {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key) => (map.has(key) ? (map.get(key) as string) : null),
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
    dump: () => Object.fromEntries(map.entries()),
  };
}

/** Storage that throws on every access, simulating blocked browser storage. */
function createBlockedStorage(): SessionStorageLike {
  return {
    getItem: () => {
      throw new Error('SecurityError: storage blocked');
    },
    setItem: () => {
      throw new Error('SecurityError: storage blocked');
    },
    removeItem: () => {
      throw new Error('SecurityError: storage blocked');
    },
  };
}

describe('Mock session adapter', () => {
  let storage: ReturnType<typeof createStorage>;

  beforeEach(() => {
    storage = createStorage();
  });

  it('should persist and read back a session', () => {
    expect(writeMockSession({ name: 'Alex Nguyen', email: 'alex@example.com' }, storage)).toBe(true);

    const session = readMockSession(storage);
    expect(session).toEqual({ name: 'Alex Nguyen', email: 'alex@example.com' });
  });

  it('should never persist a password field', () => {
    const session = { name: 'Alex', email: 'alex@example.com', password: 'AlexPass123!' };
    writeMockSession(session as never, storage);

    const raw = storage.dump()[MOCK_SESSION_STORAGE_KEY];
    expect(raw).toBeDefined();
    expect(raw).not.toContain('AlexPass123!');
    expect(raw).not.toContain('password');
  });

  it('should clear the session on sign out', () => {
    writeMockSession({ name: 'Alex', email: 'alex@example.com' }, storage);
    expect(readMockSession(storage)).not.toBeNull();

    expect(clearMockSession(storage)).toBe(true);
    expect(readMockSession(storage)).toBeNull();
    expect(resolveDisplayProfile(storage)).toEqual(GUEST_SESSION);
  });

  it('should fall back to the guest profile when nothing is stored', () => {
    const profile = resolveDisplayProfile(storage);
    expect(profile).toEqual(GUEST_SESSION);
    expect(isGuestSession(profile)).toBe(true);
    expect(getProfileGreeting(profile)).toBe('Log in to save progress');
  });

  it('should treat malformed JSON as no session instead of throwing', () => {
    const broken = createStorage({ [MOCK_SESSION_STORAGE_KEY]: '{not json' });
    expect(readMockSession(broken)).toBeNull();
    expect(resolveDisplayProfile(broken)).toEqual(GUEST_SESSION);
  });

  it('should reject non-object payloads', () => {
    expect(readMockSession(createStorage({ [MOCK_SESSION_STORAGE_KEY]: '"a string"' }))).toBeNull();
    expect(readMockSession(createStorage({ [MOCK_SESSION_STORAGE_KEY]: 'null' }))).toBeNull();
    expect(readMockSession(createStorage({ [MOCK_SESSION_STORAGE_KEY]: '42' }))).toBeNull();
  });

  it('should derive a name from the email when the name is missing', () => {
    const partial = createStorage({
      [MOCK_SESSION_STORAGE_KEY]: JSON.stringify({ email: 'alex@example.com' }),
    });
    expect(readMockSession(partial)?.name).toBe('alex');
  });

  it('should treat a partial session without name and email as unauthenticated', () => {
    const partial = createStorage({
      [MOCK_SESSION_STORAGE_KEY]: JSON.stringify({ goal: 'speaking' }),
    });
    expect(readMockSession(partial)).toBeNull();
  });

  it('should survive blocked storage without throwing on read, write or clear', () => {
    const blocked = createBlockedStorage();
    expect(() => readMockSession(blocked)).not.toThrow();
    expect(readMockSession(blocked)).toBeNull();
    expect(writeMockSession({ name: 'Alex', email: '' }, blocked)).toBe(false);
    expect(clearMockSession(blocked)).toBe(false);
    expect(resolveDisplayProfile(blocked)).toEqual(GUEST_SESSION);
  });

  it('should derive a stable avatar initial', () => {
    expect(getProfileInitial({ name: 'alex nguyen', email: '' })).toBe('A');
    expect(getProfileInitial({ name: '', email: '' })).toBe('S');
  });

  it('should expose a non-guest greeting for a real mock session', () => {
    expect(getProfileGreeting({ name: 'Alex', email: 'alex@example.com' })).toBe('Keep going!');
  });

  it('should preserve optional registration fields round-trip', () => {
    writeMockSession(
      {
        name: 'Alex Nguyen',
        email: 'alex@example.com',
        goal: 'speaking',
        dailyMinutes: 30,
        registeredAt: '2024-10-24T00:00:00.000Z',
      },
      storage
    );

    const session = readMockSession(storage);
    expect(session?.goal).toBe('speaking');
    expect(session?.dailyMinutes).toBe(30);
    expect(session?.registeredAt).toBe('2024-10-24T00:00:00.000Z');
  });

  it('should ignore a non-numeric dailyMinutes value', () => {
    const weird = createStorage({
      [MOCK_SESSION_STORAGE_KEY]: JSON.stringify({
        name: 'Alex',
        email: 'a@b.com',
        dailyMinutes: 'lots',
      }),
    });
    expect(readMockSession(weird)?.dailyMinutes).toBeUndefined();
  });
});
