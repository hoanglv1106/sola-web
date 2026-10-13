'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockPlacementQuestions } from '@/mocks/assessment.mock';
import { TestProgressBar } from '@/modules/assessment/components/TestProgressBar';
import { PlacementQuestionCard } from '@/modules/assessment/components/PlacementQuestionCard';
import { WhyThisTestMatters } from '@/modules/assessment/components/WhyThisTestMatters';
import { MayaTutorBubble } from '@/modules/assessment/components/MayaTutorBubble';
import { Target, Heart, Sparkles } from 'lucide-react';

export default function PlacementTestPage() {
  const router = useRouter();

  // Start at question index 4 (Question 5) so it matches the screenshot!
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(4);
  const [answers, setAnswers] = useState<Record<string, string>>({
    q5: 'opt5_c', // pre-select C 'arrived' to match mockup!
  });

  const question = mockPlacementQuestions[currentQuestionIndex];
  const selectedOptionId = answers[question.id] || null;

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockPlacementQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed! Route to Results screen
      router.push('/assessment/result');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Hero */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sola-navy tracking-tight">
              Let&apos;s find your starting point
            </h1>
            <Target className="w-7 h-7 text-sola-orange" />
          </div>
          <p className="text-sm sm:text-base text-sola-text-secondary">
            A short test to help us understand your current English level and personalize your learning plan.
          </p>
          <p className="text-xs sm:text-sm text-sola-orange font-medium italic pt-1">
            &ldquo;A few questions today, a brighter learning journey tomorrow.&rdquo;
          </p>
        </div>

        {/* Right header inspirational badge */}
        <div className="hidden md:flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-amber-200/60 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange">
            <Sparkles className="w-5 h-5 text-sola-orange" />
          </div>
          <div>
            <p className="font-handwriting text-base font-bold text-amber-950 italic flex items-center gap-1">
              <span>Know your level. Unlock a brighter you.</span>
              <Heart className="w-3.5 h-3.5 text-sola-orange fill-sola-orange" />
            </p>
            <p className="text-[11px] text-amber-800 font-medium">
              Adaptive placement assessment
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Progress & Question Card (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <TestProgressBar
            currentQuestion={question.number}
            totalQuestions={question.totalQuestions}
            currentSkill={question.category}
          />

          <PlacementQuestionCard
            question={question}
            selectedOptionId={selectedOptionId}
            onSelectOption={handleSelectOption}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isFirstQuestion={currentQuestionIndex === 0}
            isLastQuestion={currentQuestionIndex === mockPlacementQuestions.length - 1}
          />
        </div>

        {/* Right Column: Why test matters & Maya (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <WhyThisTestMatters />
          <MayaTutorBubble />
        </div>
      </div>
    </div>
  );
}
