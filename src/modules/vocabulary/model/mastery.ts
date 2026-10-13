import type { VocabularyStage, VocabularyWord } from '../types';

export const VOCABULARY_STAGE_RANK: VocabularyStage[] = [
  'new',
  'learning',
  'familiar',
  'strong',
  'mastered',
];

/** Distinct session verdicts for a reviewed word. */
export type ReviewOutcome = 'known' | 'needs_practice';

export interface WordReviewState {
  wordId: string;
  stage: VocabularyStage;
  timesSeen: number;
  /** Ordered review history, oldest first. */
  history: ReviewOutcome[];
  mastered: boolean;
}

export interface ExampleHighlightSegment {
  text: string;
  highlighted: boolean;
}

export interface ExampleSentenceView {
  /** Full example sentence, guaranteed non-empty for matching fixtures. */
  sentence: string;
  /** First highlighted occurrence inside the sentence, if any. */
  focus: string | null;
  /** True when the fixture sentence repeats the highlighted word. */
  hasRepeatedHighlight: boolean;
  /** The fixture declared a highlight that does not appear in its sentence. */
  highlightMissing: boolean;
}

const MAX_HISTORY = 20;

export function stageRank(stage: VocabularyStage): number {
  const index = VOCABULARY_STAGE_RANK.indexOf(stage);
  return index === -1 ? 0 : index;
}

/**
 * Promote one mastery stage. The stepper is bounded: `mastered` never advances.
 */
export function promoteStage(current: VocabularyStage): VocabularyStage {
  const nextIndex = Math.min(stageRank(current) + 1, VOCABULARY_STAGE_RANK.length - 1);
  return VOCABULARY_STAGE_RANK[nextIndex];
}

/**
 * Move one mastery stage back. The stepper is bounded: `new` never regresses.
 */
export function demoteStage(current: VocabularyStage): VocabularyStage {
  return VOCABULARY_STAGE_RANK[Math.max(stageRank(current) - 1, 0)];
}

export function calculateMasteryPercentage(stage: VocabularyStage): number {
  return Math.round(((stageRank(stage) + 1) / VOCABULARY_STAGE_RANK.length) * 100);
}

export function createWordReviewState(word: VocabularyWord): WordReviewState {
  return {
    wordId: word.id,
    stage: word.stage,
    timesSeen: word.timesSeen,
    history: [],
    mastered: word.stage === 'mastered',
  };
}

/**
 * Apply a review verdict. Both verdicts consume the word once and advance the
 * queue, but only `known` promotes the stage; `needs_practice` demotes it and
 * schedules the word for another pass, so the two buttons are never identical.
 */
export function applyReviewOutcome(
  state: WordReviewState,
  outcome: ReviewOutcome
): WordReviewState {
  const history = [...state.history, outcome].slice(-MAX_HISTORY);

  if (outcome === 'known') {
    const stage = promoteStage(state.stage);
    return {
      ...state,
      stage,
      timesSeen: state.timesSeen + 1,
      history,
      mastered: stage === 'mastered',
    };
  }

  const stage = demoteStage(state.stage);
  return {
    ...state,
    stage,
    timesSeen: state.timesSeen + 1,
    history,
    mastered: false,
  };
}

export interface ReviewQueue {
  /** Order in which word ids are shown, including re-queued retries. */
  order: string[];
  states: Record<string, WordReviewState>;
  totalWords: number;
}

export interface QueuePassResult {
  queue: ReviewQueue;
  /** True when the current word was re-queued for another pass. */
  retried: boolean;
  /** True when the session has no remaining words. */
  completed: boolean;
}

/**
 * Immutable retry queue: `known` removes the word from the queue (bounded by
 * the stage ceiling), `needs_practice` moves it one bounded position further
 * back instead of dropping it silently.
 */
export function applyQueueOutcome(
  queue: ReviewQueue,
  outcome: ReviewOutcome,
  maxRetryOffset = 2
): QueuePassResult {
  const [currentId, ...rest] = queue.order;

  if (!currentId) {
    return { queue, retried: false, completed: true };
  }

  const state = queue.states[currentId] ?? {
    wordId: currentId,
    stage: 'new' as VocabularyStage,
    timesSeen: 0,
    history: [],
    mastered: false,
  };

  const nextState = applyReviewOutcome(state, outcome);
  const states = { ...queue.states, [currentId]: nextState };

  if (outcome === 'known' || nextState.mastered) {
    return {
      queue: { ...queue, order: rest, states },
      retried: false,
      completed: rest.length === 0,
    };
  }

  const insertAt = Math.min(maxRetryOffset, rest.length);
  const order = [...rest.slice(0, insertAt), currentId, ...rest.slice(insertAt)];

  return {
    queue: { ...queue, order, states },
    retried: true,
    completed: false,
  };
}

export function createReviewQueue(words: VocabularyWord[]): ReviewQueue {
  const states: Record<string, WordReviewState> = {};
  for (const word of words) {
    states[word.id] = createWordReviewState(word);
  }
  return {
    order: words.map((word) => word.id),
    states,
    totalWords: words.length,
  };
}

export interface ReviewQueueProgress {
  /** Words the session started with — stable for the whole session. */
  totalWords: number;
  /** Unique words still awaiting a pass (a re-queued retry counts once). */
  pendingWords: number;
  /** Distinct words finished; `completedWords + pendingWords === totalWords`. */
  completedWords: number;
  /** 0–100 over distinct words, so retries cannot inflate progress. */
  progressPercent: number;
  /** True when nothing is left to review. */
  isComplete: boolean;
}

/**
 * Session progress over distinct words.
 *
 * `order` can hold a word more than once when it is re-queued for another pass,
 * so counting entries would let retries push `completed` past the total. Progress
 * is therefore derived from the *distinct* pending ids, which keeps the original
 * total stable and makes `completed + pending === total` hold at all times.
 */
export function getReviewQueueProgress(queue: ReviewQueue): ReviewQueueProgress {
  const pendingWords = new Set(queue.order).size;
  const totalWords = queue.totalWords;
  const completedWords = Math.max(0, totalWords - pendingWords);

  return {
    totalWords,
    pendingWords,
    completedWords,
    progressPercent:
      totalWords === 0 ? 0 : Math.round((completedWords / totalWords) * 100),
    isComplete: totalWords === 0 || pendingWords === 0,
  };
}

/**
 * Build the example-sentence view from fixture data instead of a hardcoded frame.
 * Handles missing sentences, highlighted words that do not occur in the sentence
 * and sentences that repeat the highlighted word.
 */
export function buildExampleSentenceView(word: VocabularyWord): ExampleSentenceView {
  const sentence = (word.exampleSentence ?? '').trim();
  const focus = (word.highlightedWord ?? '').trim();

  if (!sentence) {
    return {
      sentence: '',
      focus: null,
      hasRepeatedHighlight: false,
      highlightMissing: false,
    };
  }

  if (!focus) {
    return {
      sentence,
      focus: null,
      hasRepeatedHighlight: false,
      highlightMissing: true,
    };
  }

  const occurrences = splitOnHighlight(sentence, focus).filter((s) => s.highlighted).length;

  return {
    sentence,
    focus,
    hasRepeatedHighlight: occurrences > 1,
    highlightMissing: occurrences === 0,
  };
}

/** Split the example sentence into highlighted / plain segments. */
export function splitOnHighlight(
  sentence: string,
  highlight: string
): ExampleHighlightSegment[] {
  if (!sentence) return [];
  if (!highlight) return [{ text: sentence, highlighted: false }];

  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Highlight real word forms (e.g. "opportunities" for "opportunity").
  const pattern = new RegExp(`\\b${escaped}\\w*`, 'gi');
  const segments: ExampleHighlightSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(sentence)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: sentence.slice(lastIndex, match.index), highlighted: false });
    }
    segments.push({ text: match[0], highlighted: true });
    lastIndex = match.index + match[0].length;
    if (match[0].length === 0) pattern.lastIndex += 1;
  }

  if (lastIndex < sentence.length) {
    segments.push({ text: sentence.slice(lastIndex), highlighted: false });
  }

  return segments.length > 0 ? segments : [{ text: sentence, highlighted: false }];
}
