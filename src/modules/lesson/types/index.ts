export type LessonStepNumber = 1 | 2 | 3 | 4;

export interface LessonComparisonFormula {
  title: string;
  bullets: string[];
  formula: string;
  theme: 'orange' | 'blue';
}

export interface LessonExamplePair {
  id: string;
  firstText: string;
  firstNote: string;
  secondText: string;
  secondNote: string;
}

export interface LessonQuickCheck {
  question: string;
  options: { id: string; key: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface LessonData {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  currentStep: LessonStepNumber;
  totalSteps: number;
  keyConcept: {
    summary: string;
    comparisons: LessonComparisonFormula[];
  };
  examples: LessonExamplePair[];
  mayaAdvice: string;
  mayaTips: string[];
  quickCheck: LessonQuickCheck;
}
