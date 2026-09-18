export type ExamType = 'ielts' | 'toeic';

export interface ExamScoreSummary {
  examType: ExamType;
  targetScore: number;
  targetScoreLabel: string;
  predictedScore: number;
  predictedScoreLabel: string;
  changeText: string;
  onTrackMessage: string;
}

export interface ExamSectionPractice {
  id: string;
  title: string;
  category: 'listening' | 'reading' | 'writing' | 'speaking';
  description: string;
  progressPercent: number;
  href: string;
}

export interface ExamMockTest {
  id: string;
  title: string;
  description: string;
  duration: string;
  questionCount?: number;
  href: string;
}

export interface ExamRecentResult {
  id: string;
  title: string;
  date: string;
  score: string;
  scoreType: 'overall' | 'section';
  category?: 'listening' | 'reading' | 'writing' | 'speaking';
}

export interface ExamAiRecommendation {
  id: string;
  number: number;
  title: string;
  description: string;
  href?: string;
  colorVariant: 'orange' | 'blue' | 'green';
}

export interface ExamPrepFocus {
  category: 'listening' | 'reading' | 'writing' | 'speaking';
  title: string;
  description: string;
  whyThisText?: string;
  actionHref: string;
}

// IELTS Writing Feedback Types
export interface RubricCriterion {
  id: string;
  name: string;
  score: number;
  summary: string;
  details?: string[];
}

export type CorrectionCategory = 'grammar' | 'vocabulary' | 'suggestion';

export interface WritingCorrection {
  id: string;
  category: CorrectionCategory;
  categoryLabel: string;
  originalText: string;
  improvedText: string;
  explanation: string;
  paragraphIndex: number;
}

export interface EssayParagraph {
  paragraphIndex: number;
  segments: {
    text: string;
    correctionId?: string;
    category?: CorrectionCategory;
  }[];
}

export interface ImprovementPlanStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface IeltsWritingAttempt {
  id: string;
  taskType: 'Task 1' | 'Task 2';
  title: string;
  prompt: string;
  wordCount: number;
  overallBand: number;
  targetBand: number;
  paragraphs: EssayParagraph[];
  rubric: RubricCriterion[];
  corrections: WritingCorrection[];
  improvementPlan: ImprovementPlanStep[];
  tutorFeedback: {
    name: string;
    quote: string;
    message: string;
  };
}

// TOEIC Practice Test Types
export interface ToeicOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface ToeicQuestion {
  id: string;
  questionNumber: number;
  part: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  partTitle: string;
  instruction: string;
  imageUrl?: string;
  audioPromptText?: string;
  options: ToeicOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface ToeicTestSession {
  id: string;
  title: string;
  totalQuestions: number;
  currentSection: 'listening' | 'reading';
  timeRemainingSeconds: number;
  targetScore: number;
  estimatedScore: number;
  focusArea: {
    part: string;
    description: string;
  };
  tutorTip: string;
  questions: ToeicQuestion[];
}

