'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/widgets/app-sidebar/AppSidebar';
import { AppHeader } from '@/widgets/app-header/AppHeader';
import { useModalA11y } from '@/shared/hooks/use-drawer-focus';

const MOBILE_DRAWER_ID = 'sola-mobile-navigation';
const DESKTOP_BREAKPOINT = 1024; // Tailwind `lg`

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Accessibility + scroll lock for the drawer: labelled dialog, initial focus,
  // Tab containment, Escape/backdrop close, reversible background isolation, and
  // previous scroll restored on close and on unmount.
  const { dialogRef } = useModalA11y({
    isOpen: mobileMenuOpen,
    onClose: closeMenu,
    triggerRef,
    backgroundRoot: shellRef,
  });

  // The drawer is only valid below the desktop breakpoint; resizing past it must
  // not leave focus trapped or the page scroll locked.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const handleChange = () => {
      if (mediaQuery.matches) setMobileMenuOpen(false);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mobileMenuOpen]);

  // Dynamic back label based on active route
  let backLabel = 'Welcome to SOLA';
  let backHref = '/home';

  if (pathname?.includes('/assessment/test')) {
    backLabel = 'Placement Test';
    backHref = '/onboarding';
  } else if (pathname?.includes('/assessment/result')) {
    backLabel = 'Back';
    backHref = '/assessment/test';
  } else if (pathname?.includes('/vocabulary/review')) {
    backLabel = 'Back to Vocabulary';
    backHref = '/vocabulary';
  } else if (pathname?.includes('/mistakes') && pathname?.includes('/practice')) {
    backLabel = 'Back to Mistakes';
    backHref = '/mistakes';
  } else if (pathname?.includes('/tutor/sessions')) {
    backLabel = 'Back to Chat';
    backHref = '/tutor';
  } else if (pathname?.includes('/exams/ielts/writing')) {
    backLabel = 'Back to Exams';
    backHref = '/exams';
  } else if (pathname?.includes('/exams/toeic/tests')) {
    backLabel = 'Back to Exams';
    backHref = '/exams';
  } else if (
    pathname?.includes('/learn') ||
    pathname?.includes('/session') ||
    pathname?.includes('/practice') ||
    pathname?.includes('/vocabulary') ||
    pathname?.includes('/mistakes') ||
    pathname?.includes('/progress') ||
    pathname?.includes('/tutor') ||
    pathname?.includes('/exams')
  ) {
    backLabel = 'Back to Dashboard';
    backHref = '/home';
  }

  return (
    <div className="flex min-h-screen bg-sola-bg" ref={shellRef}>
      {/* 1. Desktop Sidebar (Desktop >= 1024px) */}
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
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Slide-out drawer */}
          <div className="fixed inset-y-0 left-0 w-64 max-w-[85vw] bg-white shadow-2xl z-10 flex flex-col animate-fade-in">
            <AppSidebar onClose={closeMenu} isMobile />
          </div>
        </div>
      )}

      {/* 3. Main content viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          backHref={backHref}
          backLabel={backLabel}
          onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
          menuControlsId={MOBILE_DRAWER_ID}
          isMenuOpen={mobileMenuOpen}
          menuTriggerRef={triggerRef}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
