'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/cn';
import {
  Home,
  Bot,
  BookOpen,
  Target,
  Trophy,
  TrendingUp,
  BookA,
  FileEdit,
  Users,
  Sun,
  Compass,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isSpecial?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'AI Tutor', href: '/tutor', icon: Bot },
  { label: 'Learn', href: '/learn', icon: BookOpen },
  { label: 'Practice', href: '/practice', icon: Target },
  { label: 'IELTS & TOEIC', href: '/exams', icon: Trophy },
  { label: 'Progress', href: '/progress', icon: TrendingUp },
  { label: 'Vocabulary', href: '/vocabulary', icon: BookA },
  { label: 'Mistakes', href: '/mistakes', icon: FileEdit },
  { label: 'Community', href: '/community', icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isAssessment = pathname?.startsWith('/assessment');

  return (
    <aside className="w-64 bg-white border-r border-sola-border min-h-screen flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-sola-border/60">
          <Link href="/home" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-sola-orange flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sun className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl tracking-tight text-sola-navy">
                  SOLA
                </span>
              </div>
              <p className="text-[11px] font-medium text-sola-text-secondary leading-none">
                Speak a brighter you
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/home' && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sola-orange-soft text-sola-orange font-semibold shadow-xs'
                    : 'text-sola-navy-muted hover:text-sola-navy hover:bg-gray-50/80'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-sola-orange' : 'text-gray-400'
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Special Placement Test nav item if in assessment flow */}
          {isAssessment && (
            <div className="pt-2">
              <Link
                href="/assessment/test"
                className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-sola-orange-soft text-sola-orange border border-orange-200/60 shadow-xs"
              >
                <Compass className="w-5 h-5 text-sola-orange animate-spin" style={{ animationDuration: '10s' }} />
                <span>Placement Test</span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Motivational illustration box at sidebar bottom */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-[#fdf7ee] to-[#faedd9] border border-amber-200/50 relative overflow-hidden">
        {/* Soft sun rays backdrop */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-orange-300/30 blur-xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-amber-700">
            <Sun className="w-4 h-4 text-sola-orange" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Daily Inspiration
            </span>
          </div>
          <p className="font-handwriting text-lg leading-snug text-amber-900 font-semibold italic">
            &ldquo;A little progress every day leads to big changes.&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}
