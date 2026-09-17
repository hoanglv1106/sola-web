export type VocabularyStage =
  | 'new'
  | 'learning'
  | 'familiar'
  | 'strong'
  | 'mastered';

export interface VocabularyMasteryStats {
  newCount: number;
  learningCount: number;
  familiarCount: number;
  strongCount: number;
  masteredCount: number;
  totalWords: number;
}

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb';
  definition: string;
  exampleSentence: string;
  highlightedWord: string;
  collocations: string[];
  similarWords?: string[];
  topic?: string;
  examTag?: string; // e.g. IELTS
  professionalUsage?: string;
  stage: VocabularyStage;
  timesSeen: number;
  isKnown?: boolean;
}

export interface VocabularyReviewSessionState {
  currentWordIndex: number;
  totalWords: number;
  words: VocabularyWord[];
}
