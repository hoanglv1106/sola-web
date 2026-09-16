'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockTodaySession } from '@/mocks/learning.mock';
import { Button } from '@/shared/ui/button/Button';
import { Card } from '@/shared/ui/card/Card';
import {
  Clock,
  Check,
  Heart,
  Lightbulb,
  BookOpen,
  ChevronRight,
  ListCheck,
} from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export function TodaySessionRunner() {
  const router = useRouter();
  const session = mockTodaySession;

  // Track answers for Step 1 exercise
  const [answers, setAnswers] = useState<Record<string, string>>({
    q1: 'would rather', // pre-select to match mockup!
  });
  const [isChecked, setIsChecked] = useState(false);

  const currentStep = session.steps[0]; // Step 1 Grammar Warm-up

  const handleSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleNext = () => {
    // Navigate to next activity in daily session (speaking with AI tutor)
    router.push('/tutor/sessions/meeting-idea');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs font-bold text-sola-orange uppercase tracking-wider">
            Thu, Oct 24
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sola-navy tracking-tight">
            Today&apos;s Session
          </h1>
          <p className="text-sm sm:text-base text-sola-text-secondary">
            A 25-minute session, designed just for you.
          </p>
          <p className="text-xs sm:text-sm text-sola-orange font-medium italic pt-0.5">
            &ldquo;{session.quote}&rdquo;
          </p>
        </div>

        {/* Right header inspirational banner */}
        <div className="hidden md:flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-amber-200/60 shadow-xs">
          <div>
            <p className="font-handwriting text-base font-bold text-amber-950 italic flex items-center gap-1">
              <span>Good conversations brighter tomorrows.</span>
              <Heart className="w-3.5 h-3.5 text-sola-orange fill-sola-orange" />
            </p>
            <p className="text-[11px] text-amber-800 font-medium">
              Daily structured session
            </p>
          </div>
        </div>
      </div>

      {/* Stepper Card */}
      <Card className="p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full border-4 border-sola-orange flex items-center justify-center font-bold text-xs text-sola-orange">
            1/4
          </div>
          <div>
            <span className="text-xs font-bold text-sola-navy block">
              Session progress
            </span>
            <span className="text-[11px] text-sola-text-secondary font-medium">
              1 of 4 completed
            </span>
          </div>
        </div>

        {/* 4 Activity Steps */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto w-full md:w-auto">
          {session.steps.map((st, idx) => {
            const isCurrent = st.stepNumber === 1;

            return (
              <React.Fragment key={st.stepNumber}>
                {idx > 0 && <div className="h-0.5 w-6 bg-gray-200 hidden sm:block shrink-0" />}
                <div
                  className={cn(
                    'p-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-2 shrink-0 transition-all',
                    isCurrent
                      ? 'bg-sola-orange text-white border-sola-orange shadow-xs'
                      : 'bg-white border-sola-border text-sola-navy-muted'
                  )}
                >
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold',
                      isCurrent ? 'bg-white text-sola-orange' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {st.stepNumber}
                  </span>
                  <div className="text-left">
                    <span className="text-xs font-bold block leading-tight">
                      {st.title}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] block',
                        isCurrent ? 'text-orange-100' : 'text-gray-400'
                      )}
                    >
                      {st.durationMin} min
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Remaining Time */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-sola-text-secondary shrink-0">
          <Clock className="w-4 h-4 text-sola-orange" />
          <span>~ {session.remainingMin} minutes remaining</span>
        </div>
      </Card>

      {/* Main Content Layout: 8 cols left / 4 cols right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Active Exercise */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            {/* Exercise Header */}
            <div className="flex items-center justify-between border-b border-sola-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-sola-navy">
                      {currentStep.title}
                    </h3>
                    <span className="text-[11px] font-bold text-sola-orange bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                      Step {currentStep.stepNumber} of {session.steps.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-sola-text-secondary">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentStep.durationMin} minutes</span>
              </div>
            </div>

            {/* Headline & Instruction */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-sola-navy">
                {currentStep.headline}
              </h2>
              <p className="text-xs sm:text-sm text-sola-text-secondary">
                {currentStep.instruction}
              </p>
            </div>

            {/* Quick tip box */}
            <div className="p-4 rounded-xl bg-[#fffbf6] border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-sola-navy leading-relaxed">
                  <strong>Quick tip:</strong> {currentStep.tip}
                </p>
              </div>
              <span className="font-handwriting text-sm font-bold text-amber-900 italic shrink-0">
                Small grammar steps, bigger conversations. ❤️
              </span>
            </div>

            {/* Exercise questions */}
            <div className="space-y-4 pt-2">
              <h4 className="font-bold text-sm text-sola-navy">
                1. Choose the correct answer.
              </h4>

              <div className="space-y-3">
                {currentStep.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-sola-border bg-[#fffdfb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-orange-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-sola-navy">
                      <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-sola-text-secondary shrink-0">
                        {idx + 1}
                      </span>
                      <span>
                        {q.sentenceBefore}{' '}
                        <span className="inline-block border-b-2 border-sola-orange min-w-[70px] text-center font-bold text-sola-orange px-1">
                          {answers[q.id] || '________'}
                        </span>{' '}
                        {q.sentenceAfter}
                      </span>
                    </div>

                    {/* Radio Options */}
                    <div className="flex items-center gap-3 shrink-0 pl-8 sm:pl-0">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelect(q.id, opt)}
                            className={cn(
                              'px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all',
                              isSelected
                                ? 'bg-[#fff9f5] border-sola-orange text-sola-orange ring-1 ring-sola-orange'
                                : 'bg-white border-sola-border text-sola-text-secondary hover:bg-gray-50'
                            )}
                          >
                            <span
                              className={cn(
                                'w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0',
                                isSelected ? 'border-sola-orange' : 'border-gray-300'
                              )}
                            >
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-sola-orange" />
                              )}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Check results banner if checked */}
            {isChecked && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
                <Check className="w-5 h-5 text-sola-green shrink-0" />
                <span>Excellent job! All answers are grammatically accurate. Ready for speaking!</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-sola-border/60">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsChecked(true)}
                iconLeft={<ListCheck className="w-4 h-4 text-sola-navy-muted" />}
                className="w-full sm:w-auto"
              >
                Check answers
              </Button>

              <Button
                size="md"
                onClick={handleNext}
                iconRight={<ChevronRight className="w-4 h-4" />}
                className="w-full sm:w-auto px-6 py-2.5 shadow-sola-hover"
              >
                Next: Speaking Practice →
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols): Maya Advice + Next up */}
        <div className="lg:col-span-4 space-y-6">
          {/* Maya Coach Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#fdfbf6] to-[#f8f0e5] border border-amber-200/70 shadow-sola-card space-y-4 relative overflow-hidden">
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

            <div className="p-4 rounded-xl bg-white/90 border border-amber-200/60 shadow-2xs">
              <p className="text-xs text-sola-navy leading-relaxed">
                Great choice, Alex! This grammar warm-up helps you express your ideas more naturally in real conversations. “Would rather” is common in daily life, so it&apos;s perfect for your goal of speaking with more confidence. You&apos;ve got this!
              </p>
            </div>

            <div className="text-right">
              <span className="font-handwriting text-sm font-bold text-amber-900 italic">
                Practice today A brighter you ❤️
              </span>
            </div>
          </div>

          {/* Next Up in This Session */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-sola-border/60 pb-3">
              <h4 className="font-bold text-sm text-sola-navy">
                Next up in this session
              </h4>
              <button
                type="button"
                onClick={() => router.push('/learn/weekly-plan')}
                className="text-xs font-semibold text-sola-orange hover:underline"
              >
                View full plan →
              </button>
            </div>

            <div className="space-y-3">
              {session.steps.slice(1).map((st) => (
                <div
                  key={st.stepNumber}
                  className="p-3 rounded-xl border border-sola-border/70 bg-[#fffdfb] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {st.stepNumber}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-sola-navy">
                        {st.title}
                      </h5>
                      <span className="text-[10px] text-sola-text-secondary">
                        {st.instruction}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-sola-text-secondary shrink-0">
                    {st.durationMin} min
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Bottom motivational card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-white to-amber-50 border border-amber-200/60 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange shrink-0">
              🌱
            </div>
            <div>
              <h5 className="text-xs font-bold text-sola-navy">
                You&apos;re building a stronger you.
              </h5>
              <p className="text-[11px] text-sola-text-secondary">
                Every skill you practice today brings you closer to your goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
