'use client';

import React from 'react';
import {
  BarChart2,
  FileText,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
} from 'lucide-react';
import { Card } from '@/shared/ui/card/Card';
import { ExamRecentResult } from '../types';

interface ExamRecentResultsProps {
  results: ExamRecentResult[];
}

export function ExamRecentResults({ results }: ExamRecentResultsProps) {
  const getIconAndBg = (item: ExamRecentResult) => {
    if (item.scoreType === 'overall') {
      return {
        icon: FileText,
        bg: 'bg-blue-50 text-blue-600 border-blue-100',
      };
    }
    switch (item.category) {
      case 'listening':
        return {
          icon: Headphones,
          bg: 'bg-orange-50 text-sola-orange border-orange-100',
        };
      case 'reading':
        return {
          icon: BookOpen,
          bg: 'bg-blue-50 text-blue-600 border-blue-100',
        };
      case 'writing':
        return {
          icon: PenTool,
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        };
      case 'speaking':
        return {
          icon: Mic,
          bg: 'bg-purple-50 text-purple-600 border-purple-100',
        };
      default:
        return {
          icon: BarChart2,
          bg: 'bg-gray-50 text-gray-600 border-gray-100',
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-sola-orange" />
          <h2 className="text-xl font-bold text-sola-navy tracking-tight">
            Recent results
          </h2>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-sola-text-secondary hover:text-sola-orange transition-colors"
        >
          View all
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {results.map((item) => {
          const { icon: Icon, bg } = getIconAndBg(item);

          return (
            <Card
              key={item.id}
              className="p-4 flex items-center gap-3 bg-white border-gray-100 hover:border-orange-200 transition-colors"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${bg}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-sola-navy truncate leading-tight">
                  {item.title}
                </p>
                <p className="text-[11px] text-sola-text-secondary">
                  {item.date}
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-extrabold text-sola-navy">
                    {item.score}
                  </span>
                  {item.scoreType === 'overall' && (
                    <span className="text-[10px] font-semibold text-sola-text-secondary">
                      Overall
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

