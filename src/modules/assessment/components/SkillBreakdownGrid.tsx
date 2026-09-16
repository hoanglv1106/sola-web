import React from 'react';
import { SkillScore } from '../types';
import { ProgressRing } from '@/shared/ui/progress/ProgressRing';
import { Badge } from '@/shared/ui/badge/Badge';
import { Calendar } from 'lucide-react';

interface SkillBreakdownGridProps {
  skills: SkillScore[];
}

export function SkillBreakdownGrid({ skills }: SkillBreakdownGridProps) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-sola-border shadow-sola-card space-y-6">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sola-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-sola-orange">
              <Calendar className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-sola-navy">
              Your skill breakdown
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-sola-text-secondary mt-1">
            See your strengths and areas to focus on.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold text-sola-text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sola-orange" />
            <span>Your score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-200 border border-gray-300" />
            <span>Target for IELTS 7.5</span>
          </div>
        </div>
      </div>

      {/* 6 Circular progress rings */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 py-2">
        {skills.map((skill) => (
          <div
            key={skill.skill}
            className="flex flex-col items-center justify-between p-3 rounded-2xl hover:bg-gray-50/50 transition-colors"
          >
            <ProgressRing
              value={skill.percentage}
              size={88}
              strokeWidth={8}
              color={skill.color}
              label={skill.label}
              sublabel={skill.level}
              badge={
                skill.tag ? (
                  <Badge
                    variant={skill.tag === 'Strongest skill' ? 'green' : 'orange'}
                    size="sm"
                  >
                    {skill.tag}
                  </Badge>
                ) : (
                  <div className="h-5" />
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

