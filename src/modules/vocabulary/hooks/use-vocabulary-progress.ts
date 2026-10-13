'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  clearVocabularyProgress,
  readVocabularyProgress,
  writeVocabularyProgress,
  writeWordProgress,
  type VocabularyProgressStore,
  type VocabularyWordProgress,
} from '../model/vocabulary-progress';

export interface UseVocabularyProgressResult {
  /** Word progress recorded in this browser, keyed by word id. */
  words: Record<string, VocabularyWordProgress>;
  /** True while storage has not been consulted yet (SSR/first paint). */
  isHydrating: boolean;
  /** The recorded progress for a word, if any. */
  getProgress: (wordId: string) => VocabularyWordProgress | undefined;
  /** Record a word's progress and persist it. */
  recordProgress: (progress: VocabularyWordProgress) => void;
  /** Overwrite the whole store (used when a session completes). */
  writeAll: (store: VocabularyProgressStore) => void;
  /** Remove all recorded progress. */
  reset: () => void;
}

/**
 * React binding for the vocabulary-progress simulation.
 *
 * The server render has no `localStorage`, so the first paint shows no recorded
 * progress and the effect re-reads storage on mount. Because only the delta is
 * stored, a fresh domain payload is never overwritten by stale client state.
 */
export function useVocabularyProgress(): UseVocabularyProgressResult {
  const [progress, setProgress] = useState<VocabularyProgressStore>({ words: {} });
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    setProgress(readVocabularyProgress());
    setIsHydrating(false);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === 'sola_vocabulary_progress') {
        setProgress(readVocabularyProgress());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const recordProgress = useCallback((word: VocabularyWordProgress) => {
    setProgress(writeWordProgress(word));
  }, []);

  const writeAll = useCallback((store: VocabularyProgressStore) => {
    writeVocabularyProgress(store);
    setProgress(store);
  }, []);

  const reset = useCallback(() => {
    clearVocabularyProgress();
    setProgress({ words: {} });
  }, []);

  const getProgress = useCallback(
    (wordId: string) => progress.words[wordId],
    [progress.words]
  );

  return {
    words: progress.words,
    isHydrating,
    getProgress,
    recordProgress,
    writeAll,
    reset,
  };
}
