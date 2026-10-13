import type {
  MistakeCategory,
  MistakeDrillData,
  MistakeItem,
} from '../types';

export type MistakeFilter = MistakeCategory | 'all';

export function filterMistakesByCategory(
  mistakes: MistakeItem[],
  category: MistakeFilter
): MistakeItem[] {
  if (category === 'all') return mistakes;
  return mistakes.filter((mistake) => mistake.category === category);
}

export function markMistakeImproved(mistake: MistakeItem): MistakeItem {
  return {
    ...mistake,
    isImproved: true,
    timesSeen: Math.max(0, mistake.timesSeen - 1),
  };
}

export function calculateMistakeResolutionRate(mistakes: MistakeItem[]): number {
  if (mistakes.length === 0) return 0;
  const improvedCount = mistakes.filter((mistake) => mistake.isImproved).length;
  return Math.round((improvedCount / mistakes.length) * 100);
}

export interface DrillLookupResult {
  drill: MistakeDrillData | null;
  /** The id requested by the route, echoed back for the invalid state UI. */
  requestedId: string;
  isResolved: boolean;
}

/**
 * Resolve the drill for a route id.
 *
 * The mock fixture is keyed by `mistakeId`; a fixture whose category is known
 * is reused as the practice template for every notebook entry of that category,
 * while the returned `requestedId` keeps the route id authoritative. Unknown or
 * empty ids resolve to an explicit unresolved state instead of silently showing
 * the default drill.
 */
export function resolveDrillForId(
  mistakeId: string,
  drills: MistakeDrillData[],
  mistakes: MistakeItem[] = []
): DrillLookupResult {
  const requestedId = (mistakeId ?? '').trim();

  if (!requestedId) {
    return { drill: null, requestedId, isResolved: false };
  }

  const exact = drills.find((drill) => drill.mistakeId === requestedId);
  if (exact) {
    return { drill: exact, requestedId, isResolved: true };
  }

  const mistake = mistakes.find((item) => item.id === requestedId);
  if (!mistake) {
    return { drill: null, requestedId, isResolved: false };
  }

  const template = drills.find((drill) => drill.category === mistake.category);
  if (!template) {
    return { drill: null, requestedId, isResolved: false };
  }

  return {
    drill: {
      ...template,
      mistakeId: mistake.id,
      category: mistake.category,
      title: mistake.subcategory,
      userMistakeSentence: mistake.userAnswer,
      correctSentence: mistake.correctAnswer,
      mistakeHighlight: mistake.userHighlight ?? template.mistakeHighlight,
      correctHighlight: mistake.correctHighlight ?? template.correctHighlight,
      ruleExplanation: mistake.explanation,
    },
    requestedId,
    isResolved: true,
  };
}
