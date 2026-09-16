export type ActivityType =
  | 'speaking'
  | 'grammar'
  | 'listening'
  | 'vocabulary'
  | 'review'
  | 'professional';

export interface DailyLearningTask {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  durationMin: number;
  completed?: boolean;
  href: string;
}

export interface LearnerGoalSummary {
  examType: 'IELTS' | 'TOEIC';
  targetScore: number | string;
  currentEstimatedScore: number | string;
  targetTimeline: string;
  streakDays: number;
  weekStreak: { day: string; active: boolean; isToday?: boolean }[];
}

export interface SkillProgressMetric {
  skill: string;
  name: string;
  percentage: number;
  changePercent: number;
  color: 'orange' | 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

export type LearningStageStatus = 'COMPLETED' | 'CURRENT' | 'AVAILABLE' | 'LOCKED';

export interface LearningPathStage {
  id: string;
  title: string;
  subtitle: string;
  weeksLabel: string;
  status: LearningStageStatus;
  isCurrent?: boolean;
}

export interface WeeklyPlanDay {
  dayName: string; // 'MON', 'TUE', etc.
  dateLabel: string; // 'Oct 21'
  title: string;
  durationMin: number;
  status: 'completed' | 'current' | 'upcoming';
  type: ActivityType;
}

export interface WeeklyPlanOverview {
  weekNumber: number;
  totalWeeks: number;
  focusTitle: string;
  description: string;
  studyTimeGoalMin: number;
  studyTimeLoggedMin: number;
  focusDistribution: {
    skill: string;
    percentage: number;
    icon: ActivityType;
  }[];
  days: WeeklyPlanDay[];
  whyTheseTopics: string[];
}

export interface SessionExerciseQuestion {
  id: string;
  sentenceBefore: string;
  sentenceAfter: string;
  options: string[];
  correctAnswer: string;
}

export interface SessionStep {
  stepNumber: number;
  title: string;
  durationMin: number;
  type: ActivityType;
  status: 'completed' | 'current' | 'upcoming';
  headline: string;
  instruction: string;
  tip: string;
  questions: SessionExerciseQuestion[];
}

export interface TodaySessionData {
  title: string;
  totalDurationMin: number;
  remainingMin: number;
  quote: string;
  steps: SessionStep[];
}

