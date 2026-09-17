'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutGrid,
  BookOpen,
  Mic,
  Headphones,
  BookMarked,
  PenTool,
  Type,
  Volume2,
  Briefcase,
  Target,
  BarChart3,
  Flame,
  Clock,
  Check,
  ChevronRight,
  Quote,
} from 'lucide-react';
import {
  PracticeCategory,
  PracticeActivity,
} from '../types';
import {
  mockRecommendedActivities,
  mockAllActivities,
  mockWeeklyPracticeStats,
} from '@/mocks/practice.mock';
import { Card } from '@/shared/ui/card/Card';
import { Button } from '@/shared/ui/button/Button';
import { ProgressRing } from '@/shared/ui/progress/ProgressRing';
import { cn } from '@/shared/lib/cn';

interface CategoryTab {
  id: PracticeCategory;
  label: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryTab[] = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'grammar', label: 'Grammar', icon: BookOpen },
  { id: 'speaking', label: 'Speaking', icon: Mic },
  { id: 'listening', label: 'Listening', icon: Headphones },
  { id: 'reading', label: 'Reading', icon: BookMarked },
  { id: 'writing', label: 'Writing', icon: PenTool },
  { id: 'vocabulary', label: 'Vocabulary', icon: Type },
  { id: 'pronunciation', label: 'Pronunciation', icon: Volume2 },
  { id: 'professional', label: 'Professional', icon: Briefcase },
  { id: 'ielts', label: 'IELTS', icon: Target },
  { id: 'toeic', label: 'TOEIC', icon: BarChart3 },
];

export function PracticeCenter() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<PracticeCategory>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');

  const filteredActivities = mockAllActivities.filter((act) => {
    if (activeCategory !== 'all' && act.category !== activeCategory) return false;
    if (selectedLevel !== 'all' && act.level.toLowerCase() !== selectedLevel.toLowerCase()) return false;
    if (selectedDuration === 'short' && act.durationMin > 8) return false;
    if (selectedDuration === 'long' && act.durationMin <= 8) return false;
    return true;
  });

  const handleStartActivity = (act: PracticeActivity) => {
    if (act.category === 'grammar') {
      router.push('/learn/lessons/id-rather-vs-prefer');
    } else if (act.category === 'vocabulary') {
      router.push('/vocabulary/review');
    } else {
      router.push('/session/today');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#fffbf4] via-[#fdf7ee] to-[#fcecd7] border border-amber-200/70 p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Soft background sunrise blobs */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-orange-300/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-sola-navy tracking-tight">
              Practice Center
            </h1>
            <p className="text-sm sm:text-base text-sola-text-secondary">
              Choose what to practice. Make real progress.
            </p>
            <div className="flex items-center gap-2 pt-1 text-sola-orange">
              <Quote className="w-4 h-4 fill-sola-orange shrink-0" />
              <p className="text-xs sm:text-sm font-medium italic text-sola-orange">
                &ldquo;Practice today. A brighter you tomorrow.&rdquo;
              </p>
            </div>
          </div>

          {/* Right side illustration banner badge */}
          <div className="hidden md:flex flex-col items-end gap-2.5">
            <div className="font-handwriting text-2xl font-bold text-amber-900 italic tracking-wide">
              More practice, A brighter you
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-200/70 text-amber-900 border border-amber-300/60 shadow-xs">
                Practice More
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-200/70 text-orange-900 border border-orange-300/60 shadow-xs">
                Build Confidence
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300/60 shadow-xs">
                Brighter Tomorrow
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer',
                isActive
                  ? 'bg-sola-orange text-white shadow-sola-button'
                  : 'bg-white text-sola-navy-muted border border-sola-border hover:border-orange-200 hover:text-sola-navy hover:bg-orange-50/40'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-sola-text-secondary')} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Grid: Recommended (left) + Weekly Practice Widget (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Recommended for Alex today */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-sola-navy">
                  Recommended for Alex today
                </h2>
                <p className="text-xs text-sola-text-secondary">
                  Based on your progress and recent weak areas.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/progress')}
              className="text-xs font-bold text-sola-orange hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View your progress</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mockRecommendedActivities.map((act, idx) => {
              const isFirst = idx === 0;

              return (
                <Card
                  key={act.id}
                  className="p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-2xl flex items-center justify-center',
                          act.accentColor === 'emerald' && 'bg-emerald-100 text-emerald-600',
                          act.accentColor === 'purple' && 'bg-purple-100 text-purple-600',
                          act.accentColor === 'blue' && 'bg-blue-100 text-blue-600'
                        )}
                      >
                        {act.category === 'listening' && <Headphones className="w-5 h-5" />}
                        {act.category === 'speaking' && <Mic className="w-5 h-5" />}
                        {act.category === 'vocabulary' && <Type className="w-5 h-5" />}
                      </div>
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2.5 py-0.5 rounded-full',
                          act.tag === 'Daily challenge' && 'bg-orange-100 text-sola-orange',
                          act.tag === 'Real conversation' && 'bg-purple-100 text-purple-700',
                          act.tag === 'Quick drill' && 'bg-blue-100 text-blue-700'
                        )}
                      >
                        {act.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-sola-navy leading-snug">
                        {act.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-sola-text-secondary mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{act.durationMin} min</span>
                      </div>
                    </div>

                    <p className="text-xs text-sola-text-secondary leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  <Button
                    variant={isFirst ? 'primary' : 'outline'}
                    size="sm"
                    className="w-full text-xs font-bold"
                    onClick={() => handleStartActivity(act)}
                  >
                    ▶ Start practice →
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right 4 cols: Small motivation & Weekly practice summary */}
        <div className="lg:col-span-4 space-y-4">
          {/* Motivation card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/60 shadow-xs relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-handwriting text-lg font-bold text-amber-950 italic">
                Small practice steps create big opportunities. ❤️
              </p>
            </div>
          </div>

          {/* Your practice this week card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-sola-orange" />
                <h3 className="font-extrabold text-sm text-sola-navy">
                  Your practice this week
                </h3>
              </div>
              <button
                onClick={() => router.push('/progress')}
                className="text-xs font-semibold text-sola-orange hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View details</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <ProgressRing
                  value={(mockWeeklyPracticeStats.sessionsCompleted / mockWeeklyPracticeStats.sessionsGoal) * 100}
                  size={74}
                  strokeWidth={7}
                  color="orange"
                  hideValue
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-extrabold text-sola-navy leading-none">
                    {mockWeeklyPracticeStats.sessionsCompleted}/{mockWeeklyPracticeStats.sessionsGoal}
                  </span>
                  <span className="text-[9px] text-sola-text-secondary font-medium mt-0.5">
                    sessions
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-sola-navy">
                  You&apos;re doing great!
                </p>
                <p className="text-sola-text-secondary text-[11px] leading-relaxed">
                  Just one more session to complete your weekly goal.
                </p>
              </div>
            </div>

            {/* 7 Days tracker dots */}
            <div className="grid grid-cols-7 gap-1 pt-1 border-t border-sola-border/60">
              {mockWeeklyPracticeStats.dailyStatus.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-sola-navy-muted">
                    {d.day}
                  </span>
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center transition-all',
                      d.completed
                        ? 'bg-sola-orange text-white shadow-xs'
                        : 'border border-gray-200 bg-white text-transparent'
                    )}
                  >
                    {d.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 4. All Practice Activities Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-sola-navy">
                All practice activities
              </h2>
              <p className="text-xs text-sola-text-secondary">
                Choose a topic, set your time, and start practicing. Every minute counts!
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-white border border-sola-border rounded-xl px-3 py-1.5 font-semibold text-sola-navy focus:outline-none focus:border-sola-orange cursor-pointer"
            >
              <option value="all">All levels</option>
              <option value="intermediate">Intermediate</option>
              <option value="upper-intermediate">Upper-intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="bg-white border border-sola-border rounded-xl px-3 py-1.5 font-semibold text-sola-navy focus:outline-none focus:border-sola-orange cursor-pointer"
            >
              <option value="all">All durations</option>
              <option value="short">&le; 8 min</option>
              <option value="long">&gt; 8 min</option>
            </select>
          </div>
        </div>

        {/* Activity Cards List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredActivities.map((act) => (
            <Card
              key={act.id}
              className="p-4 flex flex-col justify-between space-y-3 hover:border-orange-200 transition-all hover:shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center text-xs',
                      act.category === 'grammar' && 'bg-orange-100 text-sola-orange',
                      act.category === 'speaking' && 'bg-rose-100 text-rose-600',
                      act.category === 'listening' && 'bg-emerald-100 text-emerald-600',
                      act.category === 'reading' && 'bg-violet-100 text-violet-600',
                      act.category === 'writing' && 'bg-amber-100 text-amber-700',
                      act.category === 'pronunciation' && 'bg-cyan-100 text-cyan-700',
                      act.category === 'professional' && 'bg-red-100 text-red-700',
                      act.category === 'toeic' && 'bg-sky-100 text-sky-700'
                    )}
                  >
                    {act.category === 'grammar' && <BookOpen className="w-4 h-4" />}
                    {act.category === 'speaking' && <Mic className="w-4 h-4" />}
                    {act.category === 'listening' && <Headphones className="w-4 h-4" />}
                    {act.category === 'reading' && <BookMarked className="w-4 h-4" />}
                    {act.category === 'writing' && <PenTool className="w-4 h-4" />}
                    {act.category === 'pronunciation' && <Volume2 className="w-4 h-4" />}
                    {act.category === 'professional' && <Briefcase className="w-4 h-4" />}
                    {act.category === 'toeic' && <BarChart3 className="w-4 h-4" />}
                  </div>

                  <span
                    className={cn(
                      'text-[9px] font-bold px-2 py-0.5 rounded-full',
                      act.tag === 'Quick drill' && 'bg-blue-50 text-blue-700',
                      act.tag === 'Real conversation' && 'bg-purple-50 text-purple-700',
                      act.tag === 'Daily challenge' && 'bg-orange-50 text-sola-orange',
                      act.tag === 'Exam practice' && 'bg-violet-50 text-violet-700',
                      act.tag === 'Skill builder' && 'bg-amber-50 text-amber-700'
                    )}
                  >
                    {act.tag}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-xs text-sola-navy leading-snug">
                    {act.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-sola-text-secondary mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{act.durationMin} min</span>
                  </div>
                </div>

                <p className="text-[11px] text-sola-text-secondary line-clamp-2 leading-relaxed">
                  {act.description}
                </p>

                <div className="pt-1">
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-sola-navy-muted">
                    {act.level}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-[11px] font-bold py-1.5 hover:bg-sola-orange hover:text-white hover:border-sola-orange"
                onClick={() => handleStartActivity(act)}
              >
                ▶ Start practice →
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. Bottom Inspiration Foliage Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="font-bold text-sm text-sola-navy">
            Keep going, Alex.
          </p>
          <p className="text-xs text-sola-text-secondary">
            Practice builds skills. Skills open doors.
          </p>
        </div>
        <p className="font-handwriting text-xl text-amber-900 font-bold italic">
          Better English, A brighter you ❤️
        </p>
      </div>
    </div>
  );
}
