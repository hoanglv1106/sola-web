'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/widgets/app-sidebar/AppSidebar';
import { AppHeader } from '@/widgets/app-header/AppHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
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
    <div className="flex min-h-screen bg-sola-bg">
      {/* 1. Desktop Sidebar (Desktop >= 1024px) */}
      <div className="hidden lg:block shrink-0">
        <AppSidebar />
      </div>

      {/* 2. Mobile Drawer Navigation (< 1024px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out drawer */}
          <div className="fixed inset-y-0 left-0 w-64 max-w-[85vw] bg-white shadow-2xl z-10 flex flex-col animate-fade-in">
            <AppSidebar onClose={() => setMobileMenuOpen(false)} isMobile />
          </div>
        </div>
      )}

      {/* 3. Main content viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          backHref={backHref}
          backLabel={backLabel}
          onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
