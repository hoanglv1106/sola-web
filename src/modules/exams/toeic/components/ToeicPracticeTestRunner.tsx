'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Headphones,
  BookOpen,
  Clock,
  Pause,
  Star,
  ZoomIn,
  Target,
  TrendingUp,
  Volume2,
  CheckCircle2,
  ChevronRight,
  Sprout,
  Heart,
  X,
} from 'lucide-react';
import { Card } from '@/shared/ui/card/Card';
import { Button } from '@/shared/ui/button/Button';
import { mockToeicSession } from '@/mocks/exams.mock';
import { ToeicQuestion } from '../../types';
import { useMockSession } from '@/modules/learner';
import {
  canMutateAnswers,
  finalizeTestClock,
  formatTimeSeconds,
  scoreToeicTest,
  tickTestClock,
  type TestClockState,
} from '../../toeic/model';

export function ToeicPracticeTestRunner() {
  const router = useRouter();
  const session = mockToeicSession;
  const { profile } = useMockSession();

  const [currentSection, setCurrentSection] = useState<'listening' | 'reading'>('listening');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({
    'toeic-q1': 'B', // default selected in design
  });
  const [reviewLater, setReviewLater] = useState<Record<string, boolean>>({});
  const [clock, setClock] = useState<TestClockState>(() => ({
    secondsRemaining: session.timeRemainingSeconds,
    isPaused: false,
    isSubmitted: false,
  }));
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const timeRemaining = clock.secondsRemaining;
  const isPaused = clock.isPaused;
  const isSubmitted = clock.isSubmitted;

  // Countdown. Reaching zero finalizes the test exactly once (handled inside
  // `tickTestClock`, which also clears the interval by flipping `isSubmitted`).
  useEffect(() => {
    if (clock.isPaused || clock.isSubmitted) return;

    const interval = setInterval(() => {
      setClock((prev) => {
        const tick = tickTestClock(prev);
        return tick.state;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [clock.isPaused, clock.isSubmitted]);

  // A session that starts (or resumes) with no time left must also finalize.
  useEffect(() => {
    if (clock.secondsRemaining <= 0 && !clock.isSubmitted) {
      setClock((prev) => finalizeTestClock(prev));
    }
  }, [clock.secondsRemaining, clock.isSubmitted]);

  const currentQ: ToeicQuestion = session.questions[currentQuestionIndex];
  const isBookmarked = !!reviewLater[currentQ.id];
  const selectedAnswer = userAnswers[currentQ.id];
  const answersLocked = !canMutateAnswers(clock);

  const formatTime = (seconds: number) => formatTimeSeconds(seconds);

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (answersLocked) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key,
    }));
  };

  const toggleBookmark = () => {
    if (answersLocked) return;
    setReviewLater((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setClock((prev) => finalizeTestClock(prev));
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Score for the results modal. Unanswered questions count as wrong and never
  // produce a negative or NaN percentage.
  const score = scoreToeicTest(session.questions, userAnswers);
  const wasExpired = timeRemaining === 0 && score.unansweredCount > 0;

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#fffbf4] via-[#fdf7ee] to-[#faedd9] border border-amber-200/70 p-6 sm:p-8 shadow-sm">
        <div className="absolute -top-16 -right-12 w-64 h-64 rounded-full bg-orange-300/25 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-sola-orange tracking-wider uppercase">
              TOEIC
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-sola-navy tracking-tight">
              TOEIC Practice Test
            </h1>
            <p className="text-sm sm:text-base text-sola-text-secondary font-medium">
              Real practice. Real progress. A brighter you.
            </p>

            {/* Listening / Reading Category Tab Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCurrentSection('listening')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  currentSection === 'listening'
                    ? 'bg-white text-sola-orange border border-orange-200/90 shadow-sm'
                    : 'bg-transparent text-sola-navy-muted hover:text-sola-navy'
                }`}
              >
                <Headphones className="w-4 h-4 text-sola-orange" />
                <span>Listening</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection('reading')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  currentSection === 'reading'
                    ? 'bg-white text-sola-orange border border-orange-200/90 shadow-sm'
                    : 'bg-transparent text-sola-navy-muted hover:text-sola-navy'
                }`}
              >
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Reading</span>
              </button>
            </div>
          </div>

          {/* Right Banner Artwork */}
          <div className="hidden sm:flex flex-col items-end gap-2">
            <div className="font-handwriting text-2xl font-bold text-amber-900/90 italic flex items-center gap-1.5">
              <span>Practice today, A brighter tomorrow.</span>
              <Heart className="w-4 h-4 text-sola-orange fill-sola-orange inline-block" />
            </div>
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-white shadow-sm bg-amber-100">
              <Image
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                alt="Student progress"
                fill
                className="object-cover"
                sizes="112px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Test Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Question area, image, audio, options, controls */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-5 sm:p-7 space-y-6 bg-white border-amber-200/70">
            {/* Question Header: Part title, Question index, Timer, Pause button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-sola-navy tracking-tight">
                  {currentQ.partTitle}
                </h2>
                <p className="text-xs text-sola-text-secondary mt-0.5">
                  {currentQ.instruction}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-xs font-bold text-sola-navy bg-gray-100 px-2.5 py-1 rounded-md">
                  Question {currentQuestionIndex + 1} of {session.questions.length}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-bold text-sola-navy px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/60">
                  <Clock className="w-3.5 h-3.5 text-sola-orange" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setClock((prev) => ({ ...prev, isPaused: true }))}
                  disabled={isSubmitted}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-gray-200 text-xs font-semibold text-sola-navy hover:bg-gray-50 transition-colors"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </button>
              </div>
            </div>

            {/* Question Body: 2 Columns (Image on Left, Options on Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column (6 cols): Photograph */}
              <div className="md:col-span-6 space-y-3">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 group">
                  {currentQ.imageUrl && (
                    <Image
                      src={currentQ.imageUrl}
                      alt={`TOEIC Part 1 Question ${currentQuestionIndex + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  )}

                  {/* Simulated audio play overlay */}
                  <div className="absolute top-3 left-3 z-10">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm text-sola-navy font-bold text-xs shadow-sm border border-gray-200 flex items-center gap-1.5 hover:bg-white"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-sola-orange animate-bounce' : 'text-gray-600'}`} />
                      <span>{isPlayingAudio ? 'Playing audio...' : 'Play audio'}</span>
                    </button>
                  </div>
                </div>

                {/* Click to enlarge */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setIsEnlarged(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sola-text-secondary hover:text-sola-orange transition-colors px-3 py-1 rounded-lg hover:bg-orange-50"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Click to enlarge</span>
                  </button>
                </div>
              </div>

              {/* Right Column (6 cols): 4 Answer Options */}
              <div className="md:col-span-6 space-y-3">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.key;

                  return (
                    <button
                      type="button"
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      disabled={answersLocked}
                      aria-pressed={isSelected}
                      aria-label={`Option ${opt.key}: ${opt.text}`}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sola-orange ${
                        answersLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                      } ${
                        isSelected
                          ? 'border-sola-orange bg-[#fff9f4] ring-1 ring-sola-orange/20'
                          : 'border-gray-100 hover:border-orange-200/80 bg-white'
                      }`}
                    >
                      {/* Option Circle key (A, B, C, D) */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-sola-orange text-white'
                            : 'bg-gray-100 text-sola-navy'
                        }`}
                      >
                        {opt.key}
                      </div>

                      <p
                        className={`text-xs sm:text-sm font-medium leading-snug ${
                          isSelected ? 'text-sola-navy font-bold' : 'text-sola-navy'
                        }`}
                      >
                        {opt.text}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className="text-xs font-semibold"
                >
                  ← Previous
                </Button>

                <button
                  type="button"
                  onClick={toggleBookmark}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isBookmarked
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'border-gray-200 text-sola-text-secondary hover:bg-gray-50'
                  }`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      isBookmarked
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-gray-400'
                    }`}
                  />
                  <span>Review later</span>
                </button>
              </div>

              <Button
                variant="primary"
                onClick={handleNext}
                className="text-xs sm:text-sm font-bold shadow-sm"
              >
                {currentQuestionIndex === session.questions.length - 1
                  ? 'Submit test →'
                  : 'Next question →'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols): Your Progress, Target Score, Area to focus, Maya's tip */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Your Progress */}
          <Card className="p-5 space-y-4 bg-white border-amber-200/70">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-sola-navy">Your progress</h3>
              <span className="text-xs font-bold text-sola-orange">
                {currentQuestionIndex + 1} / 100 questions
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-sola-orange h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round(((currentQuestionIndex + 1) / 100) * 100)}%`,
                  }}
                />
              </div>
              <div className="text-right text-[11px] font-semibold text-sola-text-secondary">
                {Math.round(((currentQuestionIndex + 1) / 100) * 100)}% complete
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 flex items-center gap-2.5">
                <Headphones className="w-4 h-4 text-sola-orange shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-sola-text-secondary leading-none">
                    Listening
                  </p>
                  <p className="text-xs font-bold text-sola-navy mt-1">
                    {currentQuestionIndex + 1}/50
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-sola-text-secondary leading-none">
                    Reading
                  </p>
                  <p className="text-xs font-bold text-sola-navy mt-1">
                    0/50
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2: Your target score */}
          <Card className="p-5 space-y-3.5 bg-white border-amber-200/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-sola-orange" />
                <h3 className="font-bold text-sm text-sola-navy">Your target score</h3>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-sola-text-secondary hover:text-sola-navy"
              >
                Edit
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-sola-orange shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base font-extrabold text-sola-navy leading-none">
                  TOEIC {session.targetScore}
                </p>
                <p className="text-xs text-sola-text-secondary font-medium mt-1">
                  Current estimated score: <strong className="text-sola-navy">{session.estimatedScore}</strong>
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sola-orange h-full rounded-full"
                style={{
                  width: `${(session.estimatedScore / session.targetScore) * 100}%`,
                }}
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-sola-navy-muted font-medium pt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>You&apos;re on track! Keep practicing consistently to reach your goal.</span>
            </div>
          </Card>

          {/* Card 3: Area to focus */}
          <Card className="p-5 space-y-2.5 bg-white border-amber-200/70">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-sola-navy">Area to focus</h3>
              <span className="text-[11px] font-semibold text-sola-text-secondary">
                Based on your past practice
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-rose-200/80 text-rose-800 flex items-center justify-center text-[10px] font-bold">
                    !
                  </div>
                  <h4 className="text-xs font-bold text-rose-900">
                    {session.focusArea.part}
                  </h4>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <p className="text-xs text-rose-800/80 leading-snug">
                {session.focusArea.description}
              </p>
            </div>
          </Card>

          {/* Card 4: Maya's tip for you */}
          <Card className="p-5 space-y-3 bg-[#fff9f4] border-orange-200/80">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-white shadow-sm bg-amber-100 shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt="Maya AI tutor"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-sola-navy">
                Maya&apos;s tip for you
              </h4>
            </div>

            <p className="text-xs text-sola-navy leading-relaxed font-normal bg-white p-3 rounded-xl border border-orange-100">
              &ldquo;{session.tutorTip}&rdquo;
            </p>
          </Card>
        </div>
      </div>

      {/* 3. Bottom Inspirational Banner Cards (Matching design) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
        {/* Left card (8 cols) */}
        <div className="md:col-span-8 p-5 rounded-2xl bg-gradient-to-r from-[#fefbf6] via-[#fdf7ee] to-[#fcecd7] border border-amber-200/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-sola-navy">
                Keep going, Alex.
              </h4>
              <p className="text-xs text-sola-text-secondary font-medium mt-0.5">
                Every practice question brings you closer to your goal.
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <span className="font-handwriting text-lg font-bold text-amber-900 italic">
              Step by step
            </span>
          </div>
        </div>

        {/* Right card (4 cols) */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-gradient-to-r from-[#fffbf4] to-[#faedd9] border border-amber-200/60 flex items-center justify-between">
          <div>
            <p className="font-handwriting text-base font-bold text-amber-900 italic leading-snug">
              Step by step to a brighter you. ♥
            </p>
          </div>
          <div className="text-[9px] font-extrabold text-amber-800/80 tracking-widest uppercase flex flex-col items-end leading-tight">
            <span>SPEAK</span>
            <span>LEARN</span>
            <span>GROW</span>
            <span>BELONG</span>
          </div>
        </div>
      </div>

      {/* MODAL 1: Image Zoom Modal */}
      {isEnlarged && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-5 max-w-2xl w-full space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-sola-navy">
                Question {currentQuestionIndex + 1} - Image Inspection
              </h4>
              <button
                type="button"
                onClick={() => setIsEnlarged(false)}
                aria-label="Close enlarged image"
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/5">
              {currentQ.imageUrl && (
                <Image
                  src={currentQ.imageUrl}
                  alt="Enlarged question"
                  fill
                  className="object-contain"
                  sizes="800px"
                />
              )}
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="primary"
                onClick={() => setIsEnlarged(false)}
                className="text-xs font-bold"
              >
                Back to Question
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Pause Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl text-center border border-amber-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Pause className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-sola-navy">Test Paused</h4>
              <p className="text-xs text-sola-text-secondary mt-1">
                Your progress and remaining time ({formatTime(timeRemaining)}) are saved.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                onClick={() => setClock((prev) => ({ ...prev, isPaused: false }))}
                className="w-full text-xs font-bold"
              >
                Resume Test
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/exams')}
                className="w-full text-xs text-gray-500 hover:text-rose-600"
              >
                Exit Test to Hub
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Submit Results Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl border border-amber-200 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-sola-orange uppercase tracking-wider">
                {wasExpired ? 'Time expired' : 'Part 1 Complete'}
              </span>
              <h3 className="text-2xl font-extrabold text-sola-navy mt-1">
                {wasExpired ? 'Time is up' : `Great job, ${profile.name.split(' ')[0]}!`}
              </h3>
              <p className="text-xs sm:text-sm text-sola-text-secondary mt-1">
                {wasExpired
                  ? 'Your answers were submitted automatically when the timer reached zero.'
                  : 'You completed the Part 1 Photographs practice simulation.'}
              </p>
            </div>

            {/* Score Ring / Summary */}
            <div className="p-4 rounded-2xl bg-[#fbfbfe] border border-gray-100 space-y-2">
              <div className="text-3xl font-extrabold text-sola-navy">
                {score.correctCount} / {score.totalCount} Correct
              </div>
              <p className="text-xs text-emerald-700 font-semibold">
                Estimated Part 1 Accuracy: {score.percentage}%
              </p>
              {score.unansweredCount > 0 && (
                <p className="text-[11px] text-sola-text-secondary font-medium">
                  {score.unansweredCount} unanswered · counted as incorrect
                </p>
              )}
            </div>

            {/* Explanation review note */}
            <p className="text-xs text-sola-text-secondary italic">
              {currentQ.explanation}
            </p>

            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                onClick={() => router.push('/exams')}
                className="w-full text-xs font-bold"
              >
                Back to IELTS & TOEIC Hub →
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setClock({
                    secondsRemaining: session.timeRemainingSeconds,
                    isPaused: false,
                    isSubmitted: false,
                  });
                  setUserAnswers({});
                  setReviewLater({});
                  setCurrentQuestionIndex(0);
                }}
                className="w-full text-xs"
              >
                Practice Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
