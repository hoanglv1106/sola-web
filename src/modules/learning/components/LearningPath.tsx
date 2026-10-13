'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  mockLearningPathStages,
  mockWeeklyPlan,
  mockGoalSummary,
} from '@/mocks/learning.mock';
import { Button } from '@/shared/ui/button/Button';
import { Card } from '@/shared/ui/card/Card';
import {
  BarChart2,
  Trophy,
  Check,
  Star,
  Lightbulb,
  Play,
  Heart,
  BookOpen,
  Mic,
  Headphones,
  Briefcase,
  Zap,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export function LearningPath() {
  const router = useRouter();
  const stages = mockLearningPathStages;
  const goal = mockGoalSummary;

  const thisWeekLessons = [
    {
      id: 'rather-vs-prefer',
      title: 'Grammar in Context',
      duration: '20 min',
      topic: 'Conditionals for real life',
      reason: 'Recommended because you often make mistakes with conditionals in speaking and writing.',
      icon: BookOpen,
      iconColor: 'text-sola-blue',
      iconBg: 'bg-blue-100',
      href: '/learn/lessons/rather-vs-prefer',
    },
    {
      id: 'speaking-fluency',
      title: 'Speaking Fluency',
      duration: '25 min',
      topic: 'Express opinions naturally',
      reason: 'Helps you speak more fluently and sound less hesitant in conversation.',
      icon: Mic,
      iconColor: 'text-sola-orange',
      iconBg: 'bg-orange-100',
      href: '/tutor/sessions/practice',
    },
    {
      id: 'listening-practice',
      title: 'Listening Practice',
      duration: '15 min',
      topic: 'Workplace conversations',
      reason: 'Builds your listening skills for real situations you’ll face in study and work.',
      icon: Headphones,
      iconColor: 'text-sola-green',
      iconBg: 'bg-emerald-100',
      href: '/session/today',
    },
    {
      id: 'vocabulary-business',
      title: 'Vocabulary',
      duration: '15 min',
      topic: 'Business & work',
      reason: 'Expands the words you need for professional and academic settings.',
      icon: Zap,
      iconColor: 'text-sola-purple',
      iconBg: 'bg-purple-100',
      href: '/vocabulary',
    },
    {
      id: 'professional-english',
      title: 'Professional English',
      duration: '20 min',
      topic: 'Meetings & presentations',
      reason: 'Prepares you for real-world communication and helps you achieve your career goals.',
      icon: Briefcase,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-100',
      href: '/exams',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs font-bold text-sola-orange uppercase tracking-wider">
            Learn
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sola-navy tracking-tight">
            Your Learning Path
          </h1>
          <p className="text-sm sm:text-base text-sola-text-secondary">
            A personalized English journey, built for you.
          </p>
          <p className="text-xs sm:text-sm text-sola-orange font-medium italic pt-0.5">
            &ldquo;The right steps today, a brighter you tomorrow.&rdquo;
          </p>
        </div>

        {/* Right header inspirational banner */}
        <div className="hidden md:flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-amber-200/60 shadow-sm">
          <div>
            <p className="font-handwriting text-base font-bold text-amber-950 italic flex items-center gap-1">
              <span>Small steps brighter destinations.</span>
              <Heart className="w-3.5 h-3.5 text-sola-orange fill-sola-orange" />
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-800 pt-0.5">
              <span>Fluent You</span>
              <span>•</span>
              <span>New Opportunities</span>
              <span>•</span>
              <span>Brighter Tomorrow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Level + Goal Summary & Motivation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Current Level -> Goal */}
        <Card className="lg:col-span-8 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-sola-orange shrink-0">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-sola-text-secondary font-medium">
                Your current level
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-sola-navy">
                Intermediate (B1)
              </h3>
              <p className="text-xs text-sola-text-secondary">
                You can handle everyday conversations and understand familiar topics.
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-gray-300">➔</div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-sola-text-secondary font-medium">
                Your goal
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-sola-navy">
                {goal.examType} {goal.targetScore}
              </h3>
              <p className="text-xs text-sola-text-secondary">
                Reach {goal.examType} {goal.targetScore} {goal.targetTimeline}
              </p>
              <span className="text-xs font-bold text-sola-orange block pt-0.5">
                You&apos;re on track! 🚀
              </span>
            </div>
          </div>
        </Card>

        {/* Right Card: Motivational Card */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-b from-[#fffcf7] to-[#fbf2e3] border border-amber-200/70 shadow-sola-card flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <h4 className="font-bold text-sm sm:text-base text-sola-navy">
              A more confident you opens a world of opportunities
            </h4>
            <p className="text-xs text-sola-text-secondary">
              — in study, work and life.
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 border border-amber-200 text-xs font-bold text-sola-orange shadow-sm">
              You can do this, Alex! ❤️
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Learning Roadmap (8 cols) + Why/Weak Areas (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Roadmap Stepper (8 cols) */}
        <Card className="lg:col-span-8 p-6 sm:p-8 space-y-8">
          <div className="flex items-center justify-between border-b border-sola-border/60 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-sola-navy">
                Your learning roadmap
              </h3>
              <p className="text-xs sm:text-sm text-sola-text-secondary mt-0.5">
                A clear, step-by-step path tailored to your goals and current level.
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-gray-100 text-xs font-bold text-sola-navy">
              3 months to IELTS 7.5 ▾
            </div>
          </div>

          {/* Horizontal Roadmap Line */}
          <div className="relative py-4 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[550px] relative">
              {/* Connecting Line */}
              <div className="absolute left-6 right-6 top-5 h-1 bg-gray-200 -z-0" />
              <div className="absolute left-6 right-1/2 top-5 h-1 bg-sola-orange -z-0" />

              {stages.map((stage) => {
                const isCompleted = stage.status === 'COMPLETED';
                const isCurrent = stage.status === 'CURRENT';

                return (
                  <div
                    key={stage.id}
                    className="flex flex-col items-center text-center z-10 space-y-2 w-28"
                  >
                    {/* Node Circle */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all',
                        isCompleted && 'bg-sola-orange text-white shadow-sm',
                        isCurrent &&
                          'bg-white border-4 border-sola-orange text-sola-orange shadow-md scale-110 ring-4 ring-orange-100',
                        stage.status === 'AVAILABLE' &&
                          'bg-white border-2 border-gray-300 text-gray-400',
                        stage.status === 'LOCKED' &&
                          'bg-gray-100 text-gray-400 border border-gray-200'
                      )}
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                      {isCurrent && <span className="w-2.5 h-2.5 rounded-full bg-sola-orange" />}
                      {stage.status === 'AVAILABLE' && <span className="w-2 h-2 rounded-full bg-gray-300" />}
                      {stage.status === 'LOCKED' && <Star className="w-4 h-4 text-gray-400" />}
                    </div>

                    <div>
                      <h4
                        className={cn(
                          'text-xs font-bold leading-tight',
                          isCurrent ? 'text-sola-orange' : 'text-sola-navy'
                        )}
                      >
                        {stage.title}
                      </h4>
                      <p className="text-[10px] text-sola-text-secondary leading-tight mt-0.5">
                        {stage.subtitle}
                      </p>
                      <span className="text-[10px] font-semibold text-gray-400 block mt-1">
                        {stage.weeksLabel}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-extrabold text-sola-orange block mt-0.5">
                          You are here
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Right: Why this path & Weak areas (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Why this path? */}
          <Card className="p-5 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-sola-navy">Why this path for you?</h4>
            </div>
            <p className="text-xs text-sola-text-secondary leading-relaxed">
              It&apos;s based on your current level, your goal, and your recent practice performance. We focus on the skills that will make the biggest difference for you now.
            </p>
          </Card>

          {/* Weak areas we are improving */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-sola-orange">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-sola-navy">Weak areas we are improving</h4>
            </div>

            <div className="space-y-2.5 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-sola-navy">Speaking fluency</span>
                  <span className="text-sola-orange">Priority 1</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="w-2/5 bg-sola-orange h-full rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-sola-navy">Academic vocabulary</span>
                  <span className="text-amber-600">Priority 2</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="w-1/2 bg-amber-500 h-full rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-sola-navy">Listening (detail)</span>
                  <span className="text-blue-600">Priority 3</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="w-3/5 bg-sola-blue h-full rounded-full" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-sola-text-secondary pt-1">
              More practice here = faster progress towards your goal.
            </p>
          </Card>
        </div>
      </div>

      {/* Row 3: This Week's Path (5 lesson cards) */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sola-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-sola-navy">
                This week&apos;s path
              </span>
              <span className="text-xs sm:text-sm font-semibold text-sola-text-secondary">
                Week {mockWeeklyPlan.weekNumber} of {mockWeeklyPlan.totalWeeks} • Focus: Real-world English
              </span>
            </div>
          </div>
          <Link
            href="/learn/weekly-plan"
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-sola-orange hover:text-sola-orange-hover"
          >
            <span>View full plan</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5 lesson cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {thisWeekLessons.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="p-4 rounded-xl border border-sola-border bg-[#fffdfb] flex flex-col justify-between space-y-3 hover:border-orange-300 hover:shadow-sm transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn('p-2 rounded-lg', item.iconBg, item.iconColor)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-sola-orange transition-colors" />
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-sola-navy group-hover:text-sola-orange transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-sola-text-secondary block">
                    {item.duration}
                  </span>

                  <h5 className="text-xs font-bold text-sola-navy-muted mt-2 pt-2 border-t border-sola-border/50">
                    {item.topic}
                  </h5>
                  <p className="text-[11px] text-sola-text-secondary mt-1 line-clamp-3 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Row 4: Bottom CTA */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50 via-white to-orange-50 border border-orange-200/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          size="lg"
          onClick={() => router.push('/learn/lessons/rather-vs-prefer')}
          iconLeft={<Play className="w-4 h-4 fill-white" />}
          className="w-full sm:w-auto px-8 py-3.5 shadow-sola-hover"
        >
          Continue this week&apos;s path →
        </Button>

        <div className="text-xs sm:text-sm text-sola-text-secondary italic text-center sm:text-right">
          &ldquo;Every lesson gets you closer to the opportunities you want.&rdquo;
        </div>
      </div>
    </div>
  );
}
