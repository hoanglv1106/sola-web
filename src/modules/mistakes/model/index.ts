export {
  filterMistakesByCategory,
  markMistakeImproved,
  calculateMistakeResolutionRate,
  resolveDrillForId,
} from './mistakes';

export type { MistakeFilter, DrillLookupResult } from './mistakes';

export {
  MISTAKE_PROGRESS_STORAGE_KEY,
  EMPTY_MISTAKE_PROGRESS,
  readMistakeProgress,
  markProgressImproved,
  clearProgressImproved,
  writeMistakeProgress,
} from './mistake-progress';

export type { MistakeProgressStore, ProgressStorageLike } from './mistake-progress';
