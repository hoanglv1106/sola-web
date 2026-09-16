import {
  DailyLearningTask,
  LearnerGoalSummary,
  SkillProgressMetric,
  LearningPathStage,
  WeeklyPlanOverview,
  TodaySessionData,
} from '@/modules/learning/types';

export const mockDailyTasks: DailyLearningTask[] = [
  {
    id: 'dt1',
    type: 'speaking',
    title: 'Speaking Practice',
    subtitle: 'Discuss a product idea in a team meeting',
    durationMin: 8,
    href: '/tutor/sessions/meeting-idea',
  },
  {
    id: 'dt2',
    type: 'grammar',
    title: 'Grammar Focus',
    subtitle: '“I’d rather” vs “I prefer”',
    durationMin: 7,
    href: '/learn/lessons/rather-vs-prefer',
  },
  {
    id: 'dt3',
    type: 'listening',
    title: 'Listening Practice',
    subtitle: 'Startup conversation: decisions & trade-offs',
    durationMin: 5,
    href: '/session/today',
  },
  {
    id: 'dt4',
    type: 'review',
    title: 'Review & Vocabulary',
    subtitle: '12 words from your last conversation',
    durationMin: 5,
    href: '/vocabulary/review',
  },
];

export const mockGoalSummary: LearnerGoalSummary = {
  examType: 'IELTS',
  targetScore: 7.5,
  currentEstimatedScore: 6.0,
  targetTimeline: 'In 3 months',
  streakDays: 18,
  weekStreak: [
    { day: 'Mon', active: true },
    { day: 'Tue', active: true },
    { day: 'Wed', active: true },
    { day: 'Thu', active: true, isToday: true },
    { day: 'Fri', active: false },
    { day: 'Sat', active: false },
    { day: 'Sun', active: false },
  ],
};

export const mockSkillSnapshots: SkillProgressMetric[] = [
  { skill: 'speaking', name: 'Speaking', percentage: 78, changePercent: 12, color: 'orange' },
  { skill: 'listening', name: 'Listening', percentage: 62, changePercent: 8, color: 'blue' },
  { skill: 'grammar', name: 'Grammar', percentage: 70, changePercent: 15, color: 'green' },
  { skill: 'vocabulary', name: 'Vocabulary', percentage: 68, changePercent: 10, color: 'purple' },
  { skill: 'reading', name: 'Reading', percentage: 75, changePercent: 9, color: 'red' },
  { skill: 'writing', name: 'Writing', percentage: 60, changePercent: 11, color: 'yellow' },
];

export const mockLearningPathStages: LearningPathStage[] = [
  {
    id: 'st1',
    title: 'Foundation',
    subtitle: 'Build core skills',
    weeksLabel: 'Weeks 1–2',
    status: 'COMPLETED',
  },
  {
    id: 'st2',
    title: 'Communication',
    subtitle: 'Speak with confidence',
    weeksLabel: 'Weeks 3–4',
    status: 'COMPLETED',
  },
  {
    id: 'st3',
    title: 'Real-world English',
    subtitle: 'Use English at work & study',
    weeksLabel: 'Weeks 5–7',
    status: 'CURRENT',
    isCurrent: true,
  },
  {
    id: 'st4',
    title: 'Exam Readiness',
    subtitle: 'Targeted practice',
    weeksLabel: 'Weeks 8–10',
    status: 'AVAILABLE',
  },
  {
    id: 'st5',
    title: 'Achieve Your Goal',
    subtitle: 'IELTS 7.5 🎯',
    weeksLabel: 'Weeks 11–12',
    status: 'LOCKED',
  },
];

export const mockWeeklyPlan: WeeklyPlanOverview = {
  weekNumber: 5,
  totalWeeks: 12,
  focusTitle: 'Build confidence in real-world conversations',
  description: 'Practice speaking, useful vocabulary, and natural expressions for work and everyday life.',
  studyTimeGoalMin: 150,
  studyTimeLoggedMin: 60,
  focusDistribution: [
    { skill: 'Listening', percentage: 15, icon: 'listening' },
    { skill: 'Speaking', percentage: 35, icon: 'speaking' },
    { skill: 'Grammar', percentage: 25, icon: 'grammar' },
    { skill: 'Professional', percentage: 25, icon: 'professional' },
  ],
  days: [
    { dayName: 'MON', dateLabel: 'Oct 21', title: 'Grammar in Context', durationMin: 20, status: 'completed', type: 'grammar' },
    { dayName: 'TUE', dateLabel: 'Oct 22', title: 'Listening Practice', durationMin: 15, status: 'completed', type: 'listening' },
    { dayName: 'WED', dateLabel: 'Oct 23', title: 'Speaking Confidence', durationMin: 25, status: 'current', type: 'speaking' },
    { dayName: 'THU', dateLabel: 'Oct 24', title: 'Professional English', durationMin: 20, status: 'upcoming', type: 'professional' },
    { dayName: 'FRI', dateLabel: 'Oct 25', title: 'Vocabulary in Action', durationMin: 15, status: 'upcoming', type: 'vocabulary' },
    { dayName: 'SAT', dateLabel: 'Oct 26', title: 'Real-life Listening', durationMin: 20, status: 'upcoming', type: 'listening' },
    { dayName: 'SUN', dateLabel: 'Oct 27', title: 'Weekly Review', durationMin: 15, status: 'upcoming', type: 'review' },
  ],
  whyTheseTopics: [
    'Build speaking confidence',
    'Use natural expressions at work',
    'Strengthen grammar in context',
    'Learn useful professional vocabulary',
  ],
};

export const mockTodaySession: TodaySessionData = {
  title: "Today's Session",
  totalDurationMin: 25,
  remainingMin: 20,
  quote: 'Consistent practice today builds the confident you tomorrow.',
  steps: [
    {
      stepNumber: 1,
      title: 'Grammar Warm-up',
      durationMin: 5,
      type: 'grammar',
      status: 'current',
      headline: 'Let’s practice: “would rather”',
      instruction: 'Use “would rather” to talk about preferences. Choose the correct form to complete each sentence.',
      tip: '“Would rather” means you prefer one thing over another. It’s followed by the base form of a verb (not “to”).',
      questions: [
        {
          id: 'q1',
          sentenceBefore: 'I',
          sentenceAfter: 'stay at home tonight. I’m too tired.',
          options: ['would rather', 'would rather to'],
          correctAnswer: 'would rather',
        },
        {
          id: 'q2',
          sentenceBefore: 'She',
          sentenceAfter: 'take a bus instead of a taxi.',
          options: ['would rather', 'would rather to'],
          correctAnswer: 'would rather',
        },
        {
          id: 'q3',
          sentenceBefore: 'We',
          sentenceAfter: 'have a quiet dinner than go to a party.',
          options: ['would rather', 'would rather to'],
          correctAnswer: 'would rather',
        },
        {
          id: 'q4',
          sentenceBefore: 'They',
          sentenceAfter: 'not discuss the issue right now.',
          options: ['would rather', 'would rather to'],
          correctAnswer: 'would rather',
        },
      ],
    },
    {
      stepNumber: 2,
      title: 'Speaking Practice',
      durationMin: 8,
      type: 'speaking',
      status: 'upcoming',
      headline: 'Speaking: Product Proposal',
      instruction: 'Discuss a new product proposal with your colleague Maya in real-time.',
      tip: 'Use polite phrases like "I would rather consider..." when sharing trade-offs.',
      questions: [],
    },
    {
      stepNumber: 3,
      title: 'Listening Practice',
      durationMin: 7,
      type: 'listening',
      status: 'upcoming',
      headline: 'Startup Decisions & Trade-offs',
      instruction: 'Listen to the founders discuss their roadmap decisions.',
      tip: 'Pay attention to words indicating contrasts: however, although, on the other hand.',
      questions: [],
    },
    {
      stepNumber: 4,
      title: 'Vocabulary Review',
      durationMin: 5,
      type: 'review',
      status: 'upcoming',
      headline: '12 Essential Collocations',
      instruction: 'Review high-frequency vocabulary from past conversations.',
      tip: 'Active recall strengthens neural pathways for spontaneous speech.',
      questions: [],
    },
  ],
};

