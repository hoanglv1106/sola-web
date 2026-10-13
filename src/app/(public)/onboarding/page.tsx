'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useModalA11y } from '@/shared/hooks/use-drawer-focus';

const MOBILE_DRAWER_ID = 'sola-onboarding-navigation';

export default function OnboardingPage() {
  const router = useRouter();

  // Local form state as specified in Section 19 of FRONTEND_AGENT_SKILL.md
  const [goal, setGoal] = useState<LearningGoal>('daily_communication');
  const [persona, setPersona] = useState<LearnerPersona>('student');
  const [studyTime, setStudyTime] = useState<DailyStudyTime>('15_minutes');
  const [targetTimeline, setTargetTimeline] = useState<TargetTimeline>('3_months');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  const { dialogRef } = useModalA11y({
    isOpen: mobileMenuOpen,
    onClose: closeMenu,
    triggerRef: menuTriggerRef,
    // Reversible background isolation: siblings of the drawer (header + main)
    // are made inert while the drawer is open and restored verbatim on close.
    backgroundRoot: shellRef,
  });

  // Close the drawer when the viewport reaches the desktop breakpoint.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => {
      if (mediaQuery.matches) setMobileMenuOpen(false);
    };
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mobileMenuOpen]);

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
    <div className="flex min-h-screen bg-sola-bg" ref={shellRef}>
      {/* 1. Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AppSidebar />
      </div>

      {/* 2. Mobile Drawer Navigation (< 1024px) */}
      {mobileMenuOpen && (
        <div
          id={MOBILE_DRAWER_ID}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          tabIndex={-1}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-[85vw] bg-white shadow-2xl z-10 flex flex-col animate-fade-in">
            <AppSidebar onClose={closeMenu} isMobile />
          </div>
        </div>
      )}

      {/* 3. Main viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          backHref="/home"
          backLabel="Welcome to SOLA"
          onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
          menuControlsId={MOBILE_DRAWER_ID}
          isMenuOpen={mobileMenuOpen}
          menuTriggerRef={menuTriggerRef}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
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

