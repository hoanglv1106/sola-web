export type MistakeCategory =
  | 'grammar'
  | 'vocabulary'
  | 'pronunciation'
  | 'speaking'
  | 'writing';

export interface MistakeItem {
  id: string;
  category: MistakeCategory;
  subcategory: string;
  date: string;
  userAnswer: string;
  userHighlight?: string;
  correctAnswer: string;
  correctHighlight?: string;
  explanation: string;
  timesSeen: number;
  isAddedToReview?: boolean;
  isImproved?: boolean;
}

export interface MistakeQuestionOption {
  key: string; // 'A' | 'B'
  text: string;
  isCorrect: boolean;
}

export interface MistakeDrillQuestion {
  id: string;
  questionNumber: number;
  prompt: string;
  options: MistakeQuestionOption[];
  explanation: string;
}

export interface MistakeDrillData {
  mistakeId: string;
  category: MistakeCategory;
  title: string;
  currentStep: number; // 1 to 4 (Learn, Practice, Check, Wrap up)
  totalSteps: number;
  userMistakeSentence: string;
  mistakeHighlight: string;
  correctSentence: string;
  correctHighlight: string;
  ruleTitle: string;
  ruleExplanation: string;
  moreExamples: {
    sentence: string;
    isCorrect: boolean;
  }[];
  questions: MistakeDrillQuestion[];
  confidenceScore: number; // e.g. 60
}

export interface MistakeStats {
  grammarPct: number;
  vocabularyPct: number;
  pronunciationPct: number;
  speakingPct: number;
  writingPct: number;
  improvementMonthPct: number;
}
