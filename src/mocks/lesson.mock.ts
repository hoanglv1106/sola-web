import { LessonData } from '@/modules/lesson/types';

export const mockGrammarLesson: LessonData = {
  id: 'rather-vs-prefer',
  category: 'Grammar',
  title: 'I’d rather vs I prefer',
  subtitle: 'Learn the difference and how to use them naturally in real conversations.',
  currentStep: 1,
  totalSteps: 4,
  keyConcept: {
    summary: 'Both express a choice or preference, but they are used in slightly different ways.',
    comparisons: [
      {
        title: 'I’d rather',
        bullets: [
          'Sounds more natural and conversational.',
          'Often used to talk about a specific situation.',
          'Commonly followed by the base form of a verb (or a noun, or “than”).',
        ],
        formula: 'I’d rather + verb / noun / than + noun/verb',
        theme: 'orange',
      },
      {
        title: 'I prefer',
        bullets: [
          'A bit more formal and general.',
          'Can be used for specific or general preferences.',
          'Commonly followed by a noun, gerund (-ing), or “to” + verb.',
        ],
        formula: 'I prefer + noun / -ing form / to + verb',
        theme: 'blue',
      },
    ],
  },
  examples: [
    {
      id: 'ex1',
      firstText: 'I’d rather stay home tonight.',
      firstNote: 'I don’t want to go out.',
      secondText: 'I prefer working in the morning.',
      secondNote: 'A general preference.',
    },
    {
      id: 'ex2',
      firstText: 'I’d rather coffee than tea.',
      firstNote: 'This compares two choices.',
      secondText: 'I prefer tea to coffee.',
      secondNote: 'A more formal way to compare.',
    },
    {
      id: 'ex3',
      firstText: 'I’d rather not say.',
      firstNote: 'A polite way to refuse.',
      secondText: 'I prefer to take the train.',
      secondNote: 'Using “to + verb.”',
    },
  ],
  mayaAdvice:
    'Both are correct, but “I’d rather” sounds more natural in everyday conversation. Let’s practice together so you can use them with confidence!',
  mayaTips: [
    'Use “I’d rather” when speaking casually with friends or in daily life.',
    'Use “I prefer” when talking about general preferences or in more formal situations.',
    'Don’t forget: “I’d rather not” + verb is a polite way to decline.',
  ],
  quickCheck: {
    question: 'Which sentence sounds more natural in casual conversation?',
    options: [
      { id: 'qc1', key: 'A', text: 'I prefer not to go to the party.' },
      { id: 'qc2', key: 'B', text: 'I’d rather not go to the party.' },
    ],
    correctOptionId: 'qc2',
    explanation: 'Great! “I’d rather not” sounds more natural and friendly in everyday conversation.',
  },
};

