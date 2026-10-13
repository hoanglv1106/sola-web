/**
 * Explicit, domain-scoped vocabulary-progress simulation.
 *
 * SOLA has no backend yet: a review session promotes or demotes a word's mastery
 * stage in memory, and this store records the *delta* so the learner's progress
 * survives leaving and re-entering the review session (and a full page reload).
 *
 * Only the stage/times-seen delta is persisted; the word content itself always
 * comes from the domain adapter, so a fresh payload is never overwritten by stale
 * client state — the recorded delta is merely re-applied on top of it.
 */

export const VOCABULARY_PROGRESS_STORAGE_KEY = 'sola_vocabulary_progress';

export type VocabularyReviewOutcome = 'known' | 'needs_practice';

export interface VocabularyWordProgress {
  /** Id of the reviewed word. */
  wordId: string;
  /** Mastery stage recorded by the review session. */
  stage: string;
  /** Times the learner has reviewed this word across sessions. */
  timesSeen: number;
  /**
   * The last outcome. `known` retires the word *for the session it happened in*
   * — the next session intentionally re-presents it at its recorded stage — so
   * this is informational and must not be used to hide the word forever.
   */
  lastOutcome?: VocabularyReviewOutcome;
}

export interface VocabularyProgressStore {
  /** Progress keyed by word id. */
  words: Record<string, VocabularyWordProgress>;
}

export const EMPTY_VOCABULARY_PROGRESS: VocabularyProgressStore = { words: {} };

export interface VocabularyStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function resolveStorage(
  storage?: VocabularyStorageLike | null
): VocabularyStorageLike | null {
  if (storage !== undefined) return storage;
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    // Storage can throw when blocked by browser privacy settings.
    return null;
  }
}

function toWords(value: unknown): Record<string, VocabularyWordProgress> {
  if (!value || typeof value !== 'object') return {};

  const entries = Object.entries(value as Record<string, unknown>);
  const words: Record<string, VocabularyWordProgress> = {};

  for (const [wordId, raw] of entries) {
    if (!raw || typeof raw !== 'object') continue;
    const candidate = raw as {
      wordId?: unknown;
      stage?: unknown;
      timesSeen?: unknown;
      lastOutcome?: unknown;
    };
    const resolvedId =
      typeof candidate.wordId === 'string' && candidate.wordId.trim()
        ? candidate.wordId.trim()
        : wordId;
    if (typeof candidate.stage !== 'string' || !candidate.stage) continue;
    const timesSeen = Number(candidate.timesSeen);

    const lastOutcome =
      candidate.lastOutcome === 'known' || candidate.lastOutcome === 'needs_practice'
        ? candidate.lastOutcome
        : undefined;

    words[resolvedId] = {
      wordId: resolvedId,
      stage: candidate.stage,
      timesSeen: Number.isFinite(timesSeen) && timesSeen >= 0 ? Math.floor(timesSeen) : 0,
      ...(lastOutcome ? { lastOutcome } : {}),
    };
  }

  return words;
}

/**
 * Read recorded vocabulary progress. Malformed, partial or blocked storage
 * degrades to "nothing recorded" so the UI always has a coherent value.
 */
export function readVocabularyProgress(
  storage?: VocabularyStorageLike | null
): VocabularyProgressStore {
  const store = resolveStorage(storage);
  if (!store) return EMPTY_VOCABULARY_PROGRESS;

  let raw: string | null = null;
  try {
    raw = store.getItem(VOCABULARY_PROGRESS_STORAGE_KEY);
  } catch {
    return EMPTY_VOCABULARY_PROGRESS;
  }

  if (!raw) return EMPTY_VOCABULARY_PROGRESS;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return EMPTY_VOCABULARY_PROGRESS;
  }

  if (!parsed || typeof parsed !== 'object') return EMPTY_VOCABULARY_PROGRESS;
  return { words: toWords((parsed as { words?: unknown }).words) };
}

/** Record a word's progress, replacing any previous value for that word. */
export function writeWordProgress(
  progress: VocabularyWordProgress,
  storage?: VocabularyStorageLike | null
): VocabularyProgressStore {
  const current = readVocabularyProgress(storage);
  const wordId = (progress.wordId ?? '').trim();
  if (!wordId) return current;

  const next: VocabularyProgressStore = {
    words: {
      ...current.words,
      [wordId]: {
        wordId,
        stage: progress.stage,
        timesSeen: Math.max(0, Math.floor(progress.timesSeen)),
        ...(progress.lastOutcome ? { lastOutcome: progress.lastOutcome } : {}),
      },
    },
  };

  writeVocabularyProgress(next, storage);
  return next;
}

export function writeVocabularyProgress(
  progress: VocabularyProgressStore,
  storage?: VocabularyStorageLike | null
): void {
  const store = resolveStorage(storage);
  if (!store) return;
  try {
    store.setItem(
      VOCABULARY_PROGRESS_STORAGE_KEY,
      JSON.stringify({ words: toWords(progress.words) })
    );
  } catch {
    // Quota or privacy errors must not break the interaction.
  }
}

/** Remove all recorded progress (used by tests and an explicit reset). */
export function clearVocabularyProgress(
  storage?: VocabularyStorageLike | null
): void {
  const store = resolveStorage(storage);
  if (!store) return;
  try {
    store.removeItem(VOCABULARY_PROGRESS_STORAGE_KEY);
  } catch {
    // Ignore blocked storage.
  }
}
