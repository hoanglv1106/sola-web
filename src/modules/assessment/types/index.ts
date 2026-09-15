export type SkillCategory = 'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing';

export interface QuestionOption {
  id: string;
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface PlacementQuestion {
  id: string;
  number: number;
  totalQuestions: number;
  category: SkillCategory;
  categoryLabel: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
}

export interface SkillScore {
  skill: SkillCategory;
  label: string;
  percentage: number;
  level: string; // e.g. B1, B2, A2
  tag?: 'Strongest skill' | 'Focus area';
  color: 'orange' | 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

export interface LearningMilestone {
  weeks: string;
  title: string;
  description: string;
  icon: 'writing' | 'listening' | 'vocabulary' | 'speaking' | 'tests';
}

export interface AssessmentResult {
  estimatedLevel: string; // e.g. "Intermediate (B1)"
  levelDescription: string;
  targetGoal: string; // e.g. "IELTS 7.5"
  targetDuration: string; // e.g. "Reach IELTS 7.5 in 3 months"
  tutorFeedback: string;
  skillBreakdown: SkillScore[];
  insights: {
    id: string;
    title: string;
    description: string;
    type: 'strength' | 'weakness' | 'habit';
  }[];
  roadmap: LearningMilestone[];
}
