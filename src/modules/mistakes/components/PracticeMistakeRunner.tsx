'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Lightbulb,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Quote,
  Star,
  RotateCcw,
  MessageSquare,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/shared/ui/card/Card';
import { Button } from '@/shared/ui/button/Button';
import { ProgressRing } from '@/shared/ui/progress/ProgressRing';
import { cn } from '@/shared/lib/cn';
import { renderHighlightedText as renderHighlighted } from '@/shared/lib/highlight';
import { useDomainResource } from '@/shared/hooks';
import { fetchMistakePractice } from '../api/mistakes-api';
import { useMistakeProgress } from '../hooks/use-mistake-progress';

export interface PracticeMistakeRunnerProps {
  /** Route param `/mistakes/[mistakeId]/practice`. */
  mistakeId?: string;
}

export function PracticeMistakeRunner({ mistakeId = '' }: PracticeMistakeRunnerProps) {
  const router = useRouter();

  // Stable loader: recreated only when the route id changes, so the resource does
  // not re-fetch (and answers are not reset) on unrelated re-renders.
  const loadPractice = useCallback(
    (signal?: AbortSignal) => fetchMistakePractice(mistakeId, signal),
    [mistakeId]
  );
  // `resourceKey` is the route id: changing it re-runs the loader, aborts the
  // in-flight request for the previous id and clears the previous payload, so a
  // retained runner can never render A's content while showing B's id.
  const resource = useDomainResource(loadPractice, { resourceKey: mistakeId });

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [syncedRevision, setSyncedRevision] = useState(0);

  // Persisted improvement state — the shared source of truth with the dashboard.
  const progress = useMistakeProgress();

  const drill = resource.data?.drill ?? null;
  const requestedId = resource.data?.requestedId ?? mistakeId;

  // Reset per-question state and the improvement flag whenever a NEW drill
  // loads, so answers from a previous route id never leak into the next one.
  useEffect(() => {
    if (resource.revision === 0 || resource.revision === syncedRevision) return;
    setSyncedRevision(resource.revision);
    setQuestionIndex(0);
    setSelectedOption('');
    setShowExplanation(false);
  }, [resource.revision, syncedRevision]);

  const currentQ = drill?.questions[questionIndex] ?? drill?.questions[0];

  // The improvement flag is READ from the persisted store, so it survives
  // navigation and remounts and stays consistent with the notebook dashboard.
  const isMarkedImproved = requestedId ? progress.isImproved(requestedId) : false;

  const handleNextQuestion = () => {
    if (!drill) return;
    if (questionIndex < drill.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption('');
      setShowExplanation(false);
    } else {
      router.push('/mistakes');
    }
  };

  const handlePrevQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
      setSelectedOption('');
      setShowExplanation(false);
    }
  };

  if (resource.state === 'loading') {
    return (
      <div className="space-y-6 pb-16">
        <Card className="p-6 sm:p-8 max-w-2xl">
          <div role="status" aria-live="polite" className="space-y-3">
            <div className="h-5 w-40 rounded-lg bg-gray-100/80 animate-pulse" aria-hidden="true" />
            <div className="h-3 w-64 rounded-lg bg-gray-100/80 animate-pulse" aria-hidden="true" />
            <div className="h-24 w-full rounded-2xl bg-gray-100/80 animate-pulse" aria-hidden="true" />
            <span className="sr-only">Loading this practice drill…</span>
          </div>
        </Card>
      </div>
    );
  }

  if (resource.state === 'error') {
    return (
      <div className="space-y-6 pb-16">
        <Card className="p-6 sm:p-8 space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-sola-navy">
                We couldn&apos;t load this practice drill.
              </h1>
              <p className="text-xs sm:text-sm text-sola-text-secondary">{resource.error}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button variant="primary" size="md" onClick={resource.reload}>
              Try again
            </Button>
            <Button variant="outline" size="md" onClick={() => router.push('/mistakes')}>
              Back to Mistakes &amp; Review
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!drill || !currentQ) {
    return (
      <div className="space-y-6 pb-16">
        <Card className="p-6 sm:p-8 space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-sola-navy">
                Practice drill not found
              </h1>
              <p className="text-xs sm:text-sm text-sola-text-secondary">
                We couldn&apos;t find a practice drill for{' '}
                <span className="font-bold text-sola-navy">
                  {requestedId || '(empty id)'}
                </span>
                . This entry may have been removed from your mistake notebook.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button variant="primary" size="md" onClick={() => router.push('/mistakes')}>
              Back to Mistakes & Review
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Breadcrumbs */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-sola-navy-muted">
          <button
            onClick={() => router.push('/mistakes')}
            className="hover:text-sola-orange transition-colors cursor-pointer"
          >
            Mistakes & Review
          </button>
          <span>&gt;</span>
          <span className="text-sola-orange font-bold">Practice a Mistake</span>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#fffbf4] via-[#fdf7ee] to-[#fcecd7] border border-amber-200/70 p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-sola-navy tracking-tight">
                Practice a Mistake
              </h1>
              <p className="text-xs sm:text-sm text-sola-text-secondary">
                Turn a common mistake into a stronger you.
              </p>
              <div className="flex items-center gap-2 pt-1 text-sola-orange">
                <Quote className="w-3.5 h-3.5 fill-sola-orange shrink-0" />
                <p className="text-xs font-medium italic text-sola-orange">
                  &ldquo;Practice the small things. They make a big difference.&rdquo;
                </p>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="font-handwriting text-xl font-bold text-amber-900 italic">
                Small steps, brighter tomorrows. ❤️
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Practice Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Drill Card + Quick Practice */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Today's Mistake Drill Concept Card */}
          <Card className="p-6 sm:p-7 space-y-5">
            {/* Header + Stepper */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-sola-orange shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-sola-navy">
                    Today&apos;s mistake drill
                  </h2>
                  <p className="text-xs text-sola-text-secondary">
                    Let&apos;s practice this mistake with quick exercises.
                  </p>
                </div>
              </div>

              {/* 4-step stepper */}
              <div className="flex items-center gap-2">
                {[
                  { num: 1, label: 'Learn', active: true },
                  { num: 2, label: 'Practice' },
                  { num: 3, label: 'Check' },
                  { num: 4, label: 'Wrap up' },
                ].map((s, idx) => (
                  <React.Fragment key={s.num}>
                    {idx > 0 && <div className="w-4 h-0.5 bg-gray-200" />}
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all',
                          s.active
                            ? 'bg-sola-orange text-white shadow-sm'
                            : 'bg-gray-100 text-gray-400'
                        )}
                      >
                        {s.num}
                      </div>
                      <span
                        className={cn(
                          'text-[9px] font-bold',
                          s.active ? 'text-sola-orange' : 'text-gray-400'
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Comparison Boxes: The mistake vs The correct answer */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              {/* Mistake Box */}
              <div className="w-full sm:flex-1 p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
                  <XCircle className="w-4 h-4" />
                  <span>The mistake</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-sola-navy">
                  {renderHighlighted(drill.userMistakeSentence, drill.mistakeHighlight, { tone: 'red' })}
                </p>
              </div>

              <div className="text-gray-400 font-bold shrink-0 hidden sm:block">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Correct Box */}
              <div className="w-full sm:flex-1 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>The correct answer</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-emerald-950">
                  {renderHighlighted(drill.correctSentence, drill.correctHighlight, { tone: 'emerald' })}
                </p>
              </div>
            </div>

            {/* Why this is correct? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sola-navy">
                <Lightbulb className="w-4 h-4 text-sola-orange" />
                <span>Why this is correct?</span>
              </div>
              <p className="text-xs sm:text-sm text-sola-navy leading-relaxed">
                {drill.ruleExplanation}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[11px] font-bold text-gray-500">More examples:</span>
                {drill.moreExamples.map((ex, i) => (
                  <span
                    key={i}
                    className={cn(
                      'px-2.5 py-1 rounded-xl text-xs font-medium border flex items-center gap-1',
                      ex.isCorrect
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    )}
                  >
                    {ex.isCorrect ? <Check className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-red-600" />}
                    <span>{ex.sentence}</span>
                    {!ex.isCorrect && <span className="text-[10px] text-red-600 font-bold">(incorrect)</span>}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Card 2: Quick Practice Interactive Quiz */}
          <Card className="p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-sola-navy">
                    Quick practice
                  </h3>
                  <p className="text-xs text-sola-text-secondary">
                    Choose the correct sentence.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sola-navy">
                  {questionIndex + 1} / {drill.questions.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={questionIndex === 0}
                    className="p-1 rounded-lg border border-sola-border text-sola-navy hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={questionIndex === drill.questions.length - 1}
                    className="p-1 rounded-lg border border-sola-border text-sola-navy hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Question sentence */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-sola-orange text-white text-xs font-black flex items-center justify-center shrink-0">
                  {currentQ.questionNumber}
                </div>
                <p className="text-base sm:text-lg font-bold text-sola-navy">
                  {currentQ.prompt}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOption === opt.key;

                  return (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setSelectedOption(opt.key);
                        setShowExplanation(true);
                      }}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer',
                        isSelected && opt.isCorrect
                          ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200'
                          : isSelected && !opt.isCorrect
                          ? 'bg-red-50/70 border-red-300 text-red-950'
                          : 'bg-white border-sola-border hover:border-orange-200 hover:bg-orange-50/30'
                      )}
                    >
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors',
                          isSelected && opt.isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isSelected && !opt.isCorrect
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {isSelected && opt.isCorrect ? <Check className="w-3.5 h-3.5" /> : opt.key}
                      </div>
                      <span className="text-sm font-semibold">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons: Explain + Next Question */}
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-sola-border/60">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/50 text-xs font-bold text-amber-900 hover:bg-amber-100/60 transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4 text-sola-orange" />
                  <span>Explain</span>
                </button>

                <Button
                  variant="primary"
                  size="md"
                  className="text-xs font-bold shadow-sola-button"
                  onClick={handleNextQuestion}
                >
                  <span>Next question</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Explanation dropdown card */}
              {showExplanation && (
                <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/80 text-xs text-orange-950 space-y-1 animate-fade-in">
                  <span className="font-bold block">Explanation:</span>
                  <p>{currentQ.explanation}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right 4 cols: Maya Speech + Progress & Confidence + Actions */}
        <div className="lg:col-span-4 space-y-4">
          {/* Maya Coach Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#fdfbf7] via-white to-[#fdf9f4] border border-amber-200/70 shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 font-bold text-sm text-sola-navy">
                  <span>Maya</span>
                  <span>👋</span>
                </div>
                <span className="text-[11px] text-sola-text-secondary font-medium">
                  Your AI English tutor
                </span>
              </div>
              <div className="font-handwriting text-xs text-amber-900 font-bold italic text-right">
                Mistakes today. A brighter you tomorrow. ♡
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-orange-100 shadow-sm flex items-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                alt="Maya AI English Tutor"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="relative z-10 m-2.5 p-3 rounded-xl bg-white/95 backdrop-blur-sm border border-amber-200/60 shadow-md">
                <p className="text-[11px] font-medium text-sola-navy leading-relaxed">
                  This is a common mistake! You&apos;re not alone. Keep practicing and you&apos;ll use it correctly and naturally soon.
                </p>
              </div>
            </div>
          </div>

          {/* 2 Mini Cards: Your Progress + Your Confidence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Progress */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sola-navy">
                <Star className="w-3.5 h-3.5 text-sola-orange fill-sola-orange" />
                <span>Your progress</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full border-2 border-sola-orange flex items-center justify-center font-black text-xs text-sola-orange">
                  {questionIndex + 1}/4
                </div>
                <div className="text-[10px] space-y-0.5">
                  <span className="font-bold text-sola-navy block">
                    {questionIndex + 1}. Current question
                  </span>
                  <span className="text-gray-400 block">3 remaining</span>
                </div>
              </div>
            </Card>

            {/* Confidence */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sola-navy">
                <Sparkles className="w-3.5 h-3.5 text-sola-orange" />
                <span>Your confidence</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="relative shrink-0">
                  <ProgressRing
                    value={60}
                    size={38}
                    strokeWidth={4}
                    color="orange"
                    hideValue
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-sola-navy">
                    60%
                  </div>
                </div>
                <div className="text-[10px] space-y-0.5">
                  <span className="font-bold text-sola-navy block">
                    Getting stronger!
                  </span>
                  <span className="text-gray-400 block">Keep practicing</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => router.push('/tutor')}
              className="flex items-center justify-center gap-1.5 p-3 rounded-2xl border border-sola-border bg-white text-xs font-bold text-sola-navy hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
              <span>Ask Maya</span>
            </button>

            <button
              onClick={() => {
                setQuestionIndex(0);
                setSelectedOption('B');
                setShowExplanation(true);
              }}
              className="flex items-center justify-center gap-1.5 p-3 rounded-2xl border border-sola-border bg-white text-xs font-bold text-sola-navy hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sola-orange" />
              <span>Practice again</span>
            </button>
          </div>

          {/* Mark as improved CTA banner */}
          <button
            onClick={() => {
              if (!requestedId) return;
              if (isMarkedImproved) {
                progress.unmarkImproved(requestedId);
              } else {
                progress.markImproved(requestedId);
              }
            }}
            className={cn(
              'w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer',
              isMarkedImproved
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-orange-200 hover:shadow-sm'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center',
                  isMarkedImproved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sola-orange text-white'
                )}
              >
                {isMarkedImproved ? <Check className="w-5 h-5" /> : <Star className="w-5 h-5 fill-white" />}
              </div>
              <div>
                <span className="text-xs font-extrabold text-sola-navy block">
                  {isMarkedImproved ? 'Marked as improved! ✓' : 'Mark as improved'}
                </span>
                <span className="text-[11px] text-sola-text-secondary">
                  I can use this correctly now
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-sola-orange" />
          </button>

          {/* Bottom Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fcf7ee] via-amber-50 to-[#faedd9] border border-amber-200/50">
            <p className="font-handwriting text-sm font-bold text-amber-950 italic text-center">
              Every mistake you fix opens a brighter future. ❤️
            </p>
          </div>
        </div>
      </div>

      {/* 3. Bottom Foliage Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="font-bold text-sm text-sola-navy">
            Keep going, Alex.
          </p>
          <p className="text-xs text-sola-text-secondary">
            You&apos;re turning mistakes into progress.
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
