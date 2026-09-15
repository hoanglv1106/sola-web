'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Bell } from 'lucide-react';
import { Avatar } from '@/shared/ui/avatar/Avatar';

export interface AppHeaderProps {
  backHref?: string;
  backLabel?: string;
}

export function AppHeader({
  backHref = '/home',
  backLabel = 'Welcome to SOLA',
}: AppHeaderProps) {
  return (
    <header className="h-20 border-b border-sola-border bg-white/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left section: Back navigation */}
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center gap-2 text-sm font-medium text-sola-navy-muted hover:text-sola-navy transition-colors py-1 px-2 rounded-lg hover:bg-gray-100/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold text-sola-navy">{backLabel}</span>
          </Link>
        )}
      </div>

      {/* Right section: Search bar, Notifications, User profile */}
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-[#f8f6f0] border border-transparent focus:border-orange-300 focus:bg-white text-sm text-sola-navy placeholder-gray-400 pl-10 pr-4 py-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-sola-orange/20"
          />
        </div>

        {/* Notification bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2.5 rounded-xl text-gray-500 hover:text-sola-navy hover:bg-gray-100 transition-colors focus:outline-none"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sola-orange" />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-sola-border">
          <Avatar
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
            fallback="A"
            size="md"
            status="online"
          />
          <div className="hidden lg:block text-left">
            <div className="text-sm font-bold text-sola-navy leading-tight">Alex</div>
            <div className="text-[11px] font-medium text-sola-text-secondary leading-tight">
              Keep going!
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
