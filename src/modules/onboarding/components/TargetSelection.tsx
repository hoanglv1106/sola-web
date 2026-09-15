import React from 'react';
import { OptionCard } from '@/shared/ui/card/OptionCard';
import { TargetTimeline } from '../types';
import { Calendar, Compass, Sparkles } from 'lucide-react';

interface TargetSelectionProps {
  value: TargetTimeline;
  onChange: (val: TargetTimeline) => void;
}

const targets = [
  {
    id: '1_month' as TargetTimeline,
    title: 'In 1 month',
    description: 'Build a habit',
    icon: <Calendar className="w-5 h-5 text-sola-orange" />,
  },
  {
    id: '3_months' as TargetTimeline,
    title: 'In 3 months',
    description: 'See real progress',
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
  },
  {
    id: '6_months' as TargetTimeline,
    title: 'In 6 months',
    description: 'Reach a new level',
    icon: <Calendar className="w-5 h-5 text-sola-blue" />,
  },
  {
    id: '1_year' as TargetTimeline,
    title: 'In 1 year',
    description: 'Fluent and confident',
    icon: <Calendar className="w-5 h-5 text-sola-purple" />,
  },
  {
    id: 'not_sure' as TargetTimeline,
    title: 'Not sure yet',
    description: "That's okay!",
    icon: <Compass className="w-5 h-5 text-sola-green" />,
  },
];

export function TargetSelection({ value, onChange }: TargetSelectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sola-orange-soft text-sola-orange font-bold text-xs">
            4
          </span>
          <h3 className="text-base sm:text-lg font-bold text-sola-navy">
            What&apos;s your target?
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-sola-text-secondary mt-1 ml-8">
          Tell us where you want to be, and we&apos;ll help you get there.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {targets.map((target) => (
          <OptionCard
            key={target.id}
            selected={value === target.id}
            onClick={() => onChange(target.id)}
            icon={target.icon}
            title={target.title}
            description={target.description}
          />
        ))}
      </div>
    </div>
  );
}
