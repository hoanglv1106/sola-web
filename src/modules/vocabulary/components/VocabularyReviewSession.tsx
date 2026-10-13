'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import { Card } from '@/shared/ui/card/Card';
import { Button } from '@/shared/ui/button/Button';
import { ProgressBar } from '@/shared/ui/progress/Progress';
import { cn } from '@/shared/lib/cn';
import {
  applyQueueOutcome,
  buildExampleSentenceView,
  calculateMasteryPercentage,
  createReviewQueue,
  getReviewQueueProgress,
  splitOnHighlight,
  VOCABULARY_STAGE_RANK,
  type ReviewOutcome,
  type ReviewQueue,
} from '../model';
import type { VocabularyStage } from '../types';
import { useVocabularyProgress } from '../hooks/use-vocabulary-progress';
import { fetchVocabularyReviewQueue } from '../api/vocabulary-api';
import { useDomainResource } from '@/shared/hooks';

const MASTERY_STEPS = [
  { label: 'New', icon: '○' },
  { label: 'Learning', icon: '🌿' },
  { label: 'Familiar', icon: '🍃' },
  { label: 'Strong', icon: '🍀' },
  { label: 'Mastered', icon: '👑' },
];

export function VocabularyReviewSession() {
  const router = useRouter();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Words/queue/content come from the typed, replaceable data boundary. In
  // fixture mode this resolves to the local mock; with
  // NEXT_PUBLIC_USE_MOCK_DATA=false the same call goes over real HTTP.
  const resource = useDomainResource(fetchVocabularyReviewQueue, {
    isEmpty: (data) => data.words.length === 0,
  });

  const wordList = useMemo(() => resource.data?.words ?? [], [resource.data]);
  const [queue, setQueue] = useState<ReviewQueue | null>(null);
  const [syncedRevision, setSyncedRevision] = useState(0);

  // Build the session queue once per loaded payload, before any per-word
  // progress overlay is applied.
  useEffect(() => {
    if (resource.state !== 'ready' || !resource.data) return;
    if (resource.revision === syncedRevision) return;
    setSyncedRevision(resource.revision);
    setQueue(createReviewQueue(resource.data.words));
  }, [resource.state, resource.data, resource.revision, syncedRevision]);

  // Recorded progress from previous sessions, re-applied on top of the fresh
  // fixture so leaving and re-entering (or reloading) keeps the learner's stage.
  const vocabularyProgress = useVocabularyProgress();

  useEffect(() => {
    if (vocabularyProgress.isHydrating) return;
    setQueue((current) => {
      if (!current) return current;
      let next = current;
      let changed = false;

      for (const word of wordList) {
        const recorded = vocabularyProgress.getProgress(word.id);
        if (!recorded) continue;
        const existing = next.states[word.id];
        if (!existing) continue;
        if (existing.stage === recorded.stage && existing.timesSeen === recorded.timesSeen) {
          continue;
        }
        next = {
          ...next,
          states: {
            ...next.states,
            [word.id]: {
              ...existing,
              stage: recorded.stage as VocabularyStage,
              timesSeen: recorded.timesSeen,
            },
          },
        };
        changed = true;
      }

      return changed ? next : current;
    });
    // Re-apply when the hydrated store or the loaded word list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocabularyProgress.isHydrating, vocabularyProgress.words, wordList]);

  const currentWordId = queue?.order[0];
  const currentWord = currentWordId
    ? wordList.find((word) => word.id === currentWordId)
    : undefined;

  // Progress uses the session's ORIGINAL total as a stable denominator, with
  // completion counted over distinct words — so a re-queued retry never shrinks
  // the denominator or pushes the numerator past the total.
  const progress = queue
    ? getReviewQueueProgress(queue)
    : { completedWords: 0, totalWords: wordList.length, progressPercent: 0, pendingWords: wordList.length, isComplete: false };
  const reviewedCount = progress.completedWords;
  const progressPercent = progress.progressPercent;

  const wordState = queue && currentWordId ? queue.states[currentWordId] : undefined;
  const masteryPercent = wordState
    ? calculateMasteryPercentage(wordState.stage)
    : calculateMasteryPercentage('new');
  const stageIndex = wordState
    ? VOCABULARY_STAGE_RANK.indexOf(wordState.stage)
    : 0;

  const example = currentWord ? buildExampleSentenceView(currentWord) : null;
  const exampleSegments = example ? splitOnHighlight(example.sentence, example.focus ?? '') : [];

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1200);
  };

  /**
   * Both actions advance the queue, but with different semantics:
   * `known` promotes a mastery stage and retires the word for this session,
   * `needs_practice` demotes the stage and re-queues the word for another pass.
   */
  const handleOutcome = (outcome: ReviewOutcome) => {
    if (!queue) return;
    const reviewedId = queue.order[0];
    const result = applyQueueOutcome(queue, outcome);

    // Persist the reviewed word's resulting stage so it survives navigation
    // and a full reload. Only the delta is stored; content stays server-owned.
    if (reviewedId) {
      const nextState = result.queue.states[reviewedId];
      const previousState = queue.states[reviewedId];
      if (nextState && nextState !== previousState) {
        vocabularyProgress.recordProgress({
          wordId: reviewedId,
          stage: nextState.stage,
          timesSeen: nextState.timesSeen,
          lastOutcome: outcome,
        });
      }
    }

    if (result.completed) {
      router.push('/vocabulary');
      return;
    }

    setQueue(result.queue);
  };

  if (resource.state === 'loading') {
    return (
      <div className="space-y-6 pb-16">
        <Card className="p-6 sm:p-8 space-y-3 max-w-2xl" role="status" aria-live="polite">
          <h1 className="text-lg font-extrabold text-sola-navy">Loading review queue…</h1>
          <p className="text-xs sm:text-sm text-sola-text-secondary">
            Fetching today&apos;s words.
          </p>
        </Card>
      </div>
    );
  }

  if (resource.state === 'error') {
    return (
      <div className="space-y-6 pb-16">
        <Card className="p-6 sm:p-8 space-y-3 max-w-2xl" role="alert">
          <h1 className="text-lg font-extrabold text-sola-navy">
            We couldn&apos;t load your review queue
          </h1>
          <p className="text-xs sm:text-sm text-sola-text-secondary">
            {resource.error}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="md" onClick={resource.reload}>
              Try again
            </Button>
            <Button variant="secondary" size="md" onClick={() => router.push('/vocabulary')}>
              Back to Vocabulary
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (resource.isEmpty || !queue || !currentWord || !example) {
    return (
      <div className="space-y-6 pb-16">
        <Card className="p-6 sm:p-8 space-y-3 max-w-2xl">
          <h1 className="text-lg font-extrabold text-sola-navy">
            Review session complete
          </h1>
          <p className="text-xs sm:text-sm text-sola-text-secondary">
            There are no words left in today&apos;s review queue.
          </p>
          <Button variant="primary" size="md" onClick={() => router.push('/vocabulary')}>
            Back to Vocabulary
          </Button>
        </Card>
      </div>
    );
  }

  const upNextWords = queue.order
    .slice(1)
    .map((id) => wordList.find((word) => word.id === id))
    .filter((word): word is (typeof wordList)[number] => Boolean(word));

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
            {reviewedCount} of {progress.totalWords} words
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
                  type="button"
                  onClick={handlePlayAudio}
                  aria-label={`Hear pronunciation of ${currentWord.word}`}
                  className={cn(
                    'w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-sola-orange focus-visible:ring-offset-2',
                    isPlayingAudio
                      ? 'bg-sola-orange text-white shadow-sola-button scale-105'
                      : 'bg-orange-100 text-sola-orange hover:bg-orange-200/70'
                  )}
                  title="Hear pronunciation"
                >
                  <Volume2 className="w-5 h-5" aria-hidden="true" />
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

            {/* Example sentence block: rendered from this word's own fixture data */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sola-navy">
                <MessageSquare className="w-4 h-4 text-sola-orange" />
                <span>Example sentence</span>
              </div>
              <p className="text-sm sm:text-base text-sola-navy leading-relaxed">
                {exampleSegments.map((segment, index) =>
                  segment.highlighted ? (
                    <mark
                      key={`hl-${index}`}
                      className="bg-orange-200/80 text-sola-navy font-bold px-1.5 py-0.5 rounded-md"
                    >
                      {segment.text}
                    </mark>
                  ) : (
                    <React.Fragment key={`tx-${index}`}>{segment.text}</React.Fragment>
                  )
                )}
              </p>
              {example.highlightMissing && (
                <p className="text-[11px] text-amber-800 font-medium">
                  Highlight fixture does not match this example sentence.
                </p>
              )}
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
                      className="px-2.5 py-1 rounded-xl bg-white border border-sola-border text-xs text-sola-navy font-medium shadow-sm"
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
                      className="px-2.5 py-1 rounded-xl bg-white border border-sola-border text-xs text-sola-navy font-medium shadow-sm"
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
                onClick={() => handleOutcome('known')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-xs font-extrabold">
                  <Check className="w-4 h-4" />
                  <span>I know this</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">
                  Move up a mastery stage
                </span>
              </button>

              {/* Need more practice */}
              <button
                onClick={() => handleOutcome('needs_practice')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-100/70 text-orange-900 border border-orange-200 hover:bg-orange-200/70 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-sola-orange">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Need more practice</span>
                </div>
                <span className="text-[10px] text-orange-800/80 font-medium">
                  Re-queue this word later
                </span>
              </button>
            </div>
          </Card>
        </div>

        {/* Right 4 cols: Maya Tip + Word Progress Stepper + Up Next */}
        <div className="lg:col-span-4 space-y-4">
          {/* Maya Tip Card */}
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

              <div className="relative z-10 m-2.5 p-3 rounded-xl bg-white/95 backdrop-blur-sm border border-amber-200/60 shadow-md">
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

            {/* 5-step horizontal mastery stepper, driven by this word's stage */}
            <div
              className="flex items-center justify-between gap-1 pt-1"
              role="list"
              aria-label={`Mastery stage: ${wordState?.stage ?? 'new'}`}
            >
              {MASTERY_STEPS.map((st, index) => {
                const isReached = index <= stageIndex;
                const isCurrent = index === stageIndex;

                return (
                  <div
                    role="listitem"
                    key={st.label}
                    className="flex flex-col items-center gap-1 text-center"
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all',
                        isCurrent
                          ? 'bg-sola-orange text-white shadow-sm scale-105'
                          : isReached
                            ? 'bg-orange-100 text-sola-orange'
                            : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      <span>{st.icon}</span>
                    </div>
                    <span
                      className={cn(
                        'text-[9px] font-bold',
                        isReached ? 'text-sola-orange' : 'text-gray-400'
                      )}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Note box */}
            <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center gap-2 text-[11px] text-orange-950">
              <span className="text-base">🌱</span>
              <p>
                You&apos;ve seen this word{' '}
                <span className="font-bold">{wordState?.timesSeen ?? 0} times</span>. Mastery:{' '}
                <span className="font-bold">{masteryPercent}%</span>. Keep practicing to make it
                familiar!
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
                      {reviewedCount + 2 + idx}
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
