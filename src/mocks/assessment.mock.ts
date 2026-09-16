import { PlacementQuestion, AssessmentResult } from '@/modules/assessment/types';

export const mockPlacementQuestions: PlacementQuestion[] = [
  {
    id: 'q1',
    number: 1,
    totalQuestions: 20,
    category: 'grammar',
    categoryLabel: 'Grammar',
    prompt: 'If I ________ more time yesterday, I would have joined the webinar on international business.',
    options: [
      { id: 'opt1_a', key: 'A', text: 'have' },
      { id: 'opt1_b', key: 'B', text: 'had had' },
      { id: 'opt1_c', key: 'C', text: 'would have' },
      { id: 'opt1_d', key: 'D', text: 'will have' },
    ],
    correctOptionId: 'opt1_b',
  },
  {
    id: 'q2',
    number: 2,
    totalQuestions: 20,
    category: 'vocabulary',
    categoryLabel: 'Vocabulary',
    prompt: 'The new product strategy was designed to ________ customer engagement across all digital platforms.',
    options: [
      { id: 'opt2_a', key: 'A', text: 'diminish' },
      { id: 'opt2_b', key: 'B', text: 'amplify' },
      { id: 'opt2_c', key: 'C', text: 'terminate' },
      { id: 'opt2_d', key: 'D', text: 'hesitate' },
    ],
    correctOptionId: 'opt2_b',
  },
  {
    id: 'q3',
    number: 3,
    totalQuestions: 20,
    category: 'listening',
    categoryLabel: 'Listening',
    prompt: 'Listen to the conversation snippet. What is the speaker’s main recommendation?',
    options: [
      { id: 'opt3_a', key: 'A', text: 'Reschedule the team presentation' },
      { id: 'opt3_b', key: 'B', text: 'Focus on client relationship retention' },
      { id: 'opt3_c', key: 'C', text: 'Hire additional outsourced staff' },
      { id: 'opt3_d', key: 'D', text: 'Cancel the quarter review' },
    ],
    correctOptionId: 'opt3_b',
  },
  {
    id: 'q4',
    number: 4,
    totalQuestions: 20,
    category: 'speaking',
    categoryLabel: 'Speaking',
    prompt: 'Which phrase best expresses polite disagreement during a formal business negotiation?',
    options: [
      { id: 'opt4_a', key: 'A', text: 'You are completely wrong about that.' },
      { id: 'opt4_b', key: 'B', text: 'I see your point, but perhaps we could consider another angle.' },
      { id: 'opt4_c', key: 'C', text: 'No way that works.' },
      { id: 'opt4_d', key: 'D', text: 'I don’t care about this point.' },
    ],
    correctOptionId: 'opt4_b',
  },
  {
    id: 'q5',
    number: 5,
    totalQuestions: 20,
    category: 'grammar',
    categoryLabel: 'Grammar',
    prompt: 'She ________ to the meeting early so that she could prepare everything in advance.',
    options: [
      { id: 'opt5_a', key: 'A', text: 'arrive' },
      { id: 'opt5_b', key: 'B', text: 'arrives' },
      { id: 'opt5_c', key: 'C', text: 'arrived' },
      { id: 'opt5_d', key: 'D', text: 'arriving' },
    ],
    correctOptionId: 'opt5_c',
  },
];

export const mockAssessmentResult: AssessmentResult = {
  estimatedLevel: 'Intermediate (B1)',
  levelDescription: 'You can handle everyday conversations and understand familiar topics.',
  targetGoal: 'IELTS 7.5',
  targetDuration: 'Reach IELTS 7.5 in 3 months',
  tutorFeedback:
    '“You have a solid foundation! With focused practice, you can reach IELTS 7.5.” — SOLA AI Tutor',
  skillBreakdown: [
    {
      skill: 'speaking',
      label: 'Speaking',
      percentage: 72,
      level: 'Your level: B2',
      tag: 'Strongest skill',
      color: 'orange',
    },
    {
      skill: 'listening',
      label: 'Listening',
      percentage: 66,
      level: 'Your level: B1',
      color: 'blue',
    },
    {
      skill: 'grammar',
      label: 'Grammar',
      percentage: 60,
      level: 'Your level: B1',
      color: 'green',
    },
    {
      skill: 'vocabulary',
      label: 'Vocabulary',
      percentage: 58,
      level: 'Your level: B1',
      color: 'purple',
    },
    {
      skill: 'reading',
      label: 'Reading',
      percentage: 65,
      level: 'Your level: B1',
      color: 'red',
    },
    {
      skill: 'writing',
      label: 'Writing',
      percentage: 52,
      level: 'Your level: A2',
      tag: 'Focus area',
      color: 'yellow',
    },
  ],
  insights: [
    {
      id: 'in1',
      title: 'Strong speaking skills!',
      description:
        'You communicate clearly and express ideas naturally. Keep using real conversations!',
      type: 'strength',
    },
    {
      id: 'in2',
      title: 'Writing needs more practice',
      description:
        'Your ideas are good, but organization and grammar can be improved. We’ll focus on this.',
      type: 'weakness',
    },
    {
      id: 'in3',
      title: 'You learn consistently',
      description:
        'You show good potential. With a clear plan and regular practice, reaching IELTS 7.5 is achievable!',
      type: 'habit',
    },
  ],
  roadmap: [
    {
      weeks: 'Weeks 1–4',
      title: 'Build a stronger writing foundation',
      description: 'Sentence structures, punctuation, coherence',
      icon: 'writing',
    },
    {
      weeks: 'Weeks 5–8',
      title: 'Improve listening for real situations',
      description: 'Accents, note-taking, fast speech',
      icon: 'listening',
    },
    {
      weeks: 'Weeks 9–12',
      title: 'Expand academic vocabulary',
      description: 'Collocations, phrasal verbs, formal idioms',
      icon: 'vocabulary',
    },
    {
      weeks: 'Weeks 13–16',
      title: 'Practice speaking for fluency',
      description: 'Spontaneous responses, intonation & confidence',
      icon: 'speaking',
    },
    {
      weeks: 'Weeks 17–24',
      title: 'Take mock tests & track progress',
      description: 'Simulated exam pressure, time management, scoring',
      icon: 'tests',
    },
  ],
};

