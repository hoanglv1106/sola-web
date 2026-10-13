'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Bookmark,
  BarChart2,
  Clock,
  Volume2,
  ChevronRight,
  Check,
  Crown,
  Quote,
  Flame,
  Target,
  MoreHorizontal,
} from 'lucide-react';
import { Card } from '@/shared/ui/card/Card';
import { Button } from '@/shared/ui/button/Button';
import { ProgressRing } from '@/shared/ui/progress/ProgressRing';
import { cn } from '@/shared/lib/cn';
import { fetchVocabularyReviewQueue } from '../api/vocabulary-api';
import { useDomainResource } from '@/shared/hooks';
import type { VocabularyMasteryStats, VocabularyWord } from '../types';

/**
 * Dashboard data comes from the typed vocabulary boundary (mock fixture by
 * default) and is copied into local state so review actions can be applied
 * without mutating the shared fixture.
 */
export function VocabularyDashboard() {
  const router = useRouter();
  const resource = useDomainResource(fetchVocabularyReviewQueue, {
    isEmpty: (data) => data.words.length === 0,
  });
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [stats, setStats] = useState<VocabularyMasteryStats | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  // Identity of the payload currently mirrored into local state. Keyed on the
  // loader's monotonic load revision: a `words.length + totalWords` token cannot
  // tell two same-size payloads apart, and an empty payload with totalWords 0
  // collides with the initial token, leaving `stats` null forever.
  const [syncedRevision, setSyncedRevision] = useState(0);

  useEffect(() => {
    if (resource.state !== 'ready' || !resource.data) return;
    if (resource.revision === syncedRevision) return;
    setSyncedRevision(resource.revision);
    setWords(resource.data.words);
    setStats(resource.data.stats);
  }, [resource.state, resource.data, resource.revision, syncedRevision]);

  const handleMarkAsKnown = (id: string) => {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isKnown: !w.isKnown } : w))
    );
  };

  const playAudio = (id: string) => {
    setPlayingAudioId(id);
    setTimeout(() => {
      setPlayingAudioId(null);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Top Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#fffbf4] via-[#fdf7ee] to-[#fcecd7] border border-amber-200/70 p-6 sm:p-8 lg:p-10 shadow-sm">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-orange-300/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-sola-navy tracking-tight">
              Vocabulary
            </h1>
            <p className="text-sm sm:text-base text-sola-text-secondary">
              Build a richer vocabulary for real conversations.
            </p>
            <div className="flex items-center gap-2 pt-1 text-sola-orange">
              <Quote className="w-4 h-4 fill-sola-orange shrink-0" />
              <p className="text-xs sm:text-sm font-medium italic text-sola-orange">
                &ldquo;New words today, a brighter you tomorrow.&rdquo;
              </p>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2.5">
            <div className="font-handwriting text-2xl font-bold text-amber-900 italic tracking-wide">
              Words open a bigger world. ❤️
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-200/70 text-amber-900 border border-amber-300/60 shadow-sm">
                Better
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-200/70 text-orange-900 border border-orange-300/60 shadow-sm">
                Conversations
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300/60 shadow-sm">
                A Brighter You
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top 2 Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Today's review words */}
            <Card className="p-5 flex flex-col justify-between space-y-4 border-amber-200/70 bg-gradient-to-b from-white to-[#fffaf3]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-sola-orange shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-sola-text-secondary block">
                    Today&apos;s review words
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-sola-navy">12</span>
                    <span className="text-xs font-bold text-sola-navy">words</span>
                  </div>
                  <p className="text-[11px] text-sola-text-secondary mt-1">
                    Keep it up! A little review goes a long way.
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs font-bold"
                onClick={() => router.push('/vocabulary/review')}
              >
                Start review →
              </Button>
            </Card>

            {/* Card 2: Saved words */}
            <Card className="p-5 flex flex-col justify-between space-y-4 border-blue-100 bg-gradient-to-b from-white to-sky-50/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-sola-text-secondary block">
                    Saved words
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-sola-navy">36</span>
                    <span className="text-xs font-bold text-sola-navy">words</span>
                  </div>
                  <p className="text-[11px] text-sola-text-secondary mt-1">
                    From your conversations and lessons.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold text-sola-orange border-orange-200 hover:bg-orange-50/60"
                onClick={() => router.push('/vocabulary/review')}
              >
                View saved words →
              </Button>
            </Card>
          </div>

          {/* Vocabulary Mastery Breakdown */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-sola-navy">
                    Your vocabulary mastery
                  </h3>
                  <p className="text-xs text-sola-text-secondary">
                    See how many words you have in each stage.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-sola-navy bg-gray-100 px-3 py-1 rounded-full">
                Total words: {stats?.totalWords ?? 0}
              </span>
            </div>

            {/* 5 Stages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {/* New */}
              <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col items-center text-center space-y-1">
                <span className="text-gray-400 text-base">🌱</span>
                <span className="text-xs font-bold text-sola-navy-muted">New</span>
                <span className="text-xl font-black text-sola-navy">{stats?.newCount ?? 0}</span>
                <span className="text-[10px] text-gray-400">Just learned</span>
              </div>

              {/* Learning */}
              <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 flex flex-col items-center text-center space-y-1">
                <span className="text-sola-orange text-base">🌿</span>
                <span className="text-xs font-bold text-sola-orange">Learning</span>
                <span className="text-xl font-black text-sola-navy">{stats?.learningCount ?? 0}</span>
                <span className="text-[10px] text-orange-600/80">Practicing now</span>
              </div>

              {/* Familiar */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col items-center text-center space-y-1">
                <span className="text-blue-500 text-base">🍃</span>
                <span className="text-xs font-bold text-blue-700">Familiar</span>
                <span className="text-xl font-black text-sola-navy">{stats?.familiarCount ?? 0}</span>
                <span className="text-[10px] text-blue-600/80">Starting to remember</span>
              </div>

              {/* Strong */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col items-center text-center space-y-1">
                <span className="text-emerald-500 text-base">🍀</span>
                <span className="text-xs font-bold text-emerald-700">Strong</span>
                <span className="text-xl font-black text-sola-navy">{stats?.strongCount ?? 0}</span>
                <span className="text-[10px] text-emerald-600/80">Use with confidence</span>
              </div>

              {/* Mastered */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex flex-col items-center text-center space-y-1 col-span-2 sm:col-span-1">
                <Crown className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-700">Mastered</span>
                <span className="text-xl font-black text-sola-navy">{stats?.masteredCount ?? 0}</span>
                <span className="text-[10px] text-purple-600/80">Naturally use it</span>
              </div>
            </div>
          </Card>

          {/* Today's Review Queue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-sola-navy">
                    Today&apos;s review queue
                  </h3>
                  <p className="text-xs text-sola-text-secondary">
                    Review words with spaced repetition to make them stick.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/vocabulary/review')}
                className="text-xs font-bold text-sola-orange hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>See all ({words.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Loading / error / empty states for the data boundary */}
            {resource.state === 'loading' && (
              <div
                role="status"
                aria-live="polite"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="h-40 rounded-2xl bg-gray-100/80 animate-pulse"
                    aria-hidden="true"
                  />
                ))}
                <span className="sr-only">Loading your review queue…</span>
              </div>
            )}

            {resource.state === 'error' && (
              <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200 space-y-3">
                <p className="text-sm font-bold text-red-800">
                  We couldn&apos;t load your review queue.
                </p>
                <p className="text-xs text-red-700">{resource.error}</p>
                <Button variant="outline" size="sm" onClick={resource.reload}>
                  Try again
                </Button>
              </div>
            )}

            {resource.state === 'ready' && words.length === 0 && (
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                <p className="text-sm font-bold text-amber-900">
                  Your review queue is empty
                </p>
                <p className="text-xs text-amber-800">
                  Add words from a lesson or conversation and they will appear here.
                </p>
              </div>
            )}

            {/* Word Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {words.map((item) => {
                const isAudioActive = playingAudioId === item.id;

                return (
                  <Card
                    key={item.id}
                    className={cn(
                      'p-4 flex flex-col justify-between space-y-3 transition-all',
                      item.isKnown
                        ? 'bg-emerald-50/30 border-emerald-200 shadow-sm'
                        : 'hover:border-orange-200 hover:shadow-sm'
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-sola-navy">
                            {item.word}
                          </h4>
                          <button
                            onClick={() => playAudio(item.id)}
                            className={cn(
                              'p-1 rounded-full transition-colors cursor-pointer',
                              isAudioActive
                                ? 'bg-sola-orange text-white'
                                : 'text-sola-orange hover:bg-orange-100'
                            )}
                            title="Listen"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
                        <span>{item.phonetic}</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-sola-navy font-bold text-[9px]">
                          {item.partOfSpeech}
                        </span>
                      </div>

                      <p className="text-xs text-sola-navy leading-snug">
                        {item.definition}
                      </p>

                      <div className="p-2 rounded-xl bg-gray-50/80 border border-gray-100/80 text-[11px] text-sola-navy-muted leading-relaxed">
                        &ldquo;{item.exampleSentence}&rdquo;
                      </div>

                      {/* Collocations */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
                          Collocations
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.collocations.slice(0, 2).map((col, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] text-sola-navy font-medium"
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Professional usage */}
                      {item.professionalUsage && (
                        <div className="pt-0.5 text-[10px] text-sola-text-secondary">
                          <span className="font-bold text-gray-400">Professional usage: </span>
                          <span>{item.professionalUsage}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant={item.isKnown ? 'soft-orange' : 'outline'}
                      size="sm"
                      className={cn(
                        'w-full text-xs font-bold mt-2',
                        item.isKnown
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                          : 'hover:border-sola-orange hover:text-sola-orange'
                      )}
                      onClick={() => handleMarkAsKnown(item.id)}
                    >
                      {item.isKnown ? '✓ Known' : '✓ Mark as known'}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          {/* Maya Coach Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#fdfbf7] via-white to-[#fdf9f4] border border-amber-200/70 shadow-sm space-y-4 relative overflow-hidden">
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
              <div className="font-handwriting text-sm text-amber-900 font-bold italic">
                More words, A brighter you ❤️
              </div>
            </div>

            {/* Portrait + speech bubble */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/11] bg-orange-100 shadow-sm flex items-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                alt="Maya AI English Tutor"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="relative z-10 m-3 p-3 rounded-xl bg-white/95 backdrop-blur-sm border border-amber-200/60 shadow-md">
                <p className="text-xs font-medium text-sola-navy leading-relaxed">
                  Great job exploring new words! A richer vocabulary helps you speak more naturally and express yourself with confidence.
                </p>
              </div>
            </div>
          </div>

          {/* Daily Goal Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-sola-orange" />
                <h3 className="font-extrabold text-sm text-sola-navy">
                  Daily goal
                </h3>
              </div>
              <button className="text-xs text-sola-orange font-bold hover:underline cursor-pointer">
                Edit
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <ProgressRing
                  value={(12 / 20) * 100}
                  size={74}
                  strokeWidth={7}
                  color="orange"
                  hideValue
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-extrabold text-sola-navy leading-none">
                    12/20
                  </span>
                  <span className="text-[9px] text-sola-text-secondary font-medium mt-0.5">
                    words
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-handwriting text-base font-bold text-amber-900 leading-snug italic">
                  Small steps grow a brighter you tomorrow. ❤️
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-sola-orange">
                  <Flame className="w-3.5 h-3.5 fill-sola-orange" />
                  <span>18 days streak</span>
                </div>
              </div>
            </div>

            {/* 7-day dot tracker */}
            <div className="grid grid-cols-7 gap-1 pt-2 border-t border-sola-border/60">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const isPassed = idx <= 3; // Mon-Thu active
                return (
                  <div key={day} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-sola-navy-muted">
                      {day}
                    </span>
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center transition-all',
                        isPassed
                          ? 'bg-sola-orange text-white shadow-sm'
                          : 'border border-gray-200 bg-white text-transparent'
                      )}
                    >
                      {isPassed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Bottom decorative landscape quote card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fcf7ee] via-amber-50 to-[#faedd9] border border-amber-200/50 relative overflow-hidden">
            <p className="font-handwriting text-base font-bold text-amber-950 italic text-center">
              New words, a more confident you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
