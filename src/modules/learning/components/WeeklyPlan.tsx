'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { mockWeeklyPlan } from '@/mocks/learning.mock';
import { Button } from '@/shared/ui/button/Button';
import { Card } from '@/shared/ui/card/Card';
import { ProgressBar } from '@/shared/ui/progress/Progress';
import {
  Calendar,
  Clock,
  Check,
  Star,
  Lightbulb,
  Play,
  Heart,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Mic,
  BookOpen,
  Briefcase,
  Zap,
} from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export function WeeklyPlan() {
  const router = useRouter();
  const plan = mockWeeklyPlan;

  const getDayIcon = (type: string) => {
    switch (type) {
      case 'grammar':
        return <BookOpen className="w-5 h-5 text-sola-blue" />;
      case 'listening':
        return <Headphones className="w-5 h-5 text-sola-green" />;
      case 'speaking':
        return <Mic className="w-5 h-5 text-sola-orange" />;
      case 'professional':
        return <Briefcase className="w-5 h-5 text-rose-600" />;
      case 'vocabulary':
        return <Zap className="w-5 h-5 text-sola-purple" />;
      case 'review':
        return <Star className="w-5 h-5 text-amber-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-sola-orange" />;
    }
  };

  const getDayIconBg = (type: string) => {
    switch (type) {
      case 'grammar':
        return 'bg-blue-100';
      case 'listening':
        return 'bg-emerald-100';
      case 'speaking':
        return 'bg-orange-100';
      case 'professional':
        return 'bg-rose-100';
      case 'vocabulary':
        return 'bg-purple-100';
      case 'review':
        return 'bg-amber-100';
      default:
        return 'bg-orange-100';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs font-bold text-sola-orange uppercase tracking-wider">
            Learn
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sola-navy tracking-tight">
            This Week&apos;s Learning Plan
          </h1>
          <p className="text-sm sm:text-base text-sola-text-secondary">
            Your personalized plan to build real progress, one step at a time.
          </p>
          <p className="text-xs sm:text-sm text-sola-orange font-medium italic pt-0.5">
            &ldquo;Small steps this week lead to bigger opportunities tomorrow.&rdquo;
          </p>
        </div>

        {/* Right header inspirational banner */}
        <div className="hidden md:flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-amber-200/60 shadow-sm">
          <div>
            <p className="font-handwriting text-base font-bold text-amber-950 italic flex items-center gap-1">
              <span>Consistent effort creates a brighter you.</span>
              <Heart className="w-3.5 h-3.5 text-sola-orange fill-sola-orange" />
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-800 pt-0.5">
              <span>Learn Today</span>
              <span>•</span>
              <span>Grow This Week</span>
              <span>•</span>
              <span>Brighter Tomorrow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Goals + Focus Skills + Study Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        {/* 1. This week's goal (5 cols) */}
        <Card className="lg:col-span-5 p-6 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sola-text-secondary font-semibold">
                This week&apos;s goal
              </span>
              <button
                type="button"
                className="text-xs font-bold text-sola-orange hover:underline"
              >
                Edit
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-sola-navy">
              {plan.focusTitle}
            </h3>
            <p className="text-xs sm:text-sm text-sola-text-secondary leading-relaxed">
              {plan.description}
            </p>
          </div>
        </Card>

        {/* 2. Focus skills this week (4 cols) */}
        <Card className="lg:col-span-4 p-6 flex flex-col justify-between space-y-3">
          <span className="text-xs text-sola-text-secondary font-semibold">
            Focus skills this week
          </span>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {plan.focusDistribution.map((item) => (
              <div
                key={item.skill}
                className="p-2.5 rounded-xl border border-sola-border/70 bg-[#fffdfb] flex flex-col items-center text-center space-y-1"
              >
                <div className={cn('p-1.5 rounded-lg', getDayIconBg(item.icon))}>
                  {getDayIcon(item.icon)}
                </div>
                <span className="text-xs font-bold text-sola-navy">
                  {item.skill}
                </span>
                <span className="text-[10px] text-sola-text-secondary font-semibold">
                  {item.percentage}% focus
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* 3. Study time goal (3 cols) */}
        <Card className="lg:col-span-3 p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2 text-sola-navy">
            <Clock className="w-4 h-4 text-sola-orange" />
            <span className="text-xs text-sola-text-secondary font-semibold">
              Study time goal
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-sola-navy">
              {plan.studyTimeGoalMin} minutes
            </h2>
            <div className="pt-3 space-y-1.5">
              <ProgressBar
                value={plan.studyTimeLoggedMin}
                max={plan.studyTimeGoalMin}
                variant="orange"
                size="md"
              />
              <div className="flex justify-between text-xs font-bold text-sola-text-secondary pt-0.5">
                <span>
                  {plan.studyTimeLoggedMin} / {plan.studyTimeGoalMin} min
                </span>
                <span className="text-sola-orange font-extrabold">40%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: 7-Day Weekly Calendar Plan */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sola-border/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-sola-orange">
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-sola-navy">
                Your daily plan
              </h3>
              <p className="text-xs text-sola-text-secondary">
                7 focused lessons this week to keep you moving forward.
              </p>
            </div>
          </div>

          {/* Week Date Selector */}
          <div className="flex items-center gap-2 bg-gray-50 border border-sola-border px-3 py-1.5 rounded-xl text-xs font-bold text-sola-navy">
            <button type="button" className="text-gray-400 hover:text-sola-navy">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Oct 21 – Oct 27, 2024</span>
            <button type="button" className="text-gray-400 hover:text-sola-navy">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7 Days Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {plan.days.map((day) => {
            const isCompleted = day.status === 'completed';
            const isCurrent = day.status === 'current';

            return (
              <div
                key={day.dayName}
                className={cn(
                  'p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all',
                  isCurrent
                    ? 'bg-[#fff9f5] border-sola-orange shadow-md ring-2 ring-sola-orange/20 scale-[1.02]'
                    : isCompleted
                    ? 'bg-white border-sola-border/80 hover:bg-[#fffdfb]'
                    : 'bg-[#fafafa] border-sola-border/60'
                )}
              >
                {/* Date & Indicator */}
                <div className="flex items-center justify-between border-b border-sola-border/50 pb-2">
                  <div>
                    <span
                      className={cn(
                        'text-xs font-extrabold uppercase',
                        isCurrent ? 'text-sola-orange' : 'text-sola-navy'
                      )}
                    >
                      {day.dayName}
                    </span>
                    <span className="text-[10px] text-sola-text-secondary block font-medium">
                      {day.dateLabel}
                    </span>
                  </div>

                  {isCompleted && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sola-green text-white shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-extrabold text-sola-orange bg-orange-100 px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                  {!isCompleted && !isCurrent && (
                    <span className="w-4 h-4 rounded-full border border-gray-300" />
                  )}
                </div>

                {/* Lesson info */}
                <div className="space-y-2 py-1 flex-1 flex flex-col items-center text-center justify-center">
                  <div className={cn('p-2.5 rounded-xl', getDayIconBg(day.type))}>
                    {getDayIcon(day.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-sola-navy leading-snug">
                      {day.title}
                    </h4>
                    <span className="text-[11px] text-sola-text-secondary font-medium">
                      {day.durationMin} min
                    </span>
                  </div>
                </div>

                {/* Action button / Status pill */}
                <div className="pt-1 text-center">
                  {isCompleted && (
                    <span className="text-[11px] font-bold text-sola-green bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg block">
                      Completed
                    </span>
                  )}
                  {isCurrent && (
                    <Button
                      size="sm"
                      onClick={() => router.push('/learn/lessons/rather-vs-prefer')}
                      className="w-full text-xs font-bold py-1.5 shadow-sm"
                    >
                      Start lesson
                    </Button>
                  )}
                  {!isCompleted && !isCurrent && (
                    <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-lg block">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Row 3: Progress + Key Lessons + Why these topics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Progress + Key lessons (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-sola-border/60 pb-3">
              <h4 className="font-bold text-sm text-sola-navy">This week&apos;s progress</h4>
              <span className="text-xs font-bold text-sola-orange">28%</span>
            </div>
            <div className="space-y-2">
              <ProgressBar value={28} variant="orange" size="md" />
              <div className="flex items-center justify-between text-xs text-sola-text-secondary">
                <span>2 of 7 lessons completed</span>
                <span className="font-semibold text-emerald-600">Great start, Alex! 👋</span>
              </div>
            </div>
          </Card>

          {/* Key lessons grid */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-sola-border/60 pb-3">
              <h4 className="font-bold text-sm text-sola-navy">This week&apos;s key lessons</h4>
              <span className="text-xs font-semibold text-sola-orange">See all lessons →</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {plan.days.slice(0, 4).map((d) => (
                <div
                  key={d.dayName}
                  className="p-3 rounded-xl border border-sola-border/70 bg-[#fffdfb] space-y-2"
                >
                  <div className={cn('p-1.5 rounded-lg w-fit', getDayIconBg(d.type))}>
                    {getDayIcon(d.type)}
                  </div>
                  <h5 className="text-xs font-bold text-sola-navy truncate">{d.title}</h5>
                  <span className="text-[10px] text-sola-text-secondary font-medium block">
                    {d.durationMin} min
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Why these topics (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-b from-[#fdfbf6] to-[#f8f0e5] border border-amber-200/70 shadow-sola-card flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-sola-navy">
                Why these topics this week?
              </h4>
            </div>

            <p className="text-xs text-sola-text-secondary leading-relaxed">
              This week focuses on practical communication skills to help you speak more naturally in real-life situations, while strengthening key grammar and vocabulary for your IELTS goal.
            </p>

            <ul className="space-y-2 pt-1">
              {plan.whyTheseTopics.map((pt, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-sola-navy">
                  <Check className="w-3.5 h-3.5 text-sola-orange shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 border border-amber-200/60 shadow-sm">
            <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
              💡 These skills will help you handle everyday conversations more easily and feel more confident in your IELTS speaking test.
            </p>
          </div>
        </div>
      </div>

      {/* Row 4: Bottom CTA */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50 via-white to-orange-50 border border-orange-200/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          size="lg"
          onClick={() => router.push('/learn/lessons/rather-vs-prefer')}
          iconLeft={<Play className="w-4 h-4 fill-white" />}
          className="w-full sm:w-auto px-8 py-3.5 shadow-sola-hover"
        >
          Continue today&apos;s lesson →
        </Button>

        <p className="font-handwriting text-base font-bold text-amber-950 italic flex items-center gap-1.5">
          <span>Today&apos;s effort builds your brighter tomorrow.</span>
          <Heart className="w-3.5 h-3.5 text-sola-orange fill-sola-orange" />
        </p>
      </div>
    </div>
  );
}
