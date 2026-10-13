'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { mockAssessmentResult } from '@/mocks/assessment.mock';
import { SkillBreakdownGrid } from '@/modules/assessment/components/SkillBreakdownGrid';
import { PersonalizedLearningPathRoadmap } from '@/modules/assessment/components/PersonalizedLearningPathRoadmap';
import { Button } from '@/shared/ui/button/Button';
import { Card } from '@/shared/ui/card/Card';
import { Badge } from '@/shared/ui/badge/Badge';
import {
  BarChart2,
  Trophy,
  Sparkles,
  Play,
  Heart,
  Target,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function PlacementResultPage() {
  const router = useRouter();
  const result = mockAssessmentResult;

  const handleStartLearning = () => {
    router.push('/home');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sola-navy tracking-tight">
              Your Placement Test Results
            </h1>
            <span className="text-2xl sm:text-3xl">🎉</span>
          </div>
          <p className="text-sm sm:text-base text-sola-text-secondary">
            Here&apos;s a clear picture of your English today — and a brighter path ahead.
          </p>
        </div>

        {/* Right header inspirational banner */}
        <div className="hidden md:flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-amber-200/60 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange">
            <Sparkles className="w-5 h-5 text-sola-orange" />
          </div>
          <div>
            <p className="font-handwriting text-base font-bold text-amber-950 italic flex items-center gap-1">
              <span>A brighter you is closer than you think.</span>
              <Heart className="w-3.5 h-3.5 text-sola-orange fill-sola-orange" />
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-800 pt-0.5">
              <span>Learn Today</span>
              <span>•</span>
              <span>Build Skills</span>
              <span>•</span>
              <span>Brighter Tomorrow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: 3 Key Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Estimated level */}
        <Card className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-sola-orange flex items-center justify-center">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-sola-text-secondary">
                Your estimated level
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-sola-navy tracking-tight">
                {result.estimatedLevel}
              </h2>
              <p className="text-xs sm:text-sm text-sola-text-secondary mt-1 leading-relaxed">
                {result.levelDescription}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Badge variant="gray" size="sm">
              Based on your placement test
            </Badge>
          </div>
        </Card>

        {/* Card 2: Your Goal */}
        <Card className="flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-sola-text-secondary">
                  Your goal
                </span>
              </div>

              <span className="font-handwriting text-sm font-bold text-amber-900 italic">
                Big goals brighter tomorrows. ❤️
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-sola-navy tracking-tight">
                {result.targetGoal}
              </h2>
              <p className="text-xs sm:text-sm text-sola-text-secondary mt-1 leading-relaxed">
                {result.targetDuration}
              </p>
            </div>

            {/* Target Progress Bar */}
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="w-3/5 bg-sola-orange h-full rounded-full" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-sola-orange pt-1">
            <span>You&apos;re on the right track! 🚀</span>
          </div>
        </Card>

        {/* Card 3: AI Tutor Feedback */}
        <Card className="bg-gradient-to-b from-[#fffbf6] to-[#fef6ed] border-amber-200/60 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-4xl font-serif text-sola-orange leading-none">&ldquo;</span>
            <p className="text-sm font-medium text-sola-navy leading-relaxed italic">
              {result.tutorFeedback}
            </p>
          </div>

          <div className="text-xs font-bold text-sola-text-secondary pt-2">
            — SOLA AI Tutor
          </div>
        </Card>
      </div>

      {/* Row 2: Skill Breakdown (8 cols) + AI Insights (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Skill breakdown grid (8 cols) */}
        <div className="lg:col-span-8">
          <SkillBreakdownGrid skills={result.skillBreakdown} />
        </div>

        {/* Right: AI Insights (4 cols) */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-white border border-sola-border shadow-sola-card space-y-5">
          <div className="flex items-center justify-between border-b border-sola-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-100 text-sola-orange">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-base text-sola-navy">AI insights</h3>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-sola-orange hover:text-sola-orange-hover flex items-center gap-1"
            >
              <span>See details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {result.insights.map((insight) => (
              <div
                key={insight.id}
                className="p-3.5 rounded-xl border border-sola-border/70 bg-[#fffdfb] space-y-1 hover:border-orange-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                      insight.type === 'strength'
                        ? 'bg-orange-100 text-sola-orange'
                        : insight.type === 'weakness'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-emerald-100 text-sola-green'
                    }`}
                  >
                    {insight.type === 'strength' && <Trophy className="w-3.5 h-3.5" />}
                    {insight.type === 'weakness' && <Target className="w-3.5 h-3.5" />}
                    {insight.type === 'habit' && <TrendingUp className="w-3.5 h-3.5" />}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-sola-navy">
                    {insight.title}
                  </h4>
                </div>
                <p className="text-xs text-sola-text-secondary pl-8 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Personalized Learning Plan Roadmap */}
      <PersonalizedLearningPathRoadmap roadmap={result.roadmap} />

      {/* Row 4: Bottom CTA & Value Props Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-50 via-white to-orange-50 border border-orange-200/70 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Big Action CTA */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <Button
            size="lg"
            onClick={handleStartLearning}
            iconLeft={<Play className="w-4 h-4 fill-white" />}
            iconRight={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto text-base px-8 py-4 rounded-2xl shadow-sola-hover"
          >
            Start my learning path
          </Button>
        </div>

        {/* Value Props & Encouragement */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6 text-xs sm:text-sm text-sola-navy">
          <div className="flex items-center gap-2 font-medium">
            <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-sola-orange">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block text-xs">Personalized for your goals</span>
              <span className="text-[11px] text-sola-text-secondary">Focus on what you need most.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-medium">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block text-xs">Real progress</span>
              <span className="text-[11px] text-sola-text-secondary">Track your improvement.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-medium">
            <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block text-xs">AI support, anytime</span>
              <span className="text-[11px] text-sola-text-secondary">You&apos;re never alone.</span>
            </div>
          </div>

          <div className="font-handwriting text-base font-bold text-amber-950 italic pl-2">
            You can do this! ❤️
          </div>
        </div>
      </div>
    </div>
  );
}
