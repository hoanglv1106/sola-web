'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SocialProvider } from '../types';

interface SocialAuthButtonsProps {
  onSocialAuth?: (provider: SocialProvider) => void;
  disabled?: boolean;
}

export function SocialAuthButtons({ onSocialAuth, disabled = false }: SocialAuthButtonsProps) {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);

  const handleProvider = (provider: SocialProvider) => {
    if (disabled || loadingProvider) return;
    setLoadingProvider(provider);
    if (onSocialAuth) {
      onSocialAuth(provider);
    } else {
      // Simulate fast social auth handshake
      setTimeout(() => {
        router.push('/home');
      }, 700);
    }
  };

  return (
    <div className="space-y-2.5 w-full">
      {/* Google Button */}
      <button
        type="button"
        disabled={disabled || !!loadingProvider}
        onClick={() => handleProvider('google')}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-medium transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        {loadingProvider === 'google' ? (
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>Continue with Google</span>
      </button>

      {/* Microsoft Button */}
      <button
        type="button"
        disabled={disabled || !!loadingProvider}
        onClick={() => handleProvider('microsoft')}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-medium transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        {loadingProvider === 'microsoft' ? (
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
        )}
        <span>Continue with Microsoft</span>
      </button>

      {/* Apple Button */}
      <button
        type="button"
        disabled={disabled || !!loadingProvider}
        onClick={() => handleProvider('apple')}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-medium transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        {loadingProvider === 'apple' ? (
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 shrink-0 fill-current text-slate-900" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.5-7.79-11.44-14.14-6.18-9.98-11.05-21.2-14.61-33.64-3.56-12.45-5.34-24.36-5.34-35.73 0-16.14 4.09-29.6 12.27-40.38 8.18-10.77 18.57-16.27 31.18-16.5 4.93 0 10.43 1.25 16.5 3.75 6.07 2.5 10.02 3.8 11.86 3.9 1.55 0 5.62-1.37 12.21-4.12 6.59-2.75 12.27-3.95 17.06-3.6 12.65 1.03 22.95 6.13 30.9 15.3-11.04 6.72-16.43 16.03-16.17 27.93.26 9.4 3.79 17.34 10.59 23.82 6.8 6.48 14.86 10.22 24.18 11.22-2.11 6.5-4.74 13.1-7.9 19.8zM119.22 33.15c0-7.44 2.65-14.43 7.95-20.97 5.3-6.54 11.75-10.79 19.35-12.75.26 1.03.39 2.06.39 3.09 0 7.44-2.8 14.64-8.4 21.6-5.6 6.96-12.24 11.25-19.92 12.87-.26-1.28-.39-2.56-.39-3.84z" />
          </svg>
        )}
        <span>Continue with Apple</span>
      </button>
    </div>
  );
}
