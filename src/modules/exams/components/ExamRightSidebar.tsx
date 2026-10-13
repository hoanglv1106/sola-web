'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Sun,
  Headphones,
  ChevronRight,
  Sprout,
  Heart,
} from 'lucide-react';
import { Card } from '@/shared/ui/card/Card';
import { ExamAiRecommendation, ExamPrepFocus } from '../types';

interface ExamRightSidebarProps {
  prepFocus: ExamPrepFocus;
  recommendations: ExamAiRecommendation[];
}

export function ExamRightSidebar({
  prepFocus,
  recommendations,
}: ExamRightSidebarProps) {
  return (
    <aside className="space-y-5">
      {/* 1. Motivational Hero Card */}
      <Card className="p-6 relative overflow-hidden bg-gradient-to-b from-[#fff6ed] to-[#fae8d4] border-amber-200/80 shadow-sm">
        <div className="absolute top-2 right-3 font-handwriting text-right text-amber-900/90 font-bold text-sm leading-tight italic">
          <span>Good English</span>
          <br />
          <span>A brighter You</span>
          <Heart className="w-3.5 h-3.5 text-sola-orange fill-sola-orange inline-block ml-1" />
        </div>

        <div className="space-y-2 max-w-[200px]">
          <h3 className="text-lg font-extrabold text-sola-navy leading-snug">
            You&apos;re closer than you think. ✨
          </h3>
          <p className="text-xs text-sola-navy-muted leading-relaxed font-medium">
            Every practice session builds the confident you tomorrow.
          </p>
        </div>

        {/* Student Illustration */}
        <div className="mt-4 relative h-40 w-full rounded-2xl overflow-hidden border border-white/80 shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
            alt="Confident learner"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 360px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 via-transparent to-transparent" />
        </div>
      </Card>

      {/* 2. Today's Prep Focus */}
      <Card className="p-5 space-y-3.5 border-amber-200/70 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-sola-orange" />
            <h3 className="font-bold text-sm text-sola-navy tracking-tight">
              Today&apos;s prep focus
            </h3>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-sola-text-secondary hover:text-sola-orange transition-colors flex items-center gap-0.5"
          >
            <span>Why this?</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <Link
          href={prepFocus.actionHref}
          className="block p-3.5 rounded-2xl bg-[#fff8f2] border border-orange-200/80 hover:border-sola-orange transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-sola-orange shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-sola-navy group-hover:text-sola-orange transition-colors line-clamp-1">
              {prepFocus.title}
            </h4>
          </div>
          <p className="text-xs text-sola-text-secondary leading-relaxed font-normal">
            {prepFocus.description}
          </p>
        </Link>
      </Card>

      {/* 3. AI Recommendations */}
      <Card className="p-5 space-y-3.5 border-amber-200/70 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sola-orange" />
            <h3 className="font-bold text-sm text-sola-navy tracking-tight">
              AI recommendations
            </h3>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        <div className="space-y-2.5">
          {recommendations.map((rec) => {
            const badgeBg =
              rec.colorVariant === 'orange'
                ? 'bg-orange-500 text-white'
                : rec.colorVariant === 'blue'
                ? 'bg-blue-500 text-white'
                : 'bg-emerald-500 text-white';

            return (
              <Link
                key={rec.id}
                href={rec.href || '#'}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/20 transition-all group"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${badgeBg}`}
                  >
                    {rec.number}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-sola-navy group-hover:text-sola-orange transition-colors truncate">
                      {rec.title}
                    </p>
                    <p className="text-[11px] text-sola-text-secondary truncate mt-0.5">
                      {rec.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-sola-orange group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      </Card>

      {/* 4. Bottom Motivation Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fefbf6] to-[#fcf2e3] border border-amber-200/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center shrink-0">
          <Sprout className="w-5 h-5" />
        </div>
        <p className="font-handwriting text-base font-bold text-amber-900/90 italic leading-snug">
          &ldquo;Consistent practice today builds the confident you tomorrow.&rdquo;
        </p>
      </div>
    </aside>
  );
}

