'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/widgets/app-sidebar/AppSidebar';
import { AppHeader } from '@/widgets/app-header/AppHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Dynamic back label based on active route
  let backLabel = 'Welcome to SOLA';
  let backHref = '/home';

  if (pathname?.includes('/assessment/test')) {
    backLabel = 'Placement Test';
    backHref = '/onboarding';
  } else if (pathname?.includes('/assessment/result')) {
    backLabel = 'Back';
    backHref = '/assessment/test';
  } else if (pathname?.includes('/learn') || pathname?.includes('/session')) {
    backLabel = 'Back to Dashboard';
    backHref = '/home';
  }

  return (
    <div className="flex min-h-screen bg-sola-bg">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader backHref={backHref} backLabel={backLabel} />
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
