import React from 'react';
import { Heart } from 'lucide-react';

export function MayaTutorBubble() {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-[#fdf9f4] to-[#f8f0e5] border border-amber-200/70 shadow-sola-card space-y-4 relative overflow-hidden">
      {/* Background warm glow */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-orange-200/30 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-base text-sola-navy">
            <span>Maya</span>
            <span>👋</span>
          </div>
          <p className="text-xs font-medium text-sola-text-secondary">
            Your AI English tutor
          </p>
        </div>
      </div>

      {/* Portrait of Maya */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-orange-100 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
          alt="Maya - AI English Tutor"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Speech bubble */}
      <div className="p-4 rounded-xl bg-white/90 backdrop-blur-xs border border-amber-200/60 shadow-xs relative">
        <p className="text-xs sm:text-sm text-sola-navy font-medium leading-relaxed">
          You&apos;re doing great! This short test helps me get to know your English level so I can create the best learning plan for you. Take your time — you can do this! 💪
        </p>
      </div>

      {/* Handwritten quote footer */}
      <div className="text-right pt-1">
        <p className="font-handwriting text-base font-bold text-amber-900 inline-flex items-center gap-1 italic">
          <span>Small steps today, bigger opportunities tomorrow.</span>
          <Heart className="w-3.5 h-3.5 text-sola-orange fill-sola-orange" />
        </p>
      </div>
    </div>
  );
}

