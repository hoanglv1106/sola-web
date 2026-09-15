import React from 'react';
import { Sun, Heart, Sparkles, BookOpen } from 'lucide-react';

export function OnboardingDecorativePanel() {
  return (
    <div className="hidden xl:flex flex-col justify-between w-80 shrink-0 p-6 rounded-3xl bg-gradient-to-b from-[#fef8f0] via-[#fcf3e6] to-[#f8ede0] border border-amber-200/60 shadow-sola-card relative overflow-hidden">
      {/* Sunlight glow behind */}
      <div className="absolute top-12 right-6 w-36 h-36 rounded-full bg-orange-300/30 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 left-4 w-44 h-44 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />

      {/* Top quote */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-amber-200/50 text-xs font-bold text-amber-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sola-orange" />
          <span>SOLA Philosophy</span>
        </div>

        <p className="font-handwriting text-2xl font-bold text-amber-950 leading-relaxed italic pl-1">
          &ldquo;A brighter you is a more open tomorrow.&rdquo;
          <Heart className="inline-block w-4 h-4 text-sola-orange fill-sola-orange ml-2" />
        </p>
      </div>

      {/* Center artwork: Stack of study books & window view representation */}
      <div className="relative z-10 my-8 flex flex-col items-center">
        <div className="w-full max-w-[220px] p-5 rounded-2xl bg-white/70 backdrop-blur-xs border border-amber-200/50 shadow-sm flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange mb-1">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded">
              Better English
            </div>
            <div className="text-xs font-bold text-sola-orange">
              A Brighter You
            </div>
          </div>
          <p className="text-[11px] text-amber-800/80 leading-tight pt-1">
            Your journey to natural fluency starts one small habit at a time.
          </p>
        </div>
      </div>

      {/* Bottom sticky note card */}
      <div className="relative z-10 p-4 rounded-2xl bg-white border border-amber-200 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-sola-orange shrink-0">
            <Sun className="w-4 h-4 text-sola-orange" />
          </div>
          <div>
            <p className="text-xs font-semibold text-sola-navy leading-snug">
              Small steps today lead to bigger opportunities tomorrow.
            </p>
            <div className="w-8 h-0.5 bg-sola-orange rounded-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
