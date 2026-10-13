'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  clearProgressImproved,
  markProgressImproved,
  readMistakeProgress,
  type MistakeProgressStore,
} from '../model/mistake-progress';

export interface UseMistakeProgressResult {
  /** Ids recorded as improved in this browser. */
  improvedIds: string[];
  /** True while storage has not been consulted yet (SSR/first paint). */
  isHydrating: boolean;
  /** Test whether a mistake is recorded as improved. */
  isImproved: (mistakeId: string) => boolean;
  /** Record an improvement and persist it. */
  markImproved: (mistakeId: string) => void;
  /** Remove a recorded improvement. */
  unmarkImproved: (mistakeId: string) => void;
}

/**
 * React binding for the mistake-progress simulation.
 *
 * The server render has no `localStorage`, so the first paint shows nothing
 * improved and the effect re-reads storage on mount. Both the practice runner and
 * the notebook dashboard use this hook, so a change made in one is visible in
 * the other after navigation or a remount.
 */
export function useMistakeProgress(): UseMistakeProgressResult {
  const [progress, setProgress] = useState<MistakeProgressStore>({ improvedIds: [] });
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    setProgress(readMistakeProgress());
    setIsHydrating(false);
  }, []);

  // Keep tabs/windows of the same origin coherent.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === 'sola_mistake_progress') {
        setProgress(readMistakeProgress());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const markImproved = useCallback((mistakeId: string) => {
    setProgress(markProgressImproved(mistakeId));
  }, []);

  const unmarkImproved = useCallback((mistakeId: string) => {
    setProgress(clearProgressImproved(mistakeId));
  }, []);

  const isImproved = useCallback(
    (mistakeId: string) => progress.improvedIds.includes(mistakeId),
    [progress.improvedIds]
  );

  return {
    improvedIds: progress.improvedIds,
    isHydrating,
    isImproved,
    markImproved,
    unmarkImproved,
  };
}
