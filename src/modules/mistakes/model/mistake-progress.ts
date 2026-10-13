/**
 * Explicit, domain-scoped mistake-progress simulation.
 *
 * SOLA has no backend yet: marking a mistake as improved is an intentional
 * simulation backed by `localStorage`, labelled as such. This module is the
 * single source of truth for that state so the practice runner (which writes)
 * and the notebook dashboard (which reads) can never disagree.
 *
 * Storage is read lazily and SSR-safely: the server render has no `localStorage`,
 * so reads fall back to "nothing improved" and callers hydrate on mount.
 */

export const MISTAKE_PROGRESS_STORAGE_KEY = 'sola_mistake_progress';

export interface MistakeProgressStore {
  /** Ids the learner has explicitly marked as improved. */
  improvedIds: string[];
}

export const EMPTY_MISTAKE_PROGRESS: MistakeProgressStore = { improvedIds: [] };

export interface ProgressStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function resolveStorage(
  storage?: ProgressStorageLike | null
): ProgressStorageLike | null {
  if (storage !== undefined) return storage;
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    // Storage can throw when blocked by browser privacy settings.
    return null;
  }
}

function toImprovedIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const ids = value.filter(
    (entry): entry is string => typeof entry === 'string' && entry.trim().length > 0
  );
  // De-duplicate while preserving the recorded order.
  return Array.from(new Set(ids));
}

/**
 * Read the recorded improvements. Malformed, partial or blocked storage degrades
 * to "nothing improved" so the UI always has a coherent value to render.
 */
export function readMistakeProgress(
  storage?: ProgressStorageLike | null
): MistakeProgressStore {
  const store = resolveStorage(storage);
  if (!store) return EMPTY_MISTAKE_PROGRESS;

  let raw: string | null = null;
  try {
    raw = store.getItem(MISTAKE_PROGRESS_STORAGE_KEY);
  } catch {
    return EMPTY_MISTAKE_PROGRESS;
  }

  if (!raw) return EMPTY_MISTAKE_PROGRESS;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return EMPTY_MISTAKE_PROGRESS;
  }

  if (!parsed || typeof parsed !== 'object') return EMPTY_MISTAKE_PROGRESS;
  return { improvedIds: toImprovedIds((parsed as { improvedIds?: unknown }).improvedIds) };
}

/** Record one improvement, idempotently, and return the resulting store. */
export function markProgressImproved(
  mistakeId: string,
  storage?: ProgressStorageLike | null
): MistakeProgressStore {
  const id = (mistakeId ?? '').trim();
  const current = readMistakeProgress(storage);
  if (!id || current.improvedIds.includes(id)) return current;

  const next: MistakeProgressStore = {
    improvedIds: [...current.improvedIds, id],
  };
  writeMistakeProgress(next, storage);
  return next;
}

/** Remove one recorded improvement, idempotently. */
export function clearProgressImproved(
  mistakeId: string,
  storage?: ProgressStorageLike | null
): MistakeProgressStore {
  const current = readMistakeProgress(storage);
  const next: MistakeProgressStore = {
    improvedIds: current.improvedIds.filter((entry) => entry !== mistakeId),
  };
  writeMistakeProgress(next, storage);
  return next;
}

export function writeMistakeProgress(
  progress: MistakeProgressStore,
  storage?: ProgressStorageLike | null
): void {
  const store = resolveStorage(storage);
  if (!store) return;
  try {
    store.setItem(
      MISTAKE_PROGRESS_STORAGE_KEY,
      JSON.stringify({ improvedIds: toImprovedIds(progress.improvedIds) })
    );
  } catch {
    // Quota or privacy errors must not break the interaction.
  }
}
