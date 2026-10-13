export {
  MOCK_SESSION_STORAGE_KEY,
  GUEST_SESSION,
  readMockSession,
  writeMockSession,
  clearMockSession,
  resolveDisplayProfile,
  isGuestSession,
  getProfileInitial,
  getProfileGreeting,
} from './mock-session';

export type { MockSession, SessionStorageLike } from './mock-session';
