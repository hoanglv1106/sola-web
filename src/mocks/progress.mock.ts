import {
  AiInsightCardItem,
  DailyGoalProgress,
  ProgressReviewCardItem,
  SkillSummaryItem,
  SkillTrendPoint,
} from '@/modules/progress/types';

export const mockSkillTrends: SkillTrendPoint[] = [
  { dateLabel: 'Sep 26', speaking: 42, grammar: 36, listening: 30, vocabulary: 25, writing: 20 },
  { dateLabel: 'Oct 3', speaking: 58, grammar: 48, listening: 46, vocabulary: 35, writing: 32 },
  { dateLabel: 'Oct 10', speaking: 65, grammar: 52, listening: 56, vocabulary: 48, writing: 40 },
  { dateLabel: 'Oct 17', speaking: 72, grammar: 58, listening: 64, vocabulary: 58, writing: 50 },
  { dateLabel: 'Oct 24', speaking: 78, grammar: 62, listening: 70, vocabulary: 68, writing: 60 },
];

export const mockSkillSummaries: SkillSummaryItem[] = [
  { key: 'speaking', label: 'Speaking', score: 78, deltaPct: 12, color: '#ff7139' },
  { key: 'grammar', label: 'Grammar', score: 62, deltaPct: 8, color: '#3b82f6' },
  { key: 'listening', label: 'Listening', score: 70, deltaPct: 15, color: '#10b981' },
  { key: 'vocabulary', label: 'Vocabulary', score: 68, deltaPct: 10, color: '#a855f7' },
  { key: 'writing', label: 'Writing', score: 60, deltaPct: 11, color: '#f59e0b' },
];

export const mockProgressReviewItems: ProgressReviewCardItem[] = [
  {
    id: 'pr-1',
    title: 'Vocabulary review',
    category: 'Vocabulary',
    itemCount: 8,
    subtitle: 'From your recent lessons',
    previewItems: ['opportunity', 'perspective', 'challenge'],
    ctaLabel: 'Review words →',
    ctaHref: '/vocabulary/review',
    accentColor: 'blue',
  },
  {
    id: 'pr-2',
    title: 'Mistake notebook',
    category: 'Mistakes',
    itemCount: 6,
    subtitle: 'Common errors to fix',
    previewItems: ['"I am agree" → I agree'],
    ctaLabel: 'Review mistakes →',
    ctaHref: '/mistakes',
    accentColor: 'rose',
  },
  {
    id: 'pr-3',
    title: 'Pronunciation practice',
    category: 'Pronunciation',
    itemCount: 5,
    subtitle: 'Words you found tricky',
    previewItems: ['schedule', 'comfortable', 'world'],
    ctaLabel: 'Practice pronunciation →',
    ctaHref: '/practice',
    accentColor: 'orange',
  },
  {
    id: 'pr-4',
    title: 'Spaced repetition',
    category: 'Memory',
    itemCount: 5,
    subtitle: 'Based on your learning history',
    previewItems: ['although', 'achievement', 'perspective'],
    ctaLabel: 'Review now →',
    ctaHref: '/vocabulary/review',
    accentColor: 'amber',
  },
];

export const mockAiInsights: AiInsightCardItem[] = [
  {
    id: 'ai-1',
    title: 'You\'re using more natural sentence patterns this week.',
    description: 'Your conversations sound more fluent and confident.',
    iconType: 'chat',
    bgColor: 'bg-purple-100 text-purple-600',
    iconColor: '#9333ea',
  },
  {
    id: 'ai-2',
    title: 'Fewer grammar mistakes!',
    description: 'Grammar errors are down 28% compared to last month.',
    iconType: 'target',
    bgColor: 'bg-emerald-100 text-emerald-600',
    iconColor: '#059669',
  },
  {
    id: 'ai-3',
    title: 'You\'re learning consistently.',
    description: 'You\'ve practiced 5 days this week. That\'s how real progress happens!',
    iconType: 'leaf',
    bgColor: 'bg-green-100 text-green-600',
    iconColor: '#16a34a',
  },
];

export const mockDailyGoalProgress: DailyGoalProgress = {
  completedItems: 6,
  targetItems: 15,
  streakDays: 18,
};
