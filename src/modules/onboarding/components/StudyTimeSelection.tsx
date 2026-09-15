import React from 'react';
import { OptionCard } from '@/shared/ui/card/OptionCard';
import { DailyStudyTime } from '../types';
import { Clock } from 'lucide-react';

interface StudyTimeSelectionProps {
  value: DailyStudyTime;
  onChange: (val: DailyStudyTime) => void;
}

const studyTimes = [
  {
    id: '5_minutes' as DailyStudyTime,
    title: '5 minutes',
    description: 'A quick start',
  },
  {
    id: '15_minutes' as DailyStudyTime,
    title: '15 minutes',
    description: 'Steady progress',
  },
  {
    id: '30_minutes' as DailyStudyTime,
    title: '30 minutes',
    description: 'Go further',
  },
  {
    id: '60_plus_minutes' as DailyStudyTime,
    title: '60+ minutes',
    description: "I'm fully in!",
  },
];

export function StudyTimeSelection({ value, onChange }: StudyTimeSelectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sola-orange-soft text-sola-orange font-bold text-xs">
            3
          </span>
          <h3 className="text-base sm:text-lg font-bold text-sola-navy">
            How much time can you study per day?
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-sola-text-secondary mt-1 ml-8">
          Even a few minutes each day can make a big difference.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {studyTimes.map((time) => (
          <OptionCard
            key={time.id}
            selected={value === time.id}
            onClick={() => onChange(time.id)}
            icon={<Clock className="w-5 h-5 text-sola-orange" />}
            title={time.title}
            description={time.description}
          />
        ))}
      </div>
    </div>
  );
}
