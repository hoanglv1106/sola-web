import {
  ExamScoreSummary,
  ExamSectionPractice,
  ExamMockTest,
  ExamRecentResult,
  ExamAiRecommendation,
  ExamPrepFocus,
  IeltsWritingAttempt,
  ToeicTestSession,
} from '@/modules/exams/types';

export const mockIeltsScoreSummary: ExamScoreSummary = {
  examType: 'ielts',
  targetScore: 7.5,
  targetScoreLabel: 'IELTS Overall',
  predictedScore: 6.5,
  predictedScoreLabel: 'IELTS Overall',
  changeText: '+0.5 from last month',
  onTrackMessage: "You're on track! Keep practicing to reach your target score.",
};

export const mockToeicScoreSummary: ExamScoreSummary = {
  examType: 'toeic',
  targetScore: 750,
  targetScoreLabel: 'TOEIC Overall',
  predictedScore: 620,
  predictedScoreLabel: 'TOEIC Overall',
  changeText: '+45 from last month',
  onTrackMessage: "You're making steady gains! Part 1 & 2 practice will boost your score.",
};

export const mockIeltsSections: ExamSectionPractice[] = [
  {
    id: 'ielts-listening',
    title: 'Listening',
    category: 'listening',
    description: 'Practice with real exam style questions',
    progressPercent: 68,
    href: '/exams/toeic/tests/toeic-part-1',
  },
  {
    id: 'ielts-reading',
    title: 'Reading',
    category: 'reading',
    description: 'Build speed and comprehension',
    progressPercent: 54,
    href: '/practice',
  },
  {
    id: 'ielts-writing',
    title: 'Writing',
    category: 'writing',
    description: 'Get AI feedback on your answers',
    progressPercent: 42,
    href: '/exams/ielts/writing/task-2-transport',
  },
  {
    id: 'ielts-speaking',
    title: 'Speaking',
    category: 'speaking',
    description: 'Practice with AI and build fluency',
    progressPercent: 60,
    href: '/tutor/sessions/speaking-1',
  },
];

export const mockToeicSections: ExamSectionPractice[] = [
  {
    id: 'toeic-listening',
    title: 'Listening (Parts 1-4)',
    category: 'listening',
    description: 'Photographs, Q&R, conversations, short talks',
    progressPercent: 72,
    href: '/exams/toeic/tests/toeic-part-1',
  },
  {
    id: 'toeic-reading',
    title: 'Reading (Parts 5-7)',
    category: 'reading',
    description: 'Incomplete sentences, text completion, reading sets',
    progressPercent: 58,
    href: '/practice',
  },
];

export const mockIeltsMockTests: ExamMockTest[] = [
  {
    id: 'ielts-full-mock',
    title: 'IELTS Full Mock Test',
    description: 'Simulate the real IELTS test experience',
    duration: '2 hours 45 minutes',
    questionCount: 40,
    href: '/exams/ielts/writing/task-2-transport',
  },
  {
    id: 'ielts-section-tests',
    title: 'IELTS Section Tests',
    description: 'Choose a section to practice',
    duration: '30 – 60 minutes',
    questionCount: 20,
    href: '/exams/ielts/writing/task-2-transport',
  },
];

export const mockToeicMockTests: ExamMockTest[] = [
  {
    id: 'toeic-full-mock',
    title: 'TOEIC Full Mock Test',
    description: 'Standard 200-question mock exam simulation',
    duration: '2 hours 00 minutes',
    questionCount: 200,
    href: '/exams/toeic/tests/toeic-part-1',
  },
  {
    id: 'toeic-part-tests',
    title: 'TOEIC Part 1 Mini Simulation',
    description: 'Photographs drill with instantaneous scoring',
    duration: '10 minutes',
    questionCount: 6,
    href: '/exams/toeic/tests/toeic-part-1',
  },
];

export const mockIeltsRecentResults: ExamRecentResult[] = [
  {
    id: 'res-1',
    title: 'Full Mock Test',
    date: 'Oct 15, 2024',
    score: '6.5',
    scoreType: 'overall',
  },
  {
    id: 'res-2',
    title: 'Listening',
    date: 'Oct 12, 2024',
    score: '7.0',
    scoreType: 'section',
    category: 'listening',
  },
  {
    id: 'res-3',
    title: 'Reading',
    date: 'Oct 10, 2024',
    score: '6.5',
    scoreType: 'section',
    category: 'reading',
  },
  {
    id: 'res-4',
    title: 'Writing',
    date: 'Oct 8, 2024',
    score: '6.0',
    scoreType: 'section',
    category: 'writing',
  },
  {
    id: 'res-5',
    title: 'Speaking',
    date: 'Oct 5, 2024',
    score: '6.5',
    scoreType: 'section',
    category: 'speaking',
  },
];

export const mockToeicRecentResults: ExamRecentResult[] = [
  {
    id: 'toeic-res-1',
    title: 'Full Mock 1',
    date: 'Oct 14, 2024',
    score: '640',
    scoreType: 'overall',
  },
  {
    id: 'toeic-res-2',
    title: 'Part 1 Photographs',
    date: 'Oct 11, 2024',
    score: '5/6',
    scoreType: 'section',
    category: 'listening',
  },
  {
    id: 'toeic-res-3',
    title: 'Part 5 Incomplete Sentences',
    date: 'Oct 07, 2024',
    score: '24/30',
    scoreType: 'section',
    category: 'reading',
  },
];

export const mockIeltsRecommendations: ExamAiRecommendation[] = [
  {
    id: 'rec-1',
    number: 1,
    title: 'Practice listening for specific details',
    description: 'This question type often challenges you.',
    href: '/exams/toeic/tests/toeic-part-1',
    colorVariant: 'orange',
  },
  {
    id: 'rec-2',
    number: 2,
    title: 'Learn connectors for Writing Task 2',
    description: 'Use linking words to improve coherence.',
    href: '/exams/ielts/writing/task-2-transport',
    colorVariant: 'blue',
  },
  {
    id: 'rec-3',
    number: 3,
    title: 'Try more speaking practice',
    description: 'Build fluency and reduce hesitation.',
    href: '/tutor/sessions/speaking-1',
    colorVariant: 'green',
  },
];

export const mockIeltsPrepFocus: ExamPrepFocus = {
  category: 'listening',
  title: 'Listening – Map & Diagram Questions',
  description:
    "You made great progress in reading! Today we're focusing on listening to strengthen your weaker area and help you move closer to your target score.",
  whyThisText: 'Why this?',
  actionHref: '/exams/toeic/tests/toeic-part-1',
};

// ==========================================
// IELTS WRITING FEEDBACK MOCK
// ==========================================
export const mockWritingAttempt: IeltsWritingAttempt = {
  id: 'task-2-transport',
  taskType: 'Task 2',
  title: 'Public Transport vs Road Infrastructure',
  prompt:
    'Some people believe that governments should spend more money on public transport, while others think it is more important to invest in building new roads for cars. Discuss both views and give your own opinion.',
  wordCount: 276,
  overallBand: 6.5,
  targetBand: 7.5,
  paragraphs: [
    {
      paragraphIndex: 1,
      segments: [
        { text: 'Nowadays, the issue of whether governments should spend more money on public transport or build new roads for cars has become ' },
        { text: 'a controversial topic', correctionId: 'corr-1', category: 'grammar' },
        { text: '. In my opinion, both options have some advantages, but I strongly believe that spending more on public transport is a better solution for the future.' },
      ],
    },
    {
      paragraphIndex: 2,
      segments: [
        { text: 'On the one hand, building new roads can help reduce traffic jams and make travel ' },
        { text: 'more convenient', correctionId: 'corr-2', category: 'vocabulary' },
        { text: ' for people who need to drive. It also supports economic growth because it allows goods to be transported quickly. However, this approach may lead to more cars on the road, ' },
        { text: 'which will cause more pollution', correctionId: 'corr-3', category: 'vocabulary' },
        { text: ' and is not a long-term solution. In addition, roads are expensive to build and maintain, and they often become crowded again after a few years.' },
      ],
    },
    {
      paragraphIndex: 3,
      segments: [
        { text: 'On the other hand, investing in public transport ' },
        { text: 'such as', correctionId: 'corr-5', category: 'vocabulary' },
        { text: ' buses, trains and metros can provide a cleaner and cheaper way to travel. It can also reduce the number of cars, which helps the environment. Some people argue that public transport is ' },
        { text: 'not always convenient', correctionId: 'corr-4', category: 'grammar' },
        { text: ', especially in rural areas. However, I think governments can improve services to make it more reliable and accessible.' },
      ],
    },
    {
      paragraphIndex: 4,
      segments: [
        { text: 'In conclusion, while building new roads has some short-term benefits, governments should ' },
        { text: 'prioritise', correctionId: 'corr-6', category: 'vocabulary' },
        { text: ' public transport because it is more sustainable and can bring greater benefits to society in the long run.' },
      ],
    },
  ],
  rubric: [
    {
      id: 'task-response',
      name: 'Task Response',
      score: 6.0,
      summary:
        'Addresses the task and presents a clear position, but some ideas could be developed further.',
    },
    {
      id: 'coherence',
      name: 'Coherence and Cohesion',
      score: 6.5,
      summary:
        'Well-organized structure with clear paragraphing. Some linking could be more natural and varied.',
    },
    {
      id: 'lexical',
      name: 'Lexical Resource',
      score: 6.5,
      summary:
        'A good range of vocabulary. Some word choices are natural, but there is room for more precise and advanced expressions.',
    },
    {
      id: 'grammar',
      name: 'Grammar',
      score: 6.0,
      summary:
        'A mix of simple and complex sentences. Some grammatical errors affect accuracy.',
    },
  ],
  corrections: [
    {
      id: 'corr-1',
      category: 'grammar',
      categoryLabel: 'Grammar error',
      originalText: 'a controversial topic',
      improvedText: 'a debatable issue / a contentious issue',
      explanation:
        'In academic writing, refer to discussions as "contentious issues" or "subjects of debate" rather than generic "controversial topics".',
      paragraphIndex: 1,
    },
    {
      id: 'corr-2',
      category: 'vocabulary',
      categoryLabel: 'Better word choice',
      originalText: 'more convenient',
      improvedText: 'more convenient and accessible',
      explanation:
        'Pairing adjectives elevates the Lexical Resource score (Band 7+ collocation).',
      paragraphIndex: 2,
    },
    {
      id: 'corr-3',
      category: 'vocabulary',
      categoryLabel: 'Better word choice',
      originalText: 'which will cause more pollution',
      improvedText: 'which can lead to increased pollution',
      explanation:
        'Hedging with "can lead to" demonstrates academic cautiousness compared to definitive future assertions ("will cause").',
      paragraphIndex: 2,
    },
    {
      id: 'corr-4',
      category: 'grammar',
      categoryLabel: 'Grammar error',
      originalText: 'not always convenient',
      improvedText: 'may not always be convenient',
      explanation:
        'Using epistemic modals ("may not always be") improves stylistic sophistication.',
      paragraphIndex: 3,
    },
    {
      id: 'corr-5',
      category: 'suggestion',
      categoryLabel: 'Other suggestion',
      originalText: 'such as',
      improvedText: 'including but not limited to',
      explanation:
        'A formal connective that reinforces precision in supporting examples.',
      paragraphIndex: 3,
    },
    {
      id: 'corr-6',
      category: 'vocabulary',
      categoryLabel: 'Better word choice',
      originalText: 'prioritise',
      improvedText: 'allocate priority funding to',
      explanation:
        'Stronger collocations with government actions demonstrate Band 7+ vocabulary range.',
      paragraphIndex: 4,
    },
  ],
  improvementPlan: [
    {
      stepNumber: 1,
      title: 'Develop your ideas more fully',
      description:
        'Give more specific examples and explanations to support your points.',
    },
    {
      stepNumber: 2,
      title: 'Use more advanced vocabulary',
      description:
        'Try to use a wider range of formal and academic expressions naturally.',
    },
    {
      stepNumber: 3,
      title: 'Improve grammatical accuracy',
      description:
        'Pay attention to verb forms, articles and complex sentence structures.',
    },
  ],
  tutorFeedback: {
    name: 'Maya',
    quote: "You're doing well! Keep building your ideas — you've got this! ❤️",
    message:
      'Your writing shows a clear opinion and good structure. With some more precise vocabulary and grammatical accuracy, you can reach a higher band!',
  },
};

// ==========================================
// TOEIC PRACTICE TEST SIMULATION MOCK
// ==========================================
export const mockToeicSession: ToeicTestSession = {
  id: 'toeic-part-1',
  title: 'TOEIC Practice Test',
  totalQuestions: 6,
  currentSection: 'listening',
  timeRemainingSeconds: 582, // 09:42
  targetScore: 750,
  estimatedScore: 620,
  focusArea: {
    part: 'Part 2: Question-Response',
    description:
      'This question type was more challenging for you. Try more practice to improve.',
  },
  tutorTip:
    'Look carefully at the main action, people, and place in the picture. Don\'t overthink — choose the most natural description.',
  questions: [
    {
      id: 'toeic-q1',
      questionNumber: 1,
      part: 1,
      partTitle: 'Part 1 Photographs',
      instruction:
        'Look at the picture. Choose the best answer (A), (B), (C), or (D).',
      imageUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
      audioPromptText:
        '(A) A woman is writing on a whiteboard. (B) A woman is giving a presentation in a meeting. (C) Several people are sitting at a table. (D) A woman is looking out the window.',
      options: [
        { key: 'A', text: 'A woman is writing on a whiteboard.' },
        { key: 'B', text: 'A woman is giving a presentation in a meeting.' },
        { key: 'C', text: 'Several people are sitting at a table.' },
        { key: 'D', text: 'A woman is looking out the window.' },
      ],
      correctAnswer: 'B',
      explanation:
        'In the photograph, the businesswoman is actively standing in front of a flip chart and pointing to business diagrams while speaking to colleagues in a conference room.',
    },
    {
      id: 'toeic-q2',
      questionNumber: 2,
      part: 1,
      partTitle: 'Part 1 Photographs',
      instruction:
        'Look at the picture. Choose the best answer (A), (B), (C), or (D).',
      imageUrl:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      audioPromptText:
        '(A) Chairs are arranged around a conference table. (B) A projector is being repaired. (C) Documents are scattered on the floor. (D) People are leaving the auditorium.',
      options: [
        { key: 'A', text: 'Chairs are arranged around a conference table.' },
        { key: 'B', text: 'A projector is being repaired.' },
        { key: 'C', text: 'Documents are scattered on the floor.' },
        { key: 'D', text: 'People are leaving the auditorium.' },
      ],
      correctAnswer: 'A',
      explanation:
        'The picture shows an organized modern meeting room where swivel chairs are neatly positioned around an executive table.',
    },
    {
      id: 'toeic-q3',
      questionNumber: 3,
      part: 1,
      partTitle: 'Part 1 Photographs',
      instruction:
        'Look at the picture. Choose the best answer (A), (B), (C), or (D).',
      imageUrl:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      audioPromptText:
        '(A) They are eating lunch outdoors. (B) Team members are collaborating over laptops. (C) A technician is replacing a screen. (D) The office is closed for the day.',
      options: [
        { key: 'A', text: 'They are eating lunch outdoors.' },
        { key: 'B', text: 'Team members are collaborating over laptops.' },
        { key: 'C', text: 'A technician is replacing a screen.' },
        { key: 'D', text: 'The office is closed for the day.' },
      ],
      correctAnswer: 'B',
      explanation:
        'Colleagues are leaning in together around a workspace with open laptops and sharing thoughts.',
    },
    {
      id: 'toeic-q4',
      questionNumber: 4,
      part: 1,
      partTitle: 'Part 1 Photographs',
      instruction:
        'Look at the picture. Choose the best answer (A), (B), (C), or (D).',
      imageUrl:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      audioPromptText:
        '(A) A woman is typing on her computer. (B) Coffee is being served in a cafe. (C) The books are placed on high shelves. (D) Someone is adjusting a headset.',
      options: [
        { key: 'A', text: 'A woman is typing on her computer.' },
        { key: 'B', text: 'Coffee is being served in a cafe.' },
        { key: 'C', text: 'The books are placed on high shelves.' },
        { key: 'D', text: 'Someone is adjusting a headset.' },
      ],
      correctAnswer: 'A',
      explanation:
        'The subject is focused on typing an email or report at her office workstation.',
    },
    {
      id: 'toeic-q5',
      questionNumber: 5,
      part: 1,
      partTitle: 'Part 1 Photographs',
      instruction:
        'Look at the picture. Choose the best answer (A), (B), (C), or (D).',
      imageUrl:
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
      audioPromptText:
        '(A) Two professionals are shaking hands after an agreement. (B) Packages are stacked by the doorway. (C) The curtains have been drawn shut. (D) An employee is sweeping the hallway.',
      options: [
        { key: 'A', text: 'Two professionals are shaking hands after an agreement.' },
        { key: 'B', text: 'Packages are stacked by the doorway.' },
        { key: 'C', text: 'The curtains have been drawn shut.' },
        { key: 'D', text: 'An employee is sweeping the hallway.' },
      ],
      correctAnswer: 'A',
      explanation:
        'The image depicts a firm handshake between two business partners in an open office.',
    },
    {
      id: 'toeic-q6',
      questionNumber: 6,
      part: 1,
      partTitle: 'Part 1 Photographs',
      instruction:
        'Look at the picture. Choose the best answer (A), (B), (C), or (D).',
      imageUrl:
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      audioPromptText:
        '(A) An engineer is examining electronic equipment. (B) Vehicles are parked in an underground garage. (C) A flight is departing from the gate. (D) Groceries are being placed into a cart.',
      options: [
        { key: 'A', text: 'An engineer is examining electronic equipment.' },
        { key: 'B', text: 'Vehicles are parked in an underground garage.' },
        { key: 'C', text: 'A flight is departing from the gate.' },
        { key: 'D', text: 'Groceries are being placed into a cart.' },
      ],
      correctAnswer: 'A',
      explanation:
        'The technician/engineer is testing hardware components in an industrial laboratory environment.',
    },
  ],
};
