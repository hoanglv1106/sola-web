export interface SkillTrendPoint {
  dateLabel: string; // e.g. Sep 26, Oct 3, Oct 10, Oct 17, Oct 24
  speaking: number;
  grammar: number;
  listening: number;
  vocabulary: number;
  writing: number;
}

export interface SkillSummaryItem {
  key: 'speaking' | 'grammar' | 'listening' | 'vocabulary' | 'writing';
  label: string;
  score: number;
  deltaPct: number;
  color: string;
}

export interface ProgressReviewCardItem {
  id: string;
  title: string;
  category: string;
  itemCount: number;
  subtitle: string;
  previewItems: string[];
  ctaLabel: string;
  ctaHref: string;
  accentColor: string;
}

export interface AiInsightCardItem {
  id: string;
  title: string;
  description: string;
  iconType: 'chat' | 'target' | 'leaf';
  bgColor: string;
  iconColor: string;
}

export interface DailyGoalProgress {
  completedItems: number;
  targetItems: number;
  streakDays: number;
}
