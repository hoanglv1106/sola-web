'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { SocialAuthButtons } from './SocialAuthButtons';
import { writeMockSession } from '@/modules/learner';

/**
 * Derive a display name for the demo session from the entered email.
 * Purely cosmetic: this is a mock login, not real authentication.
 */
function getDemoDisplayName(email: string): string {
  const localPart = email.trim().split('@')[0] ?? '';
  if (!localPart) return 'SOLA Learner';
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Honest copy for the demo password-recovery control.
 *
 * SOLA has no email backend, so this must never claim a message was sent. It
 * states the limitation plainly and keeps the label truthful.
 */
function buildRecoveryNotice(email: string): string {
  const target = email.trim();
  return target
    ? `Demo build: password recovery is not wired up yet, so no reset link can be sent to ${target}.`
    : 'Demo build: password recovery is not wired up yet, so no reset link can be sent. Enter your email to see it echoed here.';
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoveryNotice, setRecoveryNotice] = useState<string | null>(null);

  const handleDemoFill = () => {
    setEmail('alex@example.com');
    setPassword('AlexPass123!');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email or username');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      // Mock login: only the display profile is persisted, never the password.
      writeMockSession({
        name: getDemoDisplayName(email),
        email: email.trim(),
      });
      if (rememberMe) {
        try {
          localStorage.setItem('sola_remember_email', email);
        } catch {
          // Remember-me is a convenience only; blocked storage must not fail login.
        }
      }
      setIsLoading(false);
      router.push('/home');
    }, 500);
  };

  return (
    <div className="w-full sm:w-[460px] bg-white/95 backdrop-blur-md rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.22)] border border-white/80 transition-all">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <button
          type="button"
          onClick={handleDemoFill}
          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer"
          title="Auto-fill demo credentials"
        >
          Quick fill Alex
        </button>
        <div>
          <span className="text-slate-500">New to SOLA? </span>
          <Link
            href="/register"
            className="text-[#fa5b2d] font-semibold hover:text-[#e04f24] hover:underline transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>

      <div className="mt-5 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111938] tracking-tight flex items-center gap-2">
          <span>Welcome back</span>
          <span>👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Log in to continue your English learning journey. Let&apos;s make today brighter than yesterday.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}
      {recoveryNotice && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium"
        >
          {recoveryNotice}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
          >
            Email or username
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="login-email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setRecoveryNotice(null);
              }}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#fa5b2d] focus:ring-2 focus:ring-[#fa5b2d]/20 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#fa5b2d] focus:ring-2 focus:ring-[#fa5b2d]/20 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 accent-[#fa5b2d] focus:ring-[#fa5b2d]/30"
            />
            <span className="text-xs sm:text-sm text-slate-600 font-normal">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => setRecoveryNotice(buildRecoveryNotice(email))}
            className="text-xs sm:text-sm text-[#fa5b2d] hover:text-[#e04f24] font-medium hover:underline cursor-pointer transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sola-orange"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 sm:py-3.5 px-6 rounded-xl bg-[#fa5b2d] hover:bg-[#eb4f22] active:scale-[0.99] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(250,91,45,0.32)] transition-all cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>Log in</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      <div className="relative flex items-center justify-center my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-xs text-slate-500 font-normal">
          or continue with
        </span>
      </div>

      <SocialAuthButtons disabled={isLoading} />

      <div className="mt-6 text-center text-[11px] sm:text-xs text-slate-500 leading-relaxed">
        By logging in, you agree to our{' '}
        <Link href="/terms" className="text-[#fa5b2d] hover:underline font-medium">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-[#fa5b2d] hover:underline font-medium">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
