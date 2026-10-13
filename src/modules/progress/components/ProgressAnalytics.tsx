'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart2,
  Calendar,
  Sparkles,
  Trophy,
  Target,
  Mic,
  BookOpen,
  Headphones,
  Zap,
  PenTool,
  Volume2,
  RotateCcw,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import {
  mockSkillTrends,
  mockSkillSummaries,
  mockProgressReviewItems,
  mockAiInsights,
  mockDailyGoalProgress,
} from '@/mocks/progress.mock';
import { Card } from '@/shared/ui/card/Card';
import { computeDailyGoalBasis } from '../model';
import { Button } from '@/shared/ui/button/Button';
import { ProgressRing } from '@/shared/ui/progress/ProgressRing';
import { cn } from '@/shared/lib/cn';

export function ProgressAnalytics() {
  const router = useRouter();
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 4 weeks');

  // Goal dial is derived by the shared progress model (zero-target safe).
  const dailyGoal = computeDailyGoalBasis({
    completedItems: mockDailyGoalProgress.completedItems,
    targetItems: mockDailyGoalProgress.targetItems,
    streakDays: mockDailyGoalProgress.streakDays,
  });

  // SVG Chart Dimensions
  const svgWidth = 560;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const pointsCount = mockSkillTrends.length;
  const getX = (idx: number) => paddingX + (idx / (pointsCount - 1)) * chartWidth;
  const getY = (val: number) => paddingY + (1 - val / 100) * chartHeight;

  // Generate SVG path for a skill
  const getPath = (key: 'speaking' | 'grammar' | 'listening' | 'vocabulary' | 'writing') => {
    return mockSkillTrends
      .map((pt, idx) => {
        const x = getX(idx);
        const y = getY(pt[key]);
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-sola-orange uppercase tracking-wider">
          Thu, Oct 24
        </span>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sola-navy tracking-tight">
            Progress & Review
          </h1>
          <BarChart2 className="w-8 h-8 text-sola-orange" />
        </div>
        <p className="text-xs sm:text-sm text-sola-text-secondary">
          See how far you&apos;ve come, review what matters, and keep moving forward.
        </p>
      </div>

      {/* 2. Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: English Journey Chart + Review for today */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Chart Card */}
          <Card className="p-6 sm:p-7 space-y-6">
            {/* Header + Time range selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-sola-orange shrink-0">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-sola-navy">
                    Your English journey
                  </h2>
                  <p className="text-xs text-sola-text-secondary">
                    You&apos;re making steady progress. Small steps lead to big fluency!
                  </p>
                </div>
              </div>

              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="bg-white border border-sola-border rounded-xl px-3 py-1.5 text-xs font-semibold text-sola-navy focus:outline-none focus:border-sola-orange self-start sm:self-auto cursor-pointer"
              >
                <option value="Last 4 weeks">Last 4 weeks</option>
                <option value="Last 3 months">Last 3 months</option>
                <option value="All time">All time</option>
              </select>
            </div>

            {/* Interactive SVG Chart + Legend Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
              {/* Chart Visual (8 cols) */}
              <div className="xl:col-span-8 overflow-x-auto">
                <div className="min-w-[480px]">
                  <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-auto overflow-visible"
                  >
                    {/* Horizontal grid lines */}
                    {[0, 25, 50, 75, 100].map((val) => {
                      const y = getY(val);
                      return (
                        <g key={val}>
                          <line
                            x1={paddingX}
                            y1={y}
                            x2={svgWidth - paddingX}
                            y2={y}
                            stroke="#f0ede6"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={paddingX - 10}
                            y={y + 3}
                            textAnchor="end"
                            fontSize="10"
                            fill="#9ca3af"
                            fontWeight="500"
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Skill Trend Lines */}
                    {/* Speaking line */}
                    <path
                      d={getPath('speaking')}
                      fill="none"
                      stroke="#ff7139"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Listening line */}
                    <path
                      d={getPath('listening')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Vocabulary line */}
                    <path
                      d={getPath('vocabulary')}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Grammar line */}
                    <path
                      d={getPath('grammar')}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Writing line */}
                    <path
                      d={getPath('writing')}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Points on lines */}
                    {mockSkillTrends.map((pt, idx) => {
                      const x = getX(idx);
                      return (
                        <g key={idx}>
                          <circle cx={x} cy={getY(pt.speaking)} r="4" fill="#ff7139" stroke="#fff" strokeWidth="2" />
                          <circle cx={x} cy={getY(pt.listening)} r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                          <circle cx={x} cy={getY(pt.vocabulary)} r="3.5" fill="#a855f7" stroke="#fff" strokeWidth="1.5" />
                          <circle cx={x} cy={getY(pt.grammar)} r="3.5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                          <circle cx={x} cy={getY(pt.writing)} r="3.5" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />

                          {/* X Axis Date Labels */}
                          <text
                            x={x}
                            y={svgHeight - 2}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#6b7280"
                            fontWeight="600"
                          >
                            {pt.dateLabel}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Legend & Current Scores (4 cols) */}
              <div className="xl:col-span-4 space-y-2.5 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                {mockSkillSummaries.map((skill) => (
                  <div
                    key={skill.key}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: skill.color }}
                      />
                      <div className="flex items-center gap-1 font-bold text-sola-navy">
                        {skill.key === 'speaking' && <Mic className="w-3.5 h-3.5 text-sola-orange" />}
                        {skill.key === 'grammar' && <BookOpen className="w-3.5 h-3.5 text-blue-600" />}
                        {skill.key === 'listening' && <Headphones className="w-3.5 h-3.5 text-emerald-600" />}
                        {skill.key === 'vocabulary' && <Zap className="w-3.5 h-3.5 text-purple-600" />}
                        {skill.key === 'writing' && <PenTool className="w-3.5 h-3.5 text-amber-600" />}
                        <span>{skill.label}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sola-navy">
                        {skill.score}%
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md">
                        +{skill.deltaPct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Trophy Callout inside card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 border border-amber-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-sola-navy">
                    Great progress!
                  </h4>
                  <p className="text-[11px] text-sola-text-secondary">
                    Your speaking and vocabulary have improved the most this month.
                  </p>
                </div>
              </div>

              <div className="font-handwriting text-base font-bold text-amber-950 italic px-3 py-1 rounded-full bg-white/80 border border-amber-200/60 shadow-sm">
                You&apos;re doing amazing! ❤️
              </div>
            </div>
          </Card>

          {/* Review For Today Section */}
          <Card className="p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-sola-orange shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-sola-navy">
                    Review for today
                  </h3>
                  <p className="text-xs text-sola-text-secondary">
                    A personalized mix of words, mistakes, and skills to make your English stronger.
                  </p>
                </div>
              </div>

              <select className="bg-white border border-sola-border rounded-xl px-3 py-1.5 text-xs font-semibold text-sola-navy cursor-pointer">
                <option>24 items</option>
                <option>Pending review</option>
              </select>
            </div>

            {/* 4 Review Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {mockProgressReviewItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-sola-border hover:border-orange-200 bg-white flex flex-col justify-between space-y-3 transition-all hover:shadow-sm"
                >
                  <div className="space-y-2">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center text-xs',
                        item.accentColor === 'blue' && 'bg-blue-100 text-blue-600',
                        item.accentColor === 'rose' && 'bg-red-100 text-red-600',
                        item.accentColor === 'orange' && 'bg-orange-100 text-sola-orange',
                        item.accentColor === 'amber' && 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {item.accentColor === 'blue' && <BookOpen className="w-4 h-4" />}
                      {item.accentColor === 'rose' && <RotateCcw className="w-4 h-4" />}
                      {item.accentColor === 'orange' && <Volume2 className="w-4 h-4" />}
                      {item.accentColor === 'amber' && <Zap className="w-4 h-4" />}
                    </div>

                    <div>
                      <h4 className="font-extrabold text-xs text-sola-navy">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-sola-text-secondary mt-0.5">
                        <span className="font-bold text-sola-navy">{item.itemCount} items</span> • {item.subtitle}
                      </p>
                    </div>

                    {/* Preview chips */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.previewItems.map((p, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] text-sola-navy font-medium"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-[11px] font-bold py-1 text-sola-navy hover:text-sola-orange hover:border-sola-orange"
                    onClick={() => router.push(item.ctaHref)}
                  >
                    {item.ctaLabel}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 4 cols: AI Insights + Daily Goal */}
        <div className="lg:col-span-4 space-y-4">
          {/* AI Insights Card */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sola-orange" />
                <h3 className="font-extrabold text-sm text-sola-navy">
                  AI insights
                </h3>
              </div>
              <button className="text-xs font-semibold text-sola-orange hover:underline cursor-pointer">
                See all
              </button>
            </div>

            <div className="space-y-3">
              {mockAiInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-start gap-3"
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                      insight.bgColor
                    )}
                  >
                    {insight.iconType === 'chat' && <MessageSquare className="w-4 h-4" />}
                    {insight.iconType === 'target' && <Target className="w-4 h-4" />}
                    {insight.iconType === 'leaf' && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-xs text-sola-navy leading-snug">
                      {insight.title}
                    </h4>
                    <p className="text-[11px] text-sola-text-secondary leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Inspirational Landscape Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fdf7ee] via-amber-50 to-[#faedd9] border border-amber-200/50">
            <p className="font-handwriting text-base font-bold text-amber-950 italic text-center">
              Same you, but a brighter English tomorrow. ❤️
            </p>
          </div>

          {/* Today's Goal Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-sola-orange" />
                <h3 className="font-extrabold text-sm text-sola-navy">
                  Today&apos;s goal
                </h3>
              </div>
              <button className="text-xs text-sola-orange font-bold hover:underline cursor-pointer">
                Edit
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <ProgressRing
                  value={dailyGoal.percentage}
                  size={74}
                  strokeWidth={7}
                  color="orange"
                  hideValue
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-extrabold text-sola-navy leading-none">
                    {mockDailyGoalProgress.completedItems}/{mockDailyGoalProgress.targetItems}
                  </span>
                  <span className="text-[9px] text-sola-text-secondary font-medium mt-0.5">
                    items
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-handwriting text-base font-bold text-amber-900 leading-snug italic">
                  A little review today makes a big difference tomorrow. ❤️
                </p>
                <p className="text-[11px] text-sola-text-secondary">
                  {dailyGoal.streakDays}-day streak — complete today&apos;s review to keep it!
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full text-xs font-bold shadow-sola-button"
              onClick={() => router.push('/session/today')}
            >
              ▶ Start review session →
            </Button>
          </Card>
        </div>
      </div>

      {/* 3. Bottom Inspiration Foliage Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="font-bold text-sm text-sola-navy">
            Keep going, Alex.
          </p>
          <p className="text-xs text-sola-text-secondary">
            Review today. Speak with more confidence tomorrow.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-amber-900 tracking-widest uppercase">
          <span>SPEAK</span>
          <span>•</span>
          <span>LEARN</span>
          <span>•</span>
          <span>GROW</span>
          <span>•</span>
          <span>BELONG</span>
        </div>
      </div>
    </div>
  );
}
