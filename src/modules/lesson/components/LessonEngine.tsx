'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LessonData } from '../types';
import { Button } from '@/shared/ui/button/Button';
import { Card } from '@/shared/ui/card/Card';
import { ProgressBar } from '@/shared/ui/progress/Progress';
import {
  BookOpen,
  Check,
  Volume2,
  Lightbulb,
  Mic,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface LessonEngineProps {
  lesson: LessonData;
}

export function LessonEngine({ lesson }: LessonEngineProps) {
  const router = useRouter();
  const [selectedQuizOption, setSelectedQuizOption] = useState<string>('qc2'); // preselect B to match mockup!

  const steps = [
    { num: 1, label: 'Learn', desc: 'Understand the concept' },
    { num: 2, label: 'Practice', desc: 'Try guided exercises' },
    { num: 3, label: 'Use it', desc: 'Speak in real situations' },
    { num: 4, label: 'Review', desc: 'Check what you’ve learned' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="space-y-1.5 pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-sola-text-secondary">
          <span>Learn</span>
          <span>&gt;</span>
          <span className="text-sola-orange font-bold">{lesson.category}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sola-navy tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-sm sm:text-base text-sola-text-secondary">
          {lesson.subtitle}
        </p>
      </div>

      {/* Stepper & Progress Bar Card */}
      <Card className="p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* 4 Steps */}
        <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto w-full md:w-auto">
          {steps.map((step, idx) => {
            const isCurrent = step.num === lesson.currentStep;
            const isCompleted = step.num < lesson.currentStep;

            return (
              <React.Fragment key={step.num}>
                {idx > 0 && <div className="h-0.5 w-6 bg-gray-200 hidden sm:block shrink-0" />}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0',
                      isCurrent
                        ? 'bg-sola-orange text-white shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-100 text-sola-green'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.num}
                  </div>
                  <div>
                    <span
                      className={cn(
                        'text-xs font-bold block leading-tight',
                        isCurrent ? 'text-sola-navy' : 'text-sola-text-secondary'
                      )}
                    >
                      {step.num}. {step.label}
                    </span>
                    <span className="text-[10px] text-gray-400 hidden sm:block">
                      {step.desc}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Progress Fraction Bar */}
        <div className="w-full md:w-48 shrink-0 space-y-1.5 border-t md:border-t-0 md:border-l border-sola-border md:pl-6 pt-4 md:pt-0">
          <div className="flex justify-between text-xs font-bold text-sola-navy">
            <span>Lesson progress</span>
            <span>{lesson.currentStep}/{lesson.totalSteps} steps</span>
          </div>
          <ProgressBar value={(lesson.currentStep / lesson.totalSteps) * 100} variant="orange" size="sm" />
        </div>
      </Card>

      {/* Main Content Layout: 8 cols left / 4 cols right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Concept + Comparison + Examples */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            {/* Section 1 Header */}
            <div className="flex items-center gap-2.5 border-b border-sola-border/60 pb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sola-orange">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-sola-navy">Learn</h3>
                <p className="text-xs text-sola-text-secondary">
                  Understand the grammar and see how it works in real life.
                </p>
              </div>
            </div>

            {/* Key Concept Box */}
            <div className="p-4 rounded-xl bg-[#fffbf6] border border-amber-200/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-800">
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  Key concept
                </span>
              </div>
              <p className="text-xs sm:text-sm text-sola-navy leading-relaxed">
                <strong className="text-sola-orange">I’d rather</strong> and{' '}
                <strong className="text-sola-blue">I prefer</strong> {lesson.keyConcept.summary}
              </p>
            </div>

            {/* Comparison Side-by-Side Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lesson.keyConcept.comparisons.map((comp) => {
                const isOrange = comp.theme === 'orange';
                return (
                  <div
                    key={comp.title}
                    className={cn(
                      'p-5 rounded-2xl border space-y-3 flex flex-col justify-between',
                      isOrange
                        ? 'bg-[#fff9f5] border-orange-200'
                        : 'bg-[#f8faff] border-blue-200'
                    )}
                  >
                    <div className="space-y-2">
                      <h4
                        className={cn(
                          'font-extrabold text-base',
                          isOrange ? 'text-sola-orange' : 'text-sola-blue'
                        )}
                      >
                        {comp.title}
                      </h4>
                      <ul className="space-y-1.5 text-xs text-sola-navy">
                        {comp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-1.5">
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className={cn(
                        'p-2.5 rounded-xl text-center text-xs font-bold border',
                        isOrange
                          ? 'bg-white border-orange-200 text-sola-orange'
                          : 'bg-white border-blue-200 text-sola-blue'
                      )}
                    >
                      {comp.formula}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section 2: Examples */}
            <div className="pt-4 border-t border-sola-border/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-sola-navy">
                    Examples
                  </h4>
                  <p className="text-xs text-sola-text-secondary">
                    See how they&apos;re used in real sentences.
                  </p>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-sola-border hover:bg-gray-50 text-sola-navy"
                >
                  <Volume2 className="w-3.5 h-3.5 text-sola-orange" />
                  <span>Listen to all</span>
                </button>
              </div>

              {/* Example Pairs */}
              <div className="space-y-3">
                {lesson.examples.map((ex) => (
                  <div
                    key={ex.id}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {/* Left: I'd rather */}
                    <div className="p-3.5 rounded-xl border border-orange-100 bg-[#fffdfb] flex items-center justify-between gap-2 hover:border-orange-300 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-xs sm:text-sm font-bold text-sola-navy">
                          {ex.firstText}
                        </p>
                        <p className="text-[11px] text-sola-text-secondary">
                          {ex.firstNote}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Play audio"
                        className="w-7 h-7 rounded-full bg-orange-100 text-sola-orange flex items-center justify-center shrink-0 hover:scale-105"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Right: I prefer */}
                    <div className="p-3.5 rounded-xl border border-blue-100 bg-[#fbfdff] flex items-center justify-between gap-2 hover:border-blue-300 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-xs sm:text-sm font-bold text-sola-navy">
                          {ex.secondText}
                        </p>
                        <p className="text-[11px] text-sola-text-secondary">
                          {ex.secondNote}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Play audio"
                        className="w-7 h-7 rounded-full bg-blue-100 text-sola-blue flex items-center justify-center shrink-0 hover:scale-105"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols): Maya Advice + Maya's Tips + Quick Check */}
        <div className="lg:col-span-4 space-y-6">
          {/* Maya speech bubble card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#fdfbf6] to-[#f8f0e5] border border-amber-200/70 shadow-sola-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt="Maya"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 font-bold text-sm text-sola-navy">
                  <span>Maya</span>
                  <span>👋</span>
                </div>
                <span className="text-[11px] text-sola-text-secondary">
                  Your AI English tutor
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200/60 shadow-2xs">
              <p className="text-xs text-sola-navy leading-relaxed">
                {lesson.mayaAdvice}
              </p>
            </div>
          </div>

          {/* Maya's tips */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-sola-border/60 pb-2">
              <div className="flex items-center gap-1.5 text-sola-orange font-bold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Maya&apos;s tips</span>
              </div>
              <button type="button" className="text-[11px] font-semibold text-sola-orange">
                See more tips →
              </button>
            </div>

            <div className="space-y-2.5">
              {lesson.mayaTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-sola-navy">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-sola-green flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span className="leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Check */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-sola-border/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-purple-100 text-sola-purple">
                  ⚡
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-sola-navy">
                  Quick check
                </h4>
              </div>
              <button type="button" className="text-[11px] font-semibold text-sola-orange">
                Try more →
              </button>
            </div>

            <p className="text-xs font-semibold text-sola-navy leading-snug">
              {lesson.quickCheck.question}
            </p>

            <div className="space-y-2">
              {lesson.quickCheck.options.map((opt) => {
                const isSelected = selectedQuizOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedQuizOption(opt.id)}
                    className={cn(
                      'w-full text-left p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all',
                      isSelected
                        ? 'bg-[#fff9f5] border-sola-orange text-sola-navy shadow-2xs'
                        : 'bg-white border-sola-border text-sola-text-secondary hover:bg-gray-50'
                    )}
                  >
                    <span
                      className={cn(
                        'w-4 h-4 rounded-full border flex items-center justify-center shrink-0',
                        isSelected ? 'border-sola-orange' : 'border-gray-300'
                      )}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-sola-orange" />}
                    </span>
                    <span>{opt.key}. {opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {selectedQuizOption === lesson.quickCheck.correctOptionId && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-sola-green shrink-0 mt-0.5" />
                <span>{lesson.quickCheck.explanation}</span>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50 via-white to-orange-50 border border-orange-200/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-handwriting text-base font-bold text-amber-950 italic">
          Small steps today, bigger conversations tomorrow. ❤️
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            size="md"
            onClick={() => router.push('/session/today')}
            className="flex-1 sm:flex-none px-6 py-2.5 shadow-sola-hover"
          >
            Continue to practice →
          </Button>

          <Button
            variant="secondary"
            size="md"
            iconLeft={<Bookmark className="w-4 h-4 text-gray-500" />}
            onClick={() => router.push('/home')}
          >
            Save for later
          </Button>
        </div>
      </div>
    </div>
  );
}
