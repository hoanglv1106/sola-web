'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BarChart2,
  Calendar,
  Users,
  Clock,
  Play,
  Mic,
  MessageSquare,
  Volume2,
  BookOpen,
  Star,
  PenTool,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Plus,
  Check,
  ChevronRight,
  PartyPopper,
  Lightbulb,
} from 'lucide-react';
import { mockSpeakingFeedbackData } from '@/mocks/tutor.mock';
import { Card } from '@/shared/ui/card/Card';
import { Button } from '@/shared/ui/button/Button';
import { ProgressRing } from '@/shared/ui/progress/ProgressRing';
import { cn } from '@/shared/lib/cn';

interface SpeakingFeedbackReportProps {
  sessionId?: string;
}

export function SpeakingFeedbackReport({ sessionId = 'meeting-idea' }: SpeakingFeedbackReportProps) {
  const router = useRouter();
  const feedback = mockSpeakingFeedbackData;

  const [savedVocab, setSavedVocab] = useState<Record<string, boolean>>({});

  const toggleSaveWord = (word: string) => {
    setSavedVocab((prev) => ({
      ...prev,
      [word]: !prev[word],
    }));
  };

  const handleSaveAll = () => {
    const allSaved: Record<string, boolean> = {};
    feedback.newVocabulary.forEach((w) => {
      allSaved[w] = true;
    });
    setSavedVocab(allSaved);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Top Header & Back link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <button
            onClick={() => router.push('/tutor')}
            className="flex items-center gap-1.5 text-xs font-bold text-sola-navy hover:text-sola-orange transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Chat</span>
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sola-navy tracking-tight">
              Your Speaking Session Feedback
            </h1>
            <span className="text-2xl">🎉</span>
          </div>

          <p className="text-xs sm:text-sm text-sola-text-secondary">
            Great conversation! Here&apos;s your personalized feedback.
          </p>
        </div>

        <div className="font-handwriting text-lg sm:text-xl font-bold text-amber-900 italic self-start sm:self-auto">
          Real conversations, Real progress, A brighter you ❤️
        </div>
      </div>

      {/* 2. Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Card 1: Conversation score (4 cols) */}
        <Card className="md:col-span-4 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sola-orange" />
              <h3 className="font-extrabold text-xs text-sola-navy">
                Conversation score
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 bg-orange-100/70 border border-orange-200">
              ↑ +{feedback.scoreDelta} vs. last session
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <ProgressRing
                value={feedback.overallScore}
                size={82}
                strokeWidth={8}
                color="green"
                hideValue
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-sola-navy leading-none">
                  {feedback.overallScore}
                </span>
                <span className="text-[10px] text-sola-text-secondary font-semibold mt-0.5">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-black text-sm text-sola-navy">
                Great job, Alex!
              </h4>
              <p className="text-[11px] text-sola-text-secondary leading-relaxed">
                You spoke naturally, expressed your ideas clearly, and used great vocabulary. Keep practicing to sound even more confident and fluent!
              </p>
            </div>
          </div>
        </Card>

        {/* Card 2: Maya Tutor Note (5 cols) */}
        <Card className="md:col-span-5 p-5 sm:p-6 flex items-start gap-4 border-amber-200/70 bg-gradient-to-r from-[#fdfbf7] to-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
            alt="Maya"
            className="w-14 h-14 rounded-full object-cover border-2 border-amber-300 shadow-2xs shrink-0"
          />

          <div className="space-y-2 flex-1">
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-sola-navy">
                <span>Maya</span>
                <span>👋</span>
              </div>
              <span className="text-[10px] text-sola-text-secondary font-medium">
                Your AI English tutor
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-sola-navy leading-relaxed">
              {feedback.mayaComment}
            </div>
          </div>
        </Card>

        {/* Card 3: Session details (3 cols) */}
        <Card className="md:col-span-3 p-5 flex flex-col justify-between space-y-3 bg-gray-50/40">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-sola-navy font-bold">
              <Calendar className="w-3.5 h-3.5 text-sola-orange" />
              <span>Session details</span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              {feedback.dateStr}
            </p>

            <div className="pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sola-navy">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Conversation topic</span>
              </div>
              <p className="text-[11px] text-sola-text-secondary line-clamp-2">
                {feedback.topic}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1">
              <Clock className="w-3 h-3" />
              <span>Duration: {feedback.durationMin} minutes</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-bold text-sola-orange border-orange-200 hover:bg-orange-50/60"
            onClick={() => router.push(`/tutor/sessions/${sessionId}`)}
          >
            <Play className="w-3 h-3 fill-sola-orange mr-1" />
            <span>Replay conversation</span>
          </Button>
        </Card>
      </div>

      {/* 3. Skill Breakdown Grid */}
      <Card className="p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-sola-navy">
              Skill breakdown
            </h2>
            <p className="text-xs text-sola-text-secondary">
              Here&apos;s how you did in each area.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-1">
          {feedback.skills.map((sk) => (
            <div
              key={sk.key}
              className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 flex flex-col items-center text-center space-y-3 hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-sola-navy">
                {sk.key === 'fluency' && <Mic className="w-4 h-4 text-sola-orange" />}
                {sk.key === 'grammar' && <MessageSquare className="w-4 h-4 text-blue-600" />}
                {sk.key === 'pronunciation' && <Volume2 className="w-4 h-4 text-red-500" />}
                {sk.key === 'vocabulary' && <BookOpen className="w-4 h-4 text-emerald-600" />}
                {sk.key === 'confidence' && <Star className="w-4 h-4 text-purple-600 fill-purple-600" />}
                <span>{sk.label}</span>
              </div>

              <div className="relative">
                <ProgressRing
                  value={sk.score}
                  size={68}
                  strokeWidth={6}
                  color={sk.color}
                  hideValue
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-black text-sola-navy leading-none">
                    {sk.score}
                  </span>
                  <span className="text-[8px] text-gray-400 font-semibold">
                    / 100
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-sola-text-secondary leading-relaxed">
                {sk.comment}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* 4. Bottom Section: Key corrections + Phrasing (8 cols left), Strengths + Next practice (4 cols right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Key corrections + Better Phrasing & Vocab */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Corrections Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-sola-orange" />
                <div>
                  <h3 className="font-extrabold text-sm text-sola-navy">
                    Key corrections
                  </h3>
                  <p className="text-xs text-sola-text-secondary">
                    Small changes make a big difference!
                  </p>
                </div>
              </div>
              <button className="text-xs font-bold text-sola-orange hover:underline flex items-center gap-1 cursor-pointer">
                <span>See all (6)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {feedback.corrections.map((cor) => (
                <div
                  key={cor.id}
                  className="p-3.5 rounded-2xl border border-sola-border bg-gray-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 text-xs text-red-700 flex-1">
                    <XCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span className="font-medium">{cor.userAnswer}</span>
                  </div>

                  <div className="text-gray-400 shrink-0 hidden sm:block">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold flex-1 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{cor.correctAnswer}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Better Phrasing & New Vocabulary Card */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sola-orange" />
                <div>
                  <h3 className="font-extrabold text-sm text-sola-navy">
                    Better phrasing
                  </h3>
                  <p className="text-xs text-sola-text-secondary">
                    Sound more natural and professional.
                  </p>
                </div>
              </div>
              <button className="text-xs font-bold text-sola-orange hover:underline flex items-center gap-1 cursor-pointer">
                <span>See all (5)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {feedback.phrasings.map((ph, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-sola-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <span className="text-sola-text-secondary flex-1 font-medium">
                    {ph.standard}
                  </span>
                  <div className="text-gray-400 shrink-0 hidden sm:block">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-emerald-900 font-bold flex-1 bg-emerald-50/70 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                    {ph.natural}
                  </span>
                </div>
              ))}
            </div>

            {/* New vocabulary from this session */}
            <div className="pt-4 border-t border-sola-border/70 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-extrabold text-sola-navy">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>New vocabulary from this session</span>
                </div>
                <button
                  onClick={handleSaveAll}
                  className="text-xs font-bold text-sola-orange hover:underline cursor-pointer"
                >
                  Save all (5) →
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {feedback.newVocabulary.map((word) => {
                  const isSaved = savedVocab[word];

                  return (
                    <button
                      key={word}
                      onClick={() => toggleSaveWord(word)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer',
                        isSaved
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-white text-sola-navy border-sola-border hover:border-sola-orange hover:text-sola-orange'
                      )}
                    >
                      <span>{word}</span>
                      {isSaved ? <Check className="w-3 h-3 text-emerald-700" /> : <Plus className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Right 4 cols: What you did well + Next recommended practice */}
        <div className="lg:col-span-4 space-y-4">
          {/* What you did well Card */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <PartyPopper className="w-4 h-4 text-sola-orange" />
              <h3 className="font-extrabold text-sm text-sola-navy">
                What you did well
              </h3>
            </div>

            <div className="space-y-3">
              {feedback.strengths.map((str, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-sola-navy">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{str}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Next Recommended Practice Card */}
          <Card className="p-5 sm:p-6 space-y-4 border-amber-200/70 bg-gradient-to-b from-[#fffbf5] to-white">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-sola-orange" />
              <h3 className="font-extrabold text-sm text-sola-navy">
                Next recommended practice
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-sola-border flex items-center justify-between gap-3 hover:border-orange-200 transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Alex"
                className="w-10 h-10 rounded-xl object-cover shrink-0"
              />
              <div className="space-y-0.5 flex-1">
                <h4 className="font-extrabold text-xs text-sola-navy">
                  Role play: Team meeting
                </h4>
                <p className="text-[11px] text-sola-text-secondary leading-snug">
                  Practice more scenarios like this to build confidence.
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full text-xs font-bold shadow-sola-button"
              onClick={() => router.push('/tutor/sessions/meeting-idea')}
            >
              ▶ Start next practice →
            </Button>
          </Card>

          {/* Bottom Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#fdf7ee] via-amber-50 to-[#faedd9] border border-amber-200/50 space-y-1">
            <p className="font-bold text-xs text-sola-navy">
              You&apos;re building real communication skills.
            </p>
            <p className="font-handwriting text-sm font-bold text-amber-950 italic">
              Small steps today lead to bigger opportunities tomorrow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

