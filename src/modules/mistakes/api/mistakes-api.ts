import { apiClient, requirePayload, requireShape } from '@/shared/api';
import { mockAgreeDrillData, mockMistakeItems, mockMistakeStats } from '@/mocks/mistakes.mock';
import { resolveDrillForId } from '../model';
import type { MistakeDrillData, MistakeItem, MistakeStats } from '../types';

export interface MistakeNotebookResponse {
  mistakes: MistakeItem[];
  stats: MistakeStats;
}

export interface MistakeDrillResponse {
  drill: MistakeDrillData | null;
}

/**
 * Replaceable, typed data boundary for the mistakes domain.
 *
 * Default source is the local mock fixture; `NEXT_PUBLIC_USE_MOCK_DATA=false`
 * switches the identical call signature to the HTTP API.
 */
function cloneMistakes(mistakes: MistakeItem[]): MistakeItem[] {
  return mistakes.map((mistake) => ({ ...mistake }));
}

export function shouldUseMockData(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';
}

export async function fetchMistakeNotebook(
  signal?: AbortSignal
): Promise<MistakeNotebookResponse> {
  if (shouldUseMockData()) {
    return {
      mistakes: cloneMistakes(mockMistakeItems),
      stats: { ...mockMistakeStats },
    };
  }

  const payload = await apiClient<MistakeNotebookResponse>('/mistakes', { signal });

  // Same policy as the review queue: a content-less 204/empty body is an
  // explicit error, and a malformed shape must not masquerade as "no mistakes".
  return requireShape(
    requirePayload(payload, '/mistakes', 'a mistake notebook payload'),
    '/mistakes',
    (candidate) =>
      Array.isArray(candidate.mistakes) &&
      candidate.mistakes.every(
        (mistake) => Boolean(mistake) && typeof mistake.id === 'string'
      ) &&
      Boolean(candidate.stats) &&
      typeof candidate.stats === 'object',
    'a { mistakes: MistakeItem[], stats: MistakeStats } payload'
  );
}

export async function fetchMistakeDrill(
  mistakeId: string,
  signal?: AbortSignal
): Promise<MistakeDrillResponse> {
  const id = (mistakeId ?? '').trim();
  if (!id) {
    return { drill: null };
  }

  if (shouldUseMockData()) {
    if (mockAgreeDrillData.mistakeId === id) {
      return { drill: { ...mockAgreeDrillData } };
    }
    // The fixture set only contains one authored drill; other valid notebook ids
    // resolve through the domain lookup which reuses the matching category
    // template (see `resolveDrillForId`).
    return { drill: null };
  }

  return apiClient<MistakeDrillResponse>(`/mistakes/${encodeURIComponent(id)}/drill`, {
    signal,
  });
}

export interface MistakePracticeResponse {
  /** The resolved drill, or `null` when the id has no drill/notebook entry. */
  drill: MistakeDrillData | null;
  /** The route id echoed back so the unresolved UI can name what was asked for. */
  requestedId: string;
  /** True when a drill was resolved for the requested id. */
  isResolved: boolean;
}

/**
 * Typed data boundary for the `/mistakes/[mistakeId]/practice` route.
 *
 * Resolution order:
 *  1. The direct drill endpoint (`/mistakes/:id/drill`) — the authoritative
 *     source, since a `MistakeDrillData` carries question/example/confidence
 *     structure that a notebook entry alone cannot supply.
 *  2. Only when the mock fixture set is active, the authored drills are reused
 *     as category templates for other notebook entries (a fixture-only
 *     convenience: the fixture set authors one drill per category).
 *
 * In HTTP mode a `null` drill means the id is genuinely unresolved — the adapter
 * never fabricates a drill by borrowing structure from an unrelated entry, and
 * errors from the endpoint propagate to the caller's error state.
 */
export async function fetchMistakePractice(
  mistakeId: string,
  signal?: AbortSignal
): Promise<MistakePracticeResponse> {
  const requestedId = (mistakeId ?? '').trim();
  if (!requestedId) {
    return { drill: null, requestedId, isResolved: false };
  }

  const drillResponse = await fetchMistakeDrill(requestedId, signal);
  if (drillResponse.drill) {
    return { drill: drillResponse.drill, requestedId, isResolved: true };
  }

  if (!shouldUseMockData()) {
    // The server is authoritative; an absent drill is an unresolved id.
    return { drill: null, requestedId, isResolved: false };
  }

  // Fixture mode: reuse the authored drills as category templates so every
  // notebook entry has a practice drill to render.
  const notebook = await fetchMistakeNotebook();
  const lookup = resolveDrillForId(requestedId, [mockAgreeDrillData], notebook.mistakes);
  return { drill: lookup.drill, requestedId, isResolved: lookup.isResolved };
}
