'use client';

import React from 'react';
import Link from 'next/link';
import {
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/shared/ui/card/Card';
import { ExamSectionPractice } from '../types';

interface ExamSectionPracticeGridProps {
  sections: ExamSectionPractice[];
}

export function ExamSectionPracticeGrid({ sections }: ExamSectionPracticeGridProps) {
  const getCategoryTheme = (cat: ExamSectionPractice['category']) => {
    switch (cat) {
      case 'listening':
        return {
          icon: Headphones,
          iconBg: 'bg-orange-100/80 text-sola-orange',
          barColor: 'bg-sola-orange',
        };
      case 'reading':
        return {
          icon: BookOpen,
          iconBg: 'bg-blue-100/80 text-blue-600',
          barColor: 'bg-blue-500',
        };
      case 'writing':
        return {
          icon: PenTool,
          iconBg: 'bg-emerald-100/80 text-emerald-600',
          barColor: 'bg-emerald-500',
        };
      case 'speaking':
        return {
          icon: Mic,
          iconBg: 'bg-purple-100/80 text-purple-600',
          barColor: 'bg-purple-500',
        };
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-bold text-sola-navy tracking-tight">
            Section practice
          </h2>
          <span className="text-xs sm:text-sm text-sola-text-secondary font-medium">
            Build your skills step by step
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((sec) => {
          const theme = getCategoryTheme(sec.category);
          const Icon = theme.icon;

          return (
            <Link key={sec.id} href={sec.href} className="group block h-full">
              <Card className="p-5 h-full flex flex-col justify-between hover:shadow-md transition-all duration-200 border-gray-100 hover:border-orange-200/80 group-hover:-translate-y-0.5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center ${theme.iconBg} shadow-2xs group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-sola-orange group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-sola-navy group-hover:text-sola-orange transition-colors">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-sola-text-secondary line-clamp-2 mt-0.5">
                      {sec.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-1.5">
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${theme.barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${sec.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold text-sola-text-secondary">
                    <span>{sec.progressPercent}% complete</span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

