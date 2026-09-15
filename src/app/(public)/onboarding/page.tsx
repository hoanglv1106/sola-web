'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  OnboardingStepper,
  GoalSelection,
  LearnerProfileStep,
  StudyTimeSelection,
  TargetSelection,
  OnboardingDecorativePanel,
  LearningGoal,
  LearnerPersona,
  DailyStudyTime,
  TargetTimeline,
} from '@/modules/onboarding';
import { Button } from '@/shared/ui/button/Button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AppSidebar } from '@/widgets/app-sidebar/AppSidebar';
import { AppHeader } from '@/widgets/app-header/AppHeader';

export default function OnboardingPage() {
  const router = useRouter();

  // Local form state as specified in Section 19 of FRONTEND_AGENT_SKILL.md
  const [goal, setGoal] = useState<LearningGoal>('daily_communication');
  const [persona, setPersona] = useState<LearnerPersona>('student');
  const [studyTime, setStudyTime] = useState<DailyStudyTime>('15_minutes');
  const [targetTimeline, setTargetTimeline] = useState<TargetTimeline>('3_months');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = () => {
    setIsSubmitting(true);
    // Save onboarding preferences to localStorage for prototype persistence
    try {
      const preferences = { goal, persona, studyTime, targetTimeline };
      localStorage.setItem('sola_onboarding', JSON.stringify(preferences));
    } catch {
      // ignore storage errors
    }

    // Advance to Placement Test
    router.push('/assessment/test');
  };

  return (
    <div className="flex min-h-screen bg-sola-bg">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader backHref="/home" backLabel="Welcome to SOLA" />

        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
          <div className="flex gap-8 items-start">
            {/* Form column */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* Header text */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sola-navy tracking-tight">
                    Let&apos;s build your brighter you
                  </h1>
                  <Sparkles className="w-6 h-6 text-amber-500 animate-pulse-subtle" />
                </div>
                <p className="text-sm sm:text-base text-sola-text-secondary">
                  Tell us a bit about your goals, and we&apos;ll create a personalized learning plan just for you.
                </p>
              </div>

              {/* Stepper */}
              <div className="border-y border-sola-border/70 py-2">
                <OnboardingStepper currentStep={1} />
              </div>

              {/* 4 Interactive Question Sections */}
              <div className="space-y-8">
                <GoalSelection value={goal} onChange={setGoal} />
                <LearnerProfileStep value={persona} onChange={setPersona} />
                <StudyTimeSelection value={studyTime} onChange={setStudyTime} />
                <TargetSelection value={targetTimeline} onChange={setTargetTimeline} />
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 pb-8 flex flex-col sm:flex-row items-center gap-4">
                <Button
                  size="lg"
                  onClick={handleContinue}
                  isLoading={isSubmitting}
                  iconRight={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  Continue
                </Button>

                <button
                  type="button"
                  onClick={() => router.push('/assessment/test')}
                  className="text-xs sm:text-sm text-sola-text-secondary hover:text-sola-navy underline underline-offset-4 transition-colors"
                >
                  I&apos;ll set this up later
                </button>
              </div>
            </div>

            {/* Right decorative panel */}
            <OnboardingDecorativePanel />
          </div>
        </main>
      </div>
    </div>
  );
}
