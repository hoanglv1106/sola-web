'use client';

import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';

interface ExamHeroBannerProps {
  title?: string;
  subtitle?: string;
  handwritingText?: string;
}

export function ExamHeroBanner({
  title = 'IELTS & TOEIC Prep',
  subtitle = 'Real practice. Real progress. A brighter you.',
  handwritingText = 'Same effort, A brighter future',
}: ExamHeroBannerProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#fffbf4] via-[#fdf7ee] to-[#faedd9] border border-amber-200/70 p-6 sm:p-8 lg:p-10 shadow-sm">
      {/* Soft background sunrise blobs */}
      <div className="absolute -top-16 -right-12 w-72 h-72 rounded-full bg-orange-300/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-52 h-52 rounded-full bg-amber-200/35 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sola-navy tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-sola-text-secondary font-medium">
            {subtitle}
          </p>
        </div>

        {/* Right side graphic decoration with handwriting quote */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-1.5 font-handwriting text-2xl lg:text-3xl font-bold text-amber-900/90 italic tracking-wide">
              <span>{handwritingText}</span>
              <Heart className="w-5 h-5 text-sola-orange fill-sola-orange inline-block animate-pulse" />
            </div>
          </div>

          {/* Sunrise hiker illustration capsule */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0 bg-amber-100">
            <Image
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
              alt="A brighter future journey"
              fill
              className="object-cover"
              sizes="112px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

