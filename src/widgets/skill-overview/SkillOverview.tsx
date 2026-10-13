'use client';

import React from 'react';
import Link from 'next/link';
import { mockSkillSnapshots } from '@/mocks/learning.mock';
import { ProgressRing } from '@/shared/ui/progress/ProgressRing';
import { Card } from '@/shared/ui/card/Card';
import { TrendingUp, Lightbulb, ChevronRight } from 'lucide-react';

export function SkillOverview() {
  const skills = mockSkillSnapshots;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* 1. Skill Mastery Snapshot (8 cols) */}
      <Card className="lg:col-span-8 p-6 space-y-4 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-sola-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-sola-orange">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base text-sola-navy">Your progress</h3>
          </div>
          <Link
            href="/progress"
            className="text-xs font-semibold text-sola-orange hover:text-sola-orange-hover flex items-center gap-1"
          >
            <span>View details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Circular progress rings */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 py-1">
          {skills.map((s) => (
            <div key={s.skill} className="flex flex-col items-center text-center">
              <ProgressRing
                value={s.percentage}
                size={74}
                strokeWidth={7}
                color={s.color}
                label={s.name}
              />
              <span className="text-[11px] font-bold text-emerald-600 mt-1">
                +{s.changePercent}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. Insight from last session (4 cols) */}
      <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-b from-[#fffcf7] to-[#fcf5eb] border border-amber-200/70 shadow-sola-card flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-700">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-sola-navy">
                Insight from your last session
              </h4>
            </div>

            <Link
              href="/mistakes"
              className="w-7 h-7 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-50 transition-colors shadow-sm"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-bold text-sola-navy">
              You used “I would rather” correctly today! 🎉
            </p>
            <p className="text-xs text-sola-text-secondary leading-relaxed">
              Try to vary your sentence structures more in the next conversation to sound even more natural.
            </p>
          </div>
        </div>

        <div className="text-[11px] font-semibold text-amber-800/80 pt-1">
          Personalized AI Coach tip
        </div>
      </div>
    </div>
  );
}
