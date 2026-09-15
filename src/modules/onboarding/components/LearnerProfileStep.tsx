import React from 'react';
import { OptionCard } from '@/shared/ui/card/OptionCard';
import { LearnerPersona } from '../types';
import {
  User,
  Briefcase,
  Search,
  Users,
  MoreHorizontal,
} from 'lucide-react';

interface LearnerProfileStepProps {
  value: LearnerPersona;
  onChange: (val: LearnerPersona) => void;
}

const personas = [
  {
    id: 'student' as LearnerPersona,
    title: 'Student',
    description: 'High school or university',
    icon: <User className="w-5 h-5 text-sola-orange" />,
  },
  {
    id: 'working_professional' as LearnerPersona,
    title: 'Working professional',
    description: 'Use English at work',
    icon: <Briefcase className="w-5 h-5 text-sola-blue" />,
  },
  {
    id: 'job_seeker' as LearnerPersona,
    title: 'Job seeker',
    description: 'Prepare for interviews',
    icon: <Search className="w-5 h-5 text-sola-green" />,
  },
  {
    id: 'business_owner' as LearnerPersona,
    title: 'Business owner',
    description: 'Grow your business',
    icon: <Users className="w-5 h-5 text-sola-purple" />,
  },
  {
    id: 'other' as LearnerPersona,
    title: 'Other',
    description: 'Tell us more',
    icon: <MoreHorizontal className="w-5 h-5 text-gray-500" />,
  },
];

export function LearnerProfileStep({ value, onChange }: LearnerProfileStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sola-orange-soft text-sola-orange font-bold text-xs">
            2
          </span>
          <h3 className="text-base sm:text-lg font-bold text-sola-navy">
            What best describes you?
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-sola-text-secondary mt-1 ml-8">
          This helps us tailor examples and topics to your world.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {personas.map((persona) => (
          <OptionCard
            key={persona.id}
            selected={value === persona.id}
            onClick={() => onChange(persona.id)}
            icon={persona.icon}
            title={persona.title}
            description={persona.description}
          />
        ))}
      </div>
    </div>
  );
}
