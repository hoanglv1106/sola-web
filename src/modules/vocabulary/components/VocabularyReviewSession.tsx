'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Volume2,
  Check,
  RotateCcw,
  X,
  Link as LinkIcon,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { mockReviewQueueWords } from '@/mocks/vocabulary.mock';
import { Card } from '@/shared/ui/card/Card';
import { Button } from '@/shared/ui/button/Button';
import { ProgressBar } from '@/shared/ui/progress/Progress';
import { cn } from '@/shared/lib/cn';

export function VocabularyReviewSession() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const wordList = mockReviewQueueWords;
  const currentWord = wordList[currentIndex] || wordList[0];
  const progressPercent = Math.round(((currentIndex + 1) / wordList.length) * 100);

  const handleNextWord = () => {
    if (currentIndex < wordList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push('/vocabulary');
    }
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1200);
  };

  const upNextWords = wordList.slice(currentIndex + 1);

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-sola-orange uppercase tracking-wider">
            Practice
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-sola-navy tracking-tight">
            Vocabulary Review Session
          </h1>
          <p className="text-xs sm:text-sm text-sola-text-secondary">
            Review. Remember. Use it in real life.
          </p>
        </div>

        <div className="font-handwriting text-lg sm:text-xl font-bold text-amber-900 italic self-start sm:self-auto">
          New words today, a brighter you tomorrow. ♡
        </div>
      </div>

      {/* 2. Top Progress & Session Controller */}
      <Card className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <span className="text-xs font-bold text-sola-navy whitespace-nowrap">
            {currentIndex + 1} of {wordList.length} words
          </span>
          <div className="w-full sm:w-64">
            <ProgressBar value={progressPercent} className="h-2.5" />
          </div>
          <span className="text-xs font-semibold text-sola-text-secondary whitespace-nowrap">
            {progressPercent}% complete
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="text-xs font-bold text-sola-navy hover:text-red-600 hover:border-red-200 self-end sm:self-auto"
          onClick={() => router.push('/vocabulary')}
        >
          <X className="w-3.5 h-3.5 mr-1" />
          <span>End session</span>
        </Button>
      </Card>

      {/* 3. Main 2-Column Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Main Word Flashcard */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            {/* Badges Row */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-sola-orange border border-orange-200/60">
                <span>🌿</span>
                <span>Learning</span>
              </span>

              <div className="flex items-center gap-2">
                {currentWord.examTag && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60">
                    {currentWord.examTag}
                  </span>
                )}
                {currentWord.topic && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-sola-navy-muted">
                    Topic: {currentWord.topic}
                  </span>
                )}
              </div>
            </div>

            {/* Word & Pronunciation */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sola-navy">
                  {currentWord.word}
                </h2>
                <button
                  onClick={handlePlayAudio}
                  className={cn(
                    'w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer',
                    isPlayingAudio
                      ? 'bg-sola-orange text-white shadow-sola-button scale-105'
                      : 'bg-orange-100 text-sola-orange hover:bg-orange-200/70'
                  )}
                  title="Hear pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-sola-text-secondary font-mono">
                <span>{currentWord.phonetic}</span>
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-sola-navy text-xs font-bold font-sans">
                  {currentWord.partOfSpeech}
                </span>
              </div>

              <p className="text-base text-sola-navy pt-1 font-medium">
                {currentWord.definition}
              </p>
            </div>

            {/* Example sentence block */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sola-navy">
                <MessageSquare className="w-4 h-4 text-sola-orange" />
                <span>Example sentence</span>
              </div>
              <p className="text-sm sm:text-base text-sola-navy leading-relaxed">
                This internship is a great{' '}
                <mark className="bg-orange-200/80 text-sola-navy font-bold px-1.5 py-0.5 rounded-md">
                  {currentWord.highlightedWord}
                </mark>{' '}
                to gain real-world experience.
              </p>
            </div>

            {/* 2-Column Info: Collocations + Similar words */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Collocations */}
              <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-sola-navy">
                  <LinkIcon className="w-3.5 h-3.5 text-sola-orange" />
                  <span>Common collocations</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentWord.collocations.map((c, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-white border border-sola-border text-xs text-sola-navy font-medium shadow-xs"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Similar words */}
              <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-sola-navy">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Similar words</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentWord.similarWords?.map((sw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-white border border-sola-border text-xs text-sola-navy font-medium shadow-xs"
                    >
                      {sw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-sola-border/60">
              {/* Hear audio */}
              <button
                onClick={handlePlayAudio}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-sola-border bg-white text-xs font-bold text-sola-navy hover:bg-orange-50/50 hover:border-orange-200 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-sola-orange" />
                <span>Hear pronunciation</span>
              </button>

              {/* I know this */}
              <button
                onClick={handleNextWord}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-extrabold">
                  <Check className="w-4 h-4" />
                  <span>I know this</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">
                  Show next word
                </span>
              </button>

              {/* Need more practice */}
              <button
                onClick={handleNextWord}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-100/70 text-orange-900 border border-orange-200 hover:bg-orange-200/70 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-sola-orange">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Need more practice</span>
                </div>
                <span className="text-[10px] text-orange-800/80 font-medium">
                  See this word again later
                </span>
              </button>
            </div>
          </Card>
        </div>

        {/* Right 4 cols: Maya Tip + Word Progress Stepper + Up Next */}
        <div className="lg:col-span-4 space-y-4">
          {/* Maya Tip Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#fdfbf7] via-white to-[#fdf9f4] border border-amber-200/70 shadow-xs space-y-3 relative overflow-hidden">
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
                Use new words. Create opportunities. ♡
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

              <div className="relative z-10 m-2.5 p-3 rounded-xl bg-white/95 backdrop-blur-xs border border-amber-200/60 shadow-md">
                <div className="flex items-start gap-1.5">
                  <Lightbulb className="w-4 h-4 text-sola-orange shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium text-sola-navy leading-relaxed">
                    <span className="font-bold">Maya&apos;s tip: </span>
                    &ldquo;Opportunity&rdquo; often goes with action words like find, get, or create. Try using it when you talk about your goals or future plans in a conversation!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Your progress with this word */}
          <Card className="p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-sola-navy">
                Your progress with this word
              </h3>
              <button className="text-[11px] font-semibold text-sola-orange hover:underline cursor-pointer">
                View all
              </button>
            </div>

            {/* 5-step horizontal mastery stepper */}
            <div className="flex items-center justify-between gap-1 pt-1">
              {[
                { label: 'New', icon: '○' },
                { label: 'Learning', icon: '🌿', active: true },
                { label: 'Familiar', icon: '🍃' },
                { label: 'Strong', icon: '🍀' },
                { label: 'Mastered', icon: '👑' },
              ].map((st) => (
                <div key={st.label} className="flex flex-col items-center gap-1 text-center">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all',
                      st.active
                        ? 'bg-sola-orange text-white shadow-xs scale-105'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    <span>{st.icon}</span>
                  </div>
                  <span
                    className={cn(
                      'text-[9px] font-bold',
                      st.active ? 'text-sola-orange' : 'text-gray-400'
                    )}
                  >
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Note box */}
            <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center gap-2 text-[11px] text-orange-950">
              <span className="text-base">🌱</span>
              <p>
                You&apos;ve seen this word <span className="font-bold">2 times</span>. Keep practicing to make it familiar!
              </p>
            </div>
          </Card>

          {/* Up Next Words */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-sola-navy">
                Up next
              </h3>
              <span className="text-[10px] text-sola-text-secondary font-medium">
                {upNextWords.length} more words in this session
              </span>
            </div>

            <div className="space-y-2">
              {upNextWords.slice(0, 4).map((w, idx) => (
                <div
                  key={w.id}
                  className="p-2.5 rounded-xl border border-sola-border flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                      {currentIndex + 2 + idx}
                    </span>
                    <span className="text-xs font-bold text-sola-navy">
                      {w.word}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {w.partOfSpeech}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Bottom Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="font-bold text-sm text-sola-navy">
            You&apos;re doing great, Alex.
          </p>
          <p className="text-xs text-sola-text-secondary">
            Every word you review brings you closer to your goals.
          </p>
        </div>
        <p className="font-handwriting text-xl text-amber-900 font-bold italic">
          Smaller steps, bigger you. ♡
        </p>
      </div>
    </div>
  );
}
