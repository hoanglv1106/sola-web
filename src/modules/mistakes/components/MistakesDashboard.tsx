'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  BookOpen,
  Headphones,
  Mic,
  Users,
  PenTool,
  RotateCcw,
  MessageSquare,
  Bookmark,
  Sparkles,
  Quote,
  Lightbulb,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  mockMistakeItems,
  mockMistakeStats,
} from '@/mocks/mistakes.mock';
import { MistakeItem } from '../types';
import { Card } from '@/shared/ui/card/Card';
import { Button } from '@/shared/ui/button/Button';
import { ProgressBar } from '@/shared/ui/progress/Progress';
import { cn } from '@/shared/lib/cn';

export function MistakesDashboard() {
  const router = useRouter();
  const [mistakes, setMistakes] = useState<MistakeItem[]>(mockMistakeItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleReview = (id: string) => {
    setMistakes((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isAddedToReview: !m.isAddedToReview } : m
      )
    );
  };

  const filteredMistakes = mistakes.filter((m) => {
    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#fffbf4] via-[#fdf7ee] to-[#fcecd7] border border-amber-200/70 p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-orange-300/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-sola-navy tracking-tight">
              Mistakes & Review
            </h1>
            <p className="text-sm sm:text-base text-sola-text-secondary">
              Turn mistakes into progress.
            </p>
            <div className="flex items-center gap-2 pt-1 text-sola-orange">
              <Quote className="w-4 h-4 fill-sola-orange shrink-0" />
              <p className="text-xs sm:text-sm font-medium italic text-sola-orange">
                &ldquo;Mistakes are not the opposite of success. They&apos;re part of it.&rdquo;
              </p>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2.5">
            <div className="font-handwriting text-2xl font-bold text-amber-900 italic tracking-wide">
              Mistakes today, a brighter you tomorrow. ❤️
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-200/70 text-amber-900 border border-amber-300/60 shadow-xs">
                Turn Errors
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-200/70 text-orange-900 border border-orange-300/60 shadow-xs">
                Into Fluency
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Review Queue Banner Card */}
      <Card className="p-5 sm:p-6 border-amber-200/80 bg-gradient-to-r from-[#fffbf5] via-white to-[#fff8ef] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-sola-orange shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-sola-navy">
                Your review queue for today
              </h2>
              <p className="text-xs text-sola-text-secondary">
                Based on your recent practice, we&apos;ve selected the most important items to review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-sola-text-secondary font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sola-orange" />
              <span>12 items</span>
            </span>
            <span>•</span>
            <span>~ 20 minutes</span>
          </div>
        </div>

        {/* Categories Chips Row + Start CTA */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-amber-100">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-100 text-xs font-bold shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Grammar</span>
              <span className="text-[10px] bg-blue-200/70 text-blue-900 px-1.5 py-0.2 rounded-full">3 items</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold shrink-0">
              <Headphones className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vocabulary</span>
              <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.2 rounded-full">3 items</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 text-orange-800 border border-orange-100 text-xs font-bold shrink-0">
              <Mic className="w-3.5 h-3.5 text-sola-orange" />
              <span>Pronunciation</span>
              <span className="text-[10px] bg-orange-200/70 text-orange-900 px-1.5 py-0.2 rounded-full">2 items</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 text-purple-800 border border-purple-100 text-xs font-bold shrink-0">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Speaking</span>
              <span className="text-[10px] bg-purple-200/70 text-purple-900 px-1.5 py-0.2 rounded-full">2 items</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-100 text-xs font-bold shrink-0">
              <PenTool className="w-3.5 h-3.5 text-amber-600" />
              <span>Writing</span>
              <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded-full">2 items</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            className="text-xs font-bold shrink-0 shadow-sola-button"
            onClick={() => router.push('/mistakes/mis-2/practice')}
          >
            ▶ Start review session →
          </Button>
        </div>
      </Card>

      {/* 3. Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Your Mistake Notebook */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-sola-navy">
                  Your mistake notebook
                </h3>
                <p className="text-xs text-sola-text-secondary">
                  Review, learn, and practice. Each mistake is a step closer to a more confident you.
                </p>
              </div>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-sola-border rounded-xl px-3 py-1.5 text-xs font-semibold text-sola-navy focus:outline-none focus:border-sola-orange self-start sm:self-auto cursor-pointer"
            >
              <option value="all">Most recent</option>
              <option value="grammar">Grammar</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="pronunciation">Pronunciation</option>
              <option value="speaking">Speaking</option>
              <option value="writing">Writing</option>
            </select>
          </div>

          {/* List of Mistake Cards */}
          <div className="space-y-3.5">
            {filteredMistakes.map((item) => (
              <Card
                key={item.id}
                className="p-5 space-y-4 hover:border-orange-200 transition-all hover:shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Category info */}
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-2xl flex items-center justify-center text-xs shrink-0',
                        item.category === 'grammar' && 'bg-blue-100 text-blue-600',
                        item.category === 'vocabulary' && 'bg-emerald-100 text-emerald-600',
                        item.category === 'pronunciation' && 'bg-orange-100 text-sola-orange',
                        item.category === 'speaking' && 'bg-purple-100 text-purple-600',
                        item.category === 'writing' && 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {item.category === 'grammar' && <BookOpen className="w-4 h-4" />}
                      {item.category === 'vocabulary' && <Headphones className="w-4 h-4" />}
                      {item.category === 'pronunciation' && <Mic className="w-4 h-4" />}
                      {item.category === 'speaking' && <Users className="w-4 h-4" />}
                      {item.category === 'writing' && <PenTool className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-sola-navy uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-xs text-sola-text-secondary font-medium">
                          • {item.subcategory}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  {/* Frequency badge */}
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 self-start sm:self-auto">
                    Seen {item.timesSeen} times
                  </span>
                </div>

                {/* Compare: Your answer vs Correct answer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Your answer */}
                  <div className="p-3 rounded-xl bg-red-50/50 border border-red-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-700">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Your answer</span>
                    </div>
                    <p className="text-xs text-sola-navy">
                      {item.userAnswer}
                    </p>
                  </div>

                  {/* Correct answer */}
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Correct answer</span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-900">
                      {item.correctAnswer}
                    </p>
                  </div>
                </div>

                {/* Explanation text */}
                <p className="text-xs text-sola-text-secondary leading-relaxed pt-0.5">
                  {item.explanation}
                </p>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-sola-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold text-sola-orange border-orange-200 hover:bg-orange-50 hover:border-sola-orange"
                    onClick={() => router.push(`/mistakes/${item.id}/practice`)}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    <span>Practice again</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push('/tutor')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-sola-border text-xs font-semibold text-sola-navy hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                      <span>Ask Maya</span>
                    </button>

                    <button
                      onClick={() => toggleReview(item.id)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
                        item.isAddedToReview
                          ? 'bg-amber-100/70 text-amber-900 border-amber-300'
                          : 'border-sola-border text-sola-navy hover:bg-gray-50'
                      )}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{item.isAddedToReview ? 'In review' : 'Add to review'}</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 4 cols: Insights + Maya Tips */}
        <div className="lg:col-span-4 space-y-4">
          {/* Your Mistake Insights Card */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sola-orange" />
                <h3 className="font-extrabold text-sm text-sola-navy">
                  Your mistake insights
                </h3>
              </div>
              <span className="text-[11px] text-sola-text-secondary font-semibold">
                This month ▾
              </span>
            </div>

            {/* Improvement callout */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-sola-orange shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-amber-950">You&apos;re improving!</p>
                <p className="text-amber-900/80 leading-relaxed text-[11px]">
                  You&apos;ve made <span className="font-bold text-sola-orange">28% fewer</span> grammar mistakes compared to last month.
                </p>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-bold text-sola-navy block">
                Most common mistake types
              </span>

              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-sola-navy">
                    <span>Grammar</span>
                    <span>{mockMistakeStats.grammarPct}%</span>
                  </div>
                  <ProgressBar value={mockMistakeStats.grammarPct} className="h-2 bg-orange-100" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-sola-navy">
                    <span>Vocabulary</span>
                    <span>{mockMistakeStats.vocabularyPct}%</span>
                  </div>
                  <ProgressBar value={mockMistakeStats.vocabularyPct} className="h-2 bg-emerald-100" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-sola-navy">
                    <span>Pronunciation</span>
                    <span>{mockMistakeStats.pronunciationPct}%</span>
                  </div>
                  <ProgressBar value={mockMistakeStats.pronunciationPct} className="h-2 bg-orange-100" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-sola-navy">
                    <span>Speaking</span>
                    <span>{mockMistakeStats.speakingPct}%</span>
                  </div>
                  <ProgressBar value={mockMistakeStats.speakingPct} className="h-2 bg-purple-100" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-sola-navy">
                    <span>Writing</span>
                    <span>{mockMistakeStats.writingPct}%</span>
                  </div>
                  <ProgressBar value={mockMistakeStats.writingPct} className="h-2 bg-amber-100" />
                </div>
              </div>
            </div>

            {/* Motivational note */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-sola-text-secondary leading-relaxed">
              Mistakes show what to work on — and how much you&apos;re learning. Keep going! ❤️
            </div>
          </Card>

          {/* Maya's Tips For You */}
          <Card className="p-5 space-y-4 border-amber-200/60 bg-gradient-to-b from-[#fdfbf7] to-white">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                alt="Maya AI"
                className="w-10 h-10 rounded-full object-cover border-2 border-sola-orange shadow-xs"
              />
              <div>
                <h4 className="font-extrabold text-xs text-sola-navy">
                  Maya&apos;s tips for you
                </h4>
                <p className="text-[10px] text-sola-text-secondary">
                  Targeted grammar habit coach
                </p>
              </div>
            </div>

            <p className="text-xs text-sola-navy leading-relaxed">
              You often miss articles like &ldquo;a&rdquo; and &ldquo;the&rdquo;. Let&apos;s do a short grammar practice to make this automatic!
            </p>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-bold text-sola-navy hover:text-sola-orange hover:border-sola-orange"
              onClick={() => router.push('/tutor')}
            >
              Chat with Maya →
            </Button>
          </Card>

          {/* Bottom Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fcf7ee] via-amber-50 to-[#faedd9] border border-amber-200/50">
            <p className="font-handwriting text-base font-bold text-amber-950 italic text-center">
              Every mistake is a step forward. ❤️
            </p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Inspiration Foliage Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="font-bold text-sm text-sola-navy">
            Keep going, Alex.
          </p>
          <p className="text-xs text-sola-text-secondary">
            You&apos;re not defined by your mistakes, but by what you do after them.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-amber-900 tracking-widest uppercase">
          <span>SPEAK</span>
          <span>•</span>
          <span>LEARN</span>
          <span>•</span>
          <span>GROW</span>
          <span>•</span>
          <span>BELONG</span>
        </div>
      </div>
    </div>
  );
}
