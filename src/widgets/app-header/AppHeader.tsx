'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Bell, Menu, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Avatar } from '@/shared/ui/avatar/Avatar';

export interface AppHeaderProps {
  backHref?: string;
  backLabel?: string;
  onMenuToggle?: () => void;
}

export function AppHeader({
  backHref = '/home',
  backLabel = 'Welcome to SOLA',
  onMenuToggle,
}: AppHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 border-b border-sola-border bg-white/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left section: Hamburger (mobile) & Back navigation */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 -ml-1 sm:-ml-2 rounded-xl text-sola-navy hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sola-orange"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center gap-2 text-sm font-medium text-sola-navy-muted hover:text-sola-navy transition-colors py-1 px-2 rounded-lg hover:bg-gray-100/60"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="font-semibold text-sola-navy truncate max-w-[140px] sm:max-w-none">
              {backLabel}
            </span>
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

        {/* User profile with dropdown menu */}
        <div className="relative pl-2 border-l border-sola-border" ref={menuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-100/70 transition-colors cursor-pointer text-left focus:outline-none"
            aria-expanded={userMenuOpen}
            aria-label="User profile options"
          >
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
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-sola-border shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-sola-border/60">
                <p className="text-sm font-bold text-sola-navy">Alex Johnson</p>
                <p className="text-xs text-sola-text-secondary truncate">alex@example.com</p>
              </div>

              <div className="py-1">
                <Link
                  href="/login"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-sola-navy hover:bg-orange-50 hover:text-sola-orange transition-colors"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>Log in / Switch account</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-sola-navy hover:bg-orange-50 hover:text-sola-orange transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  <span>Create new account</span>
                </Link>
              </div>

              <div className="border-t border-sola-border/60 pt-1">
                <Link
                  href="/login"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Sign out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
