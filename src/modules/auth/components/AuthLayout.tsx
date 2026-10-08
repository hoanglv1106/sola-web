'use client';

import React from 'react';
import Image from 'next/image';
import { SolaBrandLogo } from './SolaBrandLogo';

interface AuthLayoutProps {
  variant: 'login' | 'register';
  children: React.ReactNode;
}

export function AuthLayout({ variant, children }: AuthLayoutProps) {
  const isLogin = variant === 'login';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden selection:bg-orange-500 selection:text-white">
      {/* Background Image: Scenic Sunrise Mountain Vista */}
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none select-none">
        <Image
          src="/images/auth-bg.png"
          alt="Scenic Mountain Sunrise"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-[left_center]"
        />
        {/* Subtle contrast wash for readability on smaller viewports */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20 lg:bg-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="w-full flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 max-w-[1720px] mx-auto">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between w-full">
          <SolaBrandLogo size="md" />
        </header>

        {/* Central Section: Left Philosophy / Right Floating Card */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 my-6 sm:my-10">
          {/* Left Hero Quote & Brand Philosophy (Visible prominently on desktop / tablet) */}
          <div className="w-full lg:max-w-md xl:max-w-lg flex flex-col justify-center space-y-6 select-none pl-1 lg:pl-4">
            {/* Handwriting script quote */}
            <div className="space-y-3">
              {isLogin ? (
                <div className="font-handwriting text-5xl sm:text-6xl xl:text-7xl font-bold text-[#893f18] leading-[1.08] tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                  <div>A brighter</div>
                  <div>you is closer</div>
                  <div className="flex items-center gap-2">
                    <span>than you think.</span>
                    <span className="text-3xl sm:text-4xl inline-block -rotate-6">🧡</span>
                  </div>
                </div>
              ) : (
                <div className="font-handwriting text-5xl sm:text-6xl xl:text-7xl font-bold text-[#893f18] leading-[1.08] tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                  <div>A brighter</div>
                  <div>you starts</div>
                  <div className="flex items-center gap-2">
                    <span>here.</span>
                    <span className="text-3xl sm:text-4xl inline-block -rotate-6">🧡</span>
                  </div>
                </div>
              )}

              {/* Sub-quote */}
              <div className="text-slate-800 font-medium text-base sm:text-lg leading-relaxed pt-2 max-w-sm drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                {isLogin ? (
                  <>
                    <p>Small steps today</p>
                    <p>lead to bigger</p>
                    <p>opportunities tomorrow.</p>
                  </>
                ) : (
                  <>
                    <p>Learn. Practice. Grow.</p>
                    <p>A brighter tomorrow is yours.</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Card Container */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end shrink-0">
            {children}
          </div>
        </main>

        {/* Bottom Bar: Stacked Brand Values */}
        <footer className="w-full flex items-end justify-between pt-4">
          <div className="border-l-2 border-slate-800/80 pl-3.5 space-y-1 select-none">
            <div className="text-[11px] sm:text-xs font-black tracking-[0.25em] text-slate-800">
              SPEAK
            </div>
            <div className="text-[11px] sm:text-xs font-black tracking-[0.25em] text-slate-800">
              LEARN
            </div>
            <div className="text-[11px] sm:text-xs font-black tracking-[0.25em] text-slate-800">
              GROW
            </div>
            <div className="text-[11px] sm:text-xs font-black tracking-[0.25em] text-slate-800">
              BELONG
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
