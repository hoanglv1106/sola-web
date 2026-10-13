'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  clearMockSession,
  getProfileGreeting,
  getProfileInitial,
  readMockSession,
  resolveDisplayProfile,
  writeMockSession,
  type MockSession,
} from '@/modules/learner/model';

export interface UseMockSessionResult {
  /** Coherent profile to render: real mock session or the explicit guest. */
  profile: MockSession;
  initial: string;
  greeting: string;
  /** True while storage has not been consulted yet (SSR/first paint). */
  isHydrating: boolean;
  signIn: (session: MockSession) => void;
  signOut: () => void;
}

/**
 * React binding for the mock-session adapter.
 *
 * The server render has no `sessionStorage`, so the first paint uses the guest
 * profile and the effect re-reads storage on mount. This keeps hydration
 * deterministic while still showing the stored profile after mount.
 */
export function useMockSession(): UseMockSessionResult {
  const [profile, setProfile] = useState<MockSession>(() => resolveDisplayProfile(null));
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    setProfile(resolveDisplayProfile());
    setIsHydrating(false);
  }, []);

  const signIn = useCallback((session: MockSession) => {
    writeMockSession(session);
    setProfile(session);
  }, []);

  const signOut = useCallback(() => {
    clearMockSession();
    setProfile(resolveDisplayProfile());
  }, []);

  return {
    profile,
    initial: getProfileInitial(profile),
    greeting: getProfileGreeting(profile),
    isHydrating,
    signIn,
    signOut,
  };
}

export { readMockSession };
