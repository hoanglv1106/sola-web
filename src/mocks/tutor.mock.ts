import {
  ChatMessage,
  ScenarioInfo,
  LiveFeedbackItem,
  SpeakingFeedbackData,
} from '@/modules/tutor/types';

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'maya',
    text: "Hi Alex! 👋\nToday, let's practice presenting an idea in a team meeting.\nImagine you want to suggest a new feature for your product. I'll be your colleague and give you feedback in real time.\n\nAre you ready? 😊",
    timestamp: '10:24 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: "Yes, let's do it!",
    timestamp: '10:24 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'msg-3',
    sender: 'maya',
    text: "Great! To start, could you tell me briefly what idea you'd like to present and why it's important?",
    timestamp: '10:25 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'msg-4',
    sender: 'user',
    text: "I'd like to suggest a new feature for our app that helps users track their study progress with AI. I think it can increase user engagement.",
    timestamp: '10:26 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'msg-5',
    sender: 'maya',
    text: "That's a great idea! 👍\nCould you elaborate a bit more on how it would work and what benefits it brings to our users?",
    timestamp: '10:26 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
];

export const mockDefaultScenario: ScenarioInfo = {
  id: 'meeting-idea',
  title: 'Presenting an idea in a team meeting',
  description: "You'll practice suggesting a new feature for a product, explaining the benefits, and responding to questions.",
  goal: 'Speak clearly and confidently about your ideas, and handle follow-up questions.',
  durationMin: 8,
  tags: ['Express ideas', 'Use professional language', 'Build confidence'],
};

export const mockLiveFeedbackList: LiveFeedbackItem[] = [
  {
    id: 'fb-1',
    type: 'pronunciation',
    title: 'Pronunciation',
    message: 'Clear and easy to understand!',
  },
  {
    id: 'fb-2',
    type: 'fluency',
    title: 'Fluency',
    message: 'Good flow! Try pausing a little less between ideas.',
  },
  {
    id: 'fb-3',
    type: 'phrasing',
    title: 'Better phrasing',
    message: '“believe” sounds more confident and professional in business settings.',
    originalText: 'I think it can help a lot of users.',
    suggestedText: 'I believe it can help many users and create real value.',
  },
  {
    id: 'fb-4',
    type: 'vocabulary',
    title: 'Key vocabulary',
    message: 'Great use of feature and progress! Try also using engagement, improve, or enhance.',
  },
];

export const mockSpeakingFeedbackData: SpeakingFeedbackData = {
  sessionId: 'meeting-idea',
  overallScore: 85,
  scoreDelta: 12,
  dateStr: 'Thu, Oct 24, 2024 • 10:24 AM',
  topic: 'Suggesting a new feature in a team meeting',
  durationMin: 8,
  mayaComment:
    'You did an amazing job today! Your ideas were clear and natural. Keep practicing — you’re getting closer to your goals! ❤️',
  skills: [
    {
      key: 'fluency',
      label: 'Fluency',
      score: 82,
      comment: 'You spoke smoothly with natural pauses.',
      color: 'green',
    },
    {
      key: 'grammar',
      label: 'Grammar',
      score: 78,
      comment: 'A few small errors, but overall accurate.',
      color: 'blue',
    },
    {
      key: 'pronunciation',
      label: 'Pronunciation',
      score: 80,
      comment: 'Clear and easy to understand.',
      color: 'red',
    },
    {
      key: 'vocabulary',
      label: 'Vocabulary',
      score: 88,
      comment: 'Great variety of words! You used advanced vocabulary naturally.',
      color: 'green',
    },
    {
      key: 'confidence',
      label: 'Confidence',
      score: 84,
      comment: 'You sounded confident and engaged throughout.',
      color: 'purple',
    },
  ],
  corrections: [
    {
      id: 'cor-1',
      userAnswer: 'I think it can increase user engagement.',
      correctAnswer: 'I believe it can increase user engagement.',
    },
    {
      id: 'cor-2',
      userAnswer: 'This feature will help people to manage better.',
      correctAnswer: 'This feature will help people manage their tasks more easily.',
    },
    {
      id: 'cor-3',
      userAnswer: 'We can discuss about it next week.',
      correctAnswer: 'We can discuss it next week.',
    },
  ],
  phrasings: [
    {
      id: 'ph-1',
      standard: "It's a good idea.",
      natural: "That's a great idea!",
    },
    {
      id: 'ph-2',
      standard: 'I want to suggest something.',
      natural: "I'd like to suggest something.",
    },
    {
      id: 'ph-3',
      standard: 'Maybe we can add this feature.',
      natural: 'How about we add this feature?',
    },
  ],
  newVocabulary: ['engagement', 'feature', 'prioritize', 'feedback', 'implementation'],
  strengths: [
    'Expressed your ideas clearly and logically',
    'Used relevant examples from real life',
    'Asked follow-up questions naturally',
    'Maintained a positive and professional tone',
  ],
};
