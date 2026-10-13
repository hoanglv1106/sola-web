'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Users, FileText, ChevronRight } from 'lucide-react';

export function AiTutorPanel() {
  const router = useRouter();

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#fdfbf7] via-white to-[#fdf9f4] border border-amber-200/70 shadow-sola-card space-y-5 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Background warm sun glow */}
      <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-orange-200/30 blur-2xl pointer-events-none" />

      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg text-sola-navy">
          <span>Hi, I&apos;m Maya</span>
          <span>👋</span>
        </div>
        <p className="text-xs font-medium text-sola-text-secondary">
          Your AI English tutor
        </p>
      </div>

      {/* Portrait + Speech Bubble */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/11] bg-orange-100 shadow-sm flex items-end">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
          alt="Maya - AI English Tutor"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Floating speech bubble */}
        <div className="relative z-10 m-3 p-3.5 rounded-xl bg-white/95 backdrop-blur-sm border border-amber-200/60 shadow-md">
          <p className="text-xs font-medium text-sola-navy leading-relaxed">
            Let&apos;s practice speaking together! I&apos;ll give you real-time feedback and help you sound more natural.
          </p>
        </div>
      </div>

      {/* Animated Waveform Preview */}
      <div className="flex items-center justify-center gap-1 py-1">
        {[8, 16, 24, 14, 28, 20, 32, 18, 12, 22, 10].map((h, i) => (
          <span
            key={i}
            className="w-1 bg-sola-orange rounded-full animate-pulse"
            style={{
              height: `${h}px`,
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>

      {/* Primary Chat CTA Button */}
      <div>
        <button
          type="button"
          onClick={() => router.push('/tutor')}
          className="w-full py-3 px-4 rounded-xl border border-sola-orange text-sola-orange hover:bg-sola-orange-soft font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-sm group"
        >
          <span>Chat with Maya</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 3 Quick Action pills */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-sola-border/60">
        <button
          type="button"
          onClick={() => router.push('/tutor/sessions/practice')}
          className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl hover:bg-orange-50/80 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sola-orange group-hover:scale-105 transition-transform">
            <Mic className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-sola-navy">Talk</span>
        </button>

        <button
          type="button"
          onClick={() => router.push('/tutor')}
          className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl hover:bg-blue-50/80 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sola-blue group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-sola-navy">Role play</span>
        </button>

        <button
          type="button"
          onClick={() => router.push('/tutor/sessions/meeting-idea/feedback')}
          className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl hover:bg-purple-50/80 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-sola-purple group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-sola-navy">Get feedback</span>
        </button>
      </div>
    </div>
  );
}
