'use client';

import React from 'react';
import { Target, BarChart2, TrendingUp, MapPin } from 'lucide-react';
import { Card } from '@/shared/ui/card/Card';
import { ExamScoreSummary } from '../types';

interface ExamScoreCardsProps {
  scoreSummary: ExamScoreSummary;
}

export function ExamScoreCards({ scoreSummary }: ExamScoreCardsProps) {
  const isIelts = scoreSummary.examType === 'ielts';
  const progressPercent = isIelts
    ? Math.min(Math.round((scoreSummary.predictedScore / scoreSummary.targetScore) * 100), 100)
    : Math.min(Math.round((scoreSummary.predictedScore / scoreSummary.targetScore) * 100), 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 1. Target Score Card */}
      <Card className="p-6 space-y-4 border-amber-200/60 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sola-orange font-semibold text-sm">
            <Target className="w-5 h-5" />
            <span>Your target score</span>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-sola-text-secondary hover:text-sola-navy transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
          >
            Edit
          </button>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold text-sola-navy tracking-tight">
            {scoreSummary.targetScore}
          </span>
          <span className="text-sm font-semibold text-sola-text-secondary">
            {scoreSummary.targetScoreLabel}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-orange-100/70 h-3 rounded-full overflow-hidden">
          <div
            className="bg-sola-orange h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </Card>

      {/* 2. Predicted Score Card */}
      <Card className="p-6 space-y-4 border-amber-200/60 bg-white">
        <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm">
          <BarChart2 className="w-5 h-5" />
          <span>Predicted score</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold text-sola-navy tracking-tight">
              {scoreSummary.predictedScore}
            </span>
            <span className="text-sm font-semibold text-sola-text-secondary">
              {scoreSummary.predictedScoreLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-xs font-bold shadow-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{scoreSummary.changeText}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f7f9fc] border border-blue-100/70 text-xs text-sola-navy-muted font-medium">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <span>{scoreSummary.onTrackMessage}</span>
        </div>
      </Card>
    </div>
  );
}

