'use client';

import React from 'react';
import { TodayLearningPlan } from '@/widgets/today-learning-plan/TodayLearningPlan';
import { AiTutorPanel } from '@/widgets/ai-tutor-panel/AiTutorPanel';
import { ProgressSummary } from '@/widgets/progress-summary/ProgressSummary';
import { SkillOverview } from '@/widgets/skill-overview/SkillOverview';
import { Sparkles, Heart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Top Greeting Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs font-bold text-sola-orange uppercase tracking-wider">
            Thu, Oct 24
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sola-navy tracking-tight">
              Good morning, Alex
            </h1>
            <span className="text-2xl sm:text-3xl">👋</span>
          </div>
          <p className="text-sm sm:text-base text-sola-text-secondary">
            Ready to make today count?
          </p>
          <p className="text-xs sm:text-sm text-sola-orange font-medium italic pt-0.5">
            &ldquo;Consistent practice today builds the confident you tomorrow.&rdquo;
          </p>
        </div>

        {/* Right header inspirational banner */}
        <div className="hidden md:flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-amber-200/60 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange">
            <Sparkles className="w-5 h-5 text-sola-orange" />
          </div>
          <div>
            <p className="font-handwriting text-base font-bold text-amber-950 italic flex items-center gap-1">
              <span>Better English. A brighter You.</span>
              <Heart className="w-3.5 h-3.5 text-sola-orange fill-sola-orange" />
            </p>
            <p className="text-[11px] text-amber-800 font-medium">
              Daily adaptive study session
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: 3-column Primary Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left (4.5 cols on xl, 5 cols on lg): Today's Learning Plan */}
        <div className="lg:col-span-5 xl:col-span-5">
          <TodayLearningPlan />
        </div>

        {/* Middle (4 cols on xl, 4 cols on lg): AI Tutor Panel */}
        <div className="lg:col-span-4 xl:col-span-4">
          <AiTutorPanel />
        </div>

        {/* Right (3.5 cols on xl, 3 cols on lg): Goal & Streak Summary */}
        <div className="lg:col-span-3 xl:col-span-3">
          <ProgressSummary />
        </div>
      </div>

      {/* Row 2: Skill Overview & Session Insight */}
      <div>
        <SkillOverview />
      </div>

      {/* Row 3: Bottom Motivational Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#fdf7ee] via-white to-[#fbf1e2] border border-amber-200/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange shrink-0">
            🌱
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-sola-navy">
              Keep going, Alex.
            </h4>
            <p className="text-xs sm:text-sm text-sola-text-secondary">
              You&apos;re building a stronger, more confident you.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-[11px] font-bold text-amber-900 uppercase tracking-widest">
          <span>Speak</span>
          <span>•</span>
          <span>Learn</span>
          <span>•</span>
          <span>Grow</span>
          <span>•</span>
          <span>Belong</span>
        </div>
      </div>
    </div>
  );
}
