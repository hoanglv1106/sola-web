import React from 'react';
import { OptionCard } from '@/shared/ui/card/OptionCard';
import { LearningGoal } from '../types';
import {
  MessageCircle,
  Briefcase,
  GraduationCap,
  FileCheck2,
  TrendingUp,
} from 'lucide-react';

interface GoalSelectionProps {
  value: LearningGoal;
  onChange: (val: LearningGoal) => void;
}

const goals = [
  {
    id: 'daily_communication' as LearningGoal,
    title: 'Daily communication',
    description: 'Speak naturally in everyday situations',
    icon: <MessageCircle className="w-5 h-5 text-sola-orange" />,
  },
  {
    id: 'professional_english' as LearningGoal,
    title: 'Professional English',
    description: 'Use English at work with confidence',
    icon: <Briefcase className="w-5 h-5 text-sola-purple" />,
  },
  {
    id: 'ielts' as LearningGoal,
    title: 'IELTS',
    description: 'Prepare for your IELTS exam',
    icon: <GraduationCap className="w-5 h-5 text-sola-blue" />,
  },
  {
    id: 'toeic' as LearningGoal,
    title: 'TOEIC',
    description: 'Build skills for your TOEIC test',
    icon: <FileCheck2 className="w-5 h-5 text-indigo-500" />,
  },
  {
    id: 'career_growth' as LearningGoal,
    title: 'Career growth',
    description: 'Unlock new opportunities',
    icon: <TrendingUp className="w-5 h-5 text-sola-green" />,
  },
];

export function GoalSelection({ value, onChange }: GoalSelectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sola-orange-soft text-sola-orange font-bold text-xs">
            1
          </span>
          <h3 className="text-base sm:text-lg font-bold text-sola-navy">
            What&apos;s your main learning goal?
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-sola-text-secondary mt-1 ml-8">
          Choose the goal that matters most to you right now.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {goals.map((goal) => (
          <OptionCard
            key={goal.id}
            selected={value === goal.id}
            onClick={() => onChange(goal.id)}
            icon={goal.icon}
            title={goal.title}
            description={goal.description}
          />
        ))}
      </div>
    </div>
  );
}
