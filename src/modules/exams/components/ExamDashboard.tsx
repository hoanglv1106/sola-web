'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Sparkles } from 'lucide-react';
import { ExamHeroBanner } from './ExamHeroBanner';
import { ExamScoreCards } from './ExamScoreCards';
import { ExamSectionPracticeGrid } from './ExamSectionPracticeGrid';
import { ExamMockTestsList } from './ExamMockTestsList';
import { ExamRecentResults } from './ExamRecentResults';
import { ExamRightSidebar } from './ExamRightSidebar';
import {
  mockIeltsScoreSummary,
  mockToeicScoreSummary,
  mockIeltsSections,
  mockToeicSections,
  mockIeltsMockTests,
  mockToeicMockTests,
  mockIeltsRecentResults,
  mockToeicRecentResults,
  mockIeltsRecommendations,
  mockIeltsPrepFocus,
} from '@/mocks/exams.mock';
import { ExamType } from '../types';

export function ExamDashboard() {
  const router = useRouter();
  const [activeExam, setActiveExam] = useState<ExamType>('ielts');

  const scoreSummary =
    activeExam === 'ielts' ? mockIeltsScoreSummary : mockToeicScoreSummary;
  const sections =
    activeExam === 'ielts' ? mockIeltsSections : mockToeicSections;
  const mockTests =
    activeExam === 'ielts' ? mockIeltsMockTests : mockToeicMockTests;
  const recentResults =
    activeExam === 'ielts' ? mockIeltsRecentResults : mockToeicRecentResults;

  const handleStartPractice = () => {
    if (activeExam === 'ielts') {
      router.push('/exams/ielts/writing/task-2-transport');
    } else {
      router.push('/exams/toeic/tests/toeic-part-1');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Hero Banner */}
      <ExamHeroBanner />

      {/* 2. Exam Segment Tabs Switcher (IELTS / TOEIC) */}
      <div className="flex items-center gap-3">
        <div className="inline-flex p-1.5 rounded-2xl bg-gray-100/90 border border-gray-200/60 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveExam('ielts')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeExam === 'ielts'
                ? 'bg-white text-sola-orange border border-orange-200/90 shadow-sm'
                : 'text-sola-navy-muted hover:text-sola-navy'
            }`}
          >
            IELTS
          </button>
          <button
            type="button"
            onClick={() => setActiveExam('toeic')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeExam === 'toeic'
                ? 'bg-white text-sola-orange border border-orange-200/90 shadow-sm'
                : 'text-sola-navy-muted hover:text-sola-navy'
            }`}
          >
            TOEIC
          </button>
        </div>
      </div>

      {/* 3. Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Scores, Skills, Tests, Results */}
        <div className="lg:col-span-8 space-y-6">
          {/* Target & Predicted Scores */}
          <ExamScoreCards scoreSummary={scoreSummary} />

          {/* Section Practice (Listening, Reading, Writing, Speaking) */}
          <ExamSectionPracticeGrid sections={sections} />

          {/* Mock Tests */}
          <ExamMockTestsList mockTests={mockTests} />

          {/* Recent Results */}
          <ExamRecentResults results={recentResults} />

          {/* Bottom Primary CTA Banner */}
          <button
            type="button"
            onClick={handleStartPractice}
            className="w-full relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sola-orange to-[#ff8c42] text-white shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex flex-col sm:flex-row items-center justify-between gap-3 text-left group"
          >
            {/* Background sparkle effect */}
            <div className="absolute top-0 right-0 w-48 h-full bg-white/10 skew-x-12 pointer-events-none group-hover:translate-x-4 transition-transform duration-500" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-extrabold tracking-tight flex items-center gap-1.5">
                  Start today&apos;s exam practice
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <p className="text-xs text-orange-100 font-medium">
                  {activeExam === 'ielts'
                    ? 'Recommended: Writing Task 2 feedback review'
                    : 'Recommended: Part 1 Photographs fast drill'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold shrink-0 relative z-10">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Personalized for your goals</span>
            </div>
          </button>
        </div>

        {/* Right Column (4 cols): AI Coaching, Today's Prep Focus, Recommendations */}
        <div className="lg:col-span-4">
          <ExamRightSidebar
            prepFocus={mockIeltsPrepFocus}
            recommendations={mockIeltsRecommendations}
          />
        </div>
      </div>
    </div>
  );
}

