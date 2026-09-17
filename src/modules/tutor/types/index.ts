export interface ChatMessage {
  id: string;
  sender: 'maya' | 'user';
  text: string;
  timestamp: string;
  avatarUrl?: string;
}

export interface ScenarioInfo {
  id: string;
  title: string;
  description: string;
  goal: string;
  durationMin: number;
  tags: string[];
}

export interface LiveFeedbackItem {
  id: string;
  type: 'pronunciation' | 'fluency' | 'phrasing' | 'vocabulary';
  title: string;
  message: string;
  originalText?: string;
  suggestedText?: string;
}

export interface CorrectionItem {
  id: string;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
}

export interface PhrasingItem {
  id: string;
  standard: string;
  natural: string;
}

export interface SkillScoreItem {
  key: 'fluency' | 'grammar' | 'pronunciation' | 'vocabulary' | 'confidence';
  label: string;
  score: number; // 0 - 100
  comment: string;
  color: 'orange' | 'blue' | 'red' | 'green' | 'purple';
}

export interface SpeakingFeedbackData {
  sessionId: string;
  overallScore: number;
  scoreDelta: number;
  dateStr: string;
  topic: string;
  durationMin: number;
  mayaComment: string;
  skills: SkillScoreItem[];
  corrections: CorrectionItem[];
  phrasings: PhrasingItem[];
  newVocabulary: string[];
  strengths: string[];
}
