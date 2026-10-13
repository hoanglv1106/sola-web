'use client';

import React from 'react';
import { mockGoalSummary } from '@/mocks/learning.mock';
import { Card } from '@/shared/ui/card/Card';
import { Target, Flame, Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export function ProgressSummary() {
  const goal = mockGoalSummary;

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* 1. Your Goal Card */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-sola-orange">
              <Target className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm text-sola-navy">Your goal</h4>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-sola-orange hover:underline"
          >
            Edit
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-extrabold text-sola-navy">
              {goal.examType} {goal.targetScore}
            </h3>
            <span className="text-xs text-sola-text-secondary font-medium">
              Target: {goal.targetScore} • {goal.targetTimeline}
            </span>
          </div>

          {/* Goal progress bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
            <div className="w-3/5 bg-sola-orange h-full rounded-full" />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-sola-text-secondary font-medium">
              Current estimated band
            </span>
            <span className="font-bold text-sola-navy text-sm">
              {goal.currentEstimatedScore}
            </span>
          </div>
        </div>
      </Card>

      {/* 2. Streak Card */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-sola-orange fill-sola-orange" />
          <h4 className="font-bold text-sm text-sola-navy">
            {goal.streakDays} days streak
          </h4>
        </div>

        {/* Days of week dots */}
        <div className="grid grid-cols-7 gap-1 pt-1 text-center">
          {goal.weekStreak.map((w, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'text-[10px] font-semibold',
                  w.isToday ? 'text-sola-orange font-bold' : 'text-gray-400'
                )}
              >
                {w.day}
              </span>

              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-colors',
                  w.active
                    ? 'bg-sola-orange text-white shadow-sm'
                    : 'border border-gray-200 bg-gray-50 text-transparent'
                )}
              >
                {w.active && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. Motivational Landscape Card */}
      <div className="flex-1 p-5 rounded-2xl bg-gradient-to-br from-[#fff7ec] via-[#fef3e3] to-[#fbebd4] border border-amber-200/60 shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[120px]">
        <div className="space-y-1 relative z-10">
          <p className="font-serif italic text-sm text-amber-950 font-medium leading-relaxed">
            &ldquo;A little progress every day leads to big changes.&rdquo;
          </p>
          <div className="w-6 h-0.5 bg-sola-orange rounded-full mt-2" />
        </div>

        {/* Sunrise backdrop illustration */}
        <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-orange-300/30 blur-xl pointer-events-none" />
      </div>
    </div>
  );
}
