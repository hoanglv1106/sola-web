export type PracticeCategory =
  | 'all'
  | 'grammar'
  | 'speaking'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'vocabulary'
  | 'pronunciation'
  | 'professional'
  | 'ielts'
  | 'toeic';

export type ActivityLevel = 'Intermediate' | 'Upper-intermediate' | 'Advanced';

export type ActivityTag =
  | 'Daily challenge'
  | 'Real conversation'
  | 'Quick drill'
  | 'Exam practice'
  | 'Skill builder';

export interface PracticeActivity {
  id: string;
  title: string;
  category: PracticeCategory;
  durationMin: number;
  description: string;
  level: ActivityLevel;
  tag: ActivityTag;
  iconName: string;
  accentColor?: string;
  isRecommended?: boolean;
}

export interface WeeklyPracticeStats {
  sessionsCompleted: number;
  sessionsGoal: number;
  dailyStatus: {
    day: string; // Mon, Tue, etc.
    completed: boolean;
  }[];
}

