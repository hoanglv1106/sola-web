'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileEdit,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Target,
  BarChart3,
  Quote,
  Heart,
  Sprout,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Card } from '@/shared/ui/card/Card';
import { Button } from '@/shared/ui/button/Button';
import { mockWritingAttempt } from '@/mocks/exams.mock';
import { RubricCriterion } from '../../types';

export function IeltsWritingFeedbackView() {
  const attempt = mockWritingAttempt;
  const [selectedCorrectionId, setSelectedCorrectionId] = useState<string | null>(
    'corr-1'
  );
  const [activePromptModal, setActivePromptModal] = useState(false);
  const [activeCriterionDetails, setActiveCriterionDetails] =
    useState<RubricCriterion | null>(null);
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [revisedEssay, setRevisedEssay] = useState(
    attempt.paragraphs.map((p) => p.segments.map((s) => s.text).join('')).join('\n\n')
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getCorrectionCategoryStyle = (category?: string) => {
    switch (category) {
      case 'grammar':
        return {
          highlight:
            'bg-rose-100 text-rose-900 border-b-2 border-rose-400 hover:bg-rose-200 cursor-pointer font-medium px-1 rounded-xs transition-colors',
          dot: 'bg-rose-500',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'vocabulary':
        return {
          highlight:
            'bg-amber-100 text-amber-900 border-b-2 border-amber-400 hover:bg-amber-200 cursor-pointer font-medium px-1 rounded-xs transition-colors',
          dot: 'bg-amber-500',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'suggestion':
        return {
          highlight:
            'bg-sky-100 text-sky-900 border-b-2 border-sky-400 hover:bg-sky-200 cursor-pointer font-medium px-1 rounded-xs transition-colors',
          dot: 'bg-sky-500',
          badge: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      default:
        return {
          highlight: '',
          dot: 'bg-gray-400',
          badge: 'bg-gray-50 text-gray-700 border-gray-200',
        };
    }
  };

  const handleCorrectionClick = (id?: string) => {
    if (!id) return;
    setSelectedCorrectionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-sola-text-secondary">
        <Link
          href="/exams"
          className="hover:text-sola-orange transition-colors"
        >
          IELTS & TOEIC
        </Link>
        <span>&gt;</span>
        <span className="text-sola-navy font-bold">IELTS Writing</span>
      </nav>

      {/* 2. Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#fffbf4] via-[#fdf7ee] to-[#faedd9] border border-amber-200/70 p-6 sm:p-8 shadow-xs">
        <div className="absolute -top-16 -right-12 w-64 h-64 rounded-full bg-orange-300/25 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-sola-navy tracking-tight">
              IELTS Writing Feedback
            </h1>
            <p className="text-sm sm:text-base text-sola-text-secondary font-medium">
              Write. Get feedback. Improve faster.
            </p>
            <div className="flex items-center gap-2 pt-1 text-sola-orange">
              <Quote className="w-4 h-4 fill-sola-orange shrink-0" />
              <p className="text-xs sm:text-sm font-semibold italic text-sola-orange">
                &ldquo;Better writing today, a brighter you tomorrow.&rdquo;
              </p>
            </div>
          </div>

          {/* Right side banner badge and artwork */}
          <div className="hidden sm:flex flex-col items-end gap-2">
            <div className="font-handwriting text-2xl font-bold text-amber-900/90 italic flex items-center gap-1.5">
              <span>Your words can open a brighter future.</span>
              <Heart className="w-4 h-4 text-sola-orange fill-sola-orange inline-block" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider text-amber-800/80">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-200/60">WRITE</span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-md bg-orange-200/60">PRACTICE</span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-100">IMPROVE</span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">ACHIEVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main 2-Column Feedback Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Writing Task Prompt, Essay with interactive highlights, Highlighted corrections */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Your writing task */}
          <Card className="p-5 sm:p-6 space-y-3 bg-white border-amber-200/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-sola-orange flex items-center justify-center font-bold">
                  <FileEdit className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-sola-navy">
                  Your writing task
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePromptModal(true)}
                className="text-xs font-semibold text-sola-orange hover:underline flex items-center gap-1"
              >
                <span>View full prompt</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-md bg-orange-50 text-sola-orange text-xs font-bold border border-orange-200/60">
              IELTS Writing Task 2
            </div>

            <p className="text-xs sm:text-sm text-sola-navy font-medium leading-relaxed bg-[#fbfbfe] p-3.5 rounded-xl border border-gray-100">
              {attempt.prompt}
            </p>
          </Card>

          {/* Card 2: Your essay with highlight inspection */}
          <Card className="p-5 sm:p-6 space-y-4 bg-white border-amber-200/70">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-sola-orange font-bold text-sm">
                <FileEdit className="w-4 h-4" />
                <h3 className="text-sola-navy font-bold text-base">Your essay</h3>
              </div>
              <span className="text-xs font-semibold text-sola-text-secondary">
                Word count: <strong className="text-sola-navy">{attempt.wordCount}</strong>
              </span>
            </div>

            {isRevisionMode ? (
              <div className="space-y-4">
                <textarea
                  value={revisedEssay}
                  onChange={(e) => setRevisedEssay(e.target.value)}
                  rows={14}
                  className="w-full p-4 rounded-xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-sola-orange text-sm leading-relaxed text-sola-navy font-sans"
                  placeholder="Revise your essay here using the feedback recommendations..."
                />
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setIsRevisionMode(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setIsSubmitted(true);
                      setIsRevisionMode(false);
                    }}
                    className="text-xs font-bold"
                  >
                    Submit Revision for AI Grading
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs sm:text-sm text-sola-navy leading-relaxed font-normal">
                {attempt.paragraphs.map((para) => (
                  <p key={para.paragraphIndex} className="leading-relaxed">
                    {para.segments.map((seg, idx) => {
                      if (!seg.correctionId) {
                        return <span key={idx}>{seg.text}</span>;
                      }
                      const style = getCorrectionCategoryStyle(seg.category);
                      const isSelected = selectedCorrectionId === seg.correctionId;

                      return (
                        <mark
                          key={idx}
                          onClick={() => handleCorrectionClick(seg.correctionId)}
                          className={`${style.highlight} ${
                            isSelected
                              ? 'ring-2 ring-sola-orange ring-offset-1 font-bold'
                              : ''
                          }`}
                          title="Click to view correction"
                        >
                          {seg.text}
                        </mark>
                      );
                    })}
                  </p>
                ))}
              </div>
            )}

            {isSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Revision submitted! Maya has re-evaluated your essay and updated the feedback below.
                </span>
              </div>
            )}
          </Card>

          {/* Card 3: Highlighted corrections */}
          <Card className="p-5 sm:p-6 space-y-4 bg-white border-amber-200/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-sola-navy">
                Highlighted corrections
              </h3>

              {/* Legend pills */}
              <div className="flex items-center gap-3 text-[11px] font-semibold text-sola-text-secondary flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  Grammar error
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  Better word choice
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                  Other suggestion
                </span>
              </div>
            </div>

            {/* List of corrections */}
            <div className="space-y-3">
              {attempt.corrections.map((corr) => {
                const isSelected = selectedCorrectionId === corr.id;

                return (
                  <div
                    key={corr.id}
                    onClick={() => handleCorrectionClick(corr.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sola-orange bg-orange-50/40 shadow-xs'
                        : 'border-gray-100 hover:border-orange-200/70 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0 text-xs sm:text-sm">
                        <span
                          className={`px-2 py-0.5 rounded-md font-semibold text-xs border ${
                            corr.category === 'grammar'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : corr.category === 'vocabulary'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-sky-50 text-sky-800 border-sky-200'
                          }`}
                        >
                          {corr.originalText}
                        </span>
                        <span className="text-gray-400 font-bold">→</span>
                        <span className="font-bold text-sola-navy">
                          {corr.improvedText}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${
                          isSelected ? 'rotate-90 text-sola-orange' : ''
                        }`}
                      />
                    </div>

                    {isSelected && (
                      <div className="mt-2.5 pt-2.5 border-t border-orange-100 text-xs text-sola-text-secondary leading-relaxed bg-white/70 p-2.5 rounded-lg">
                        <strong className="text-sola-navy font-semibold">Maya&apos;s Explanation: </strong>
                        {corr.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): AI Evaluation, Maya Feedback Speech Bubble, Improvement Plan */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: AI Evaluation 4 Criteria */}
          <Card className="p-5 sm:p-6 space-y-5 bg-white border-amber-200/70">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sola-orange" />
                <h3 className="font-bold text-base text-sola-navy">AI evaluation</h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-sola-orange text-xs font-extrabold">
                <span>Overall band:</span>
                <span className="text-sm">{attempt.overallBand}</span>
              </div>
            </div>

            <div className="space-y-4">
              {attempt.rubric.map((crit) => (
                <div
                  key={crit.id}
                  className="p-3 rounded-2xl bg-[#fafafa] border border-gray-100 hover:border-orange-200 transition-colors flex items-start gap-3.5"
                >
                  {/* Score circle */}
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-orange-400/80 shadow-2xs flex items-center justify-center font-extrabold text-base text-sola-navy shrink-0">
                    {crit.score.toFixed(1)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-sola-navy">
                        {crit.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveCriterionDetails(crit)}
                        className="text-[11px] font-semibold text-sola-text-secondary hover:text-sola-orange transition-colors"
                      >
                        View details &gt;
                      </button>
                    </div>
                    <p className="text-xs text-sola-text-secondary mt-0.5 leading-snug">
                      {crit.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Card 2: Maya Tutor Card */}
          <Card className="p-5 sm:p-6 space-y-4 bg-gradient-to-b from-[#fff7ef] to-[#faedd9] border-amber-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-xs bg-amber-100">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                    alt="Maya AI English Tutor"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-sola-navy">
                    Maya <span className="text-xs">👋</span>
                  </h4>
                  <p className="text-[11px] font-semibold text-sola-text-secondary">
                    Your AI English tutor
                  </p>
                </div>
              </div>

              <div className="font-handwriting text-right text-xs font-bold text-amber-900/90 leading-tight italic">
                <span>You&apos;re doing well!</span>
                <br />
                <span>Keep building your ideas! ♥</span>
              </div>
            </div>

            {/* Speech bubble */}
            <div className="p-4 rounded-2xl bg-white border border-orange-200/60 shadow-2xs text-xs sm:text-sm text-sola-navy leading-relaxed relative">
              <p>&ldquo;{attempt.tutorFeedback.message}&rdquo;</p>
            </div>

            {/* Revise CTA button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsRevisionMode(true)}
                className="w-full py-3 px-4 rounded-xl bg-sola-orange hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 group"
              >
                <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
                <span>Revise and try again →</span>
              </button>
              <p className="text-[11px] text-center text-sola-text-secondary mt-1.5 font-medium">
                Apply the feedback, improve your essay, and see your new band score.
              </p>
            </div>
          </Card>

          {/* Card 3: Your improvement plan */}
          <Card className="p-5 sm:p-6 space-y-4 bg-white border-amber-200/70">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-sola-orange" />
                <h3 className="font-bold text-base text-sola-navy">
                  Your improvement plan
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-sola-orange border border-orange-200 text-xs font-bold">
                Target band: {attempt.targetBand}
              </span>
            </div>

            <div className="space-y-3">
              {attempt.improvementPlan.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-[#fbfbfe]"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5 ${
                      step.stepNumber === 1
                        ? 'bg-sola-orange'
                        : step.stepNumber === 2
                        ? 'bg-blue-500'
                        : 'bg-emerald-500'
                    }`}
                  >
                    {step.stepNumber}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-sola-navy">
                      {step.title}
                    </h5>
                    <p className="text-xs text-sola-text-secondary mt-0.5 leading-snug">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Motivational Bottom Leaf Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fefbf6] to-[#fcf2e3] border border-amber-200/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <p className="font-handwriting text-base font-bold text-amber-900/90 italic leading-snug">
              &ldquo;Practice today for the opportunities tomorrow. ♥&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Prompt Modal */}
      {activePromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-amber-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-sola-navy">
                IELTS Writing Task 2 Prompt
              </h4>
              <button
                type="button"
                onClick={() => setActivePromptModal(false)}
                aria-label="Close prompt modal"
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-sola-navy leading-relaxed bg-[#f8f9fc] p-4 rounded-xl">
              {attempt.prompt}
            </p>
            <div className="text-xs text-sola-text-secondary space-y-1">
              <p>• Recommended time: 40 minutes</p>
              <p>• Minimum word count: 250 words</p>
              <p>• Weight: Counts for 2/3 of your overall IELTS Writing score</p>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                onClick={() => setActivePromptModal(false)}
                className="text-xs font-bold"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Criterion Details Modal */}
      {activeCriterionDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-sola-orange text-white flex items-center justify-center text-xs font-bold">
                  {activeCriterionDetails.score.toFixed(1)}
                </span>
                <h4 className="font-bold text-base text-sola-navy">
                  {activeCriterionDetails.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveCriterionDetails(null)}
                aria-label="Close criterion details"
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-sola-navy leading-relaxed bg-[#fafafa] p-4 rounded-xl border border-gray-100">
              {activeCriterionDetails.summary}
            </p>
            <div className="text-xs text-sola-text-secondary space-y-1.5">
              <p className="font-semibold text-sola-navy">Target Band 7.5 Rubric Tip:</p>
              <p>• Ensure every main idea is extended with concrete examples or real-world cases.</p>
              <p>• Avoid repetitive discourse markers like &quot;On the other hand&quot; and incorporate nuanced transitions.</p>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                onClick={() => setActiveCriterionDetails(null)}
                className="text-xs font-bold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
