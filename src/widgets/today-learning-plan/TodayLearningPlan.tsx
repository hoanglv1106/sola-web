'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockDailyTasks } from '@/mocks/learning.mock';
import { Button } from '@/shared/ui/button/Button';
import {
  Calendar,
  Clock,
  Mic,
  BookOpen,
  Headphones,
  Zap,
  Play,
  ListTodo,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export function TodayLearningPlan() {
  const router = useRouter();

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'speaking':
        return <Mic className="w-4 h-4 text-sola-orange" />;
      case 'grammar':
        return <BookOpen className="w-4 h-4 text-sola-blue" />;
      case 'listening':
        return <Headphones className="w-4 h-4 text-sola-green" />;
      case 'review':
        return <Zap className="w-4 h-4 text-sola-purple" />;
      default:
        return <BookOpen className="w-4 h-4 text-sola-orange" />;
    }
  };

  const getTaskBg = (type: string) => {
    switch (type) {
      case 'speaking':
        return 'bg-orange-100';
      case 'grammar':
        return 'bg-blue-100';
      case 'listening':
        return 'bg-emerald-100';
      case 'review':
        return 'bg-purple-100';
      default:
        return 'bg-orange-100';
    }
  };

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-white border border-sola-border shadow-sola-card space-y-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-sola-orange">
              <Calendar className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-sola-navy">
              Your learning plan today
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-sola-text-secondary">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>~ 25 minutes</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-sola-text-secondary">
          Based on your progress, we&apos;ve prepared a personalized session for you.
        </p>
      </div>

      {/* Tasks list */}
      <div className="space-y-2.5 flex-1">
        {mockDailyTasks.map((task) => (
          <Link
            key={task.id}
            href={task.href}
            className="flex items-center justify-between p-3.5 rounded-xl border border-sola-border/70 hover:border-orange-200 hover:bg-[#fffdfb] transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                  getTaskBg(task.type)
                )}
              >
                {getTaskIcon(task.type)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-sola-navy group-hover:text-sola-orange transition-colors truncate">
                  {task.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-sola-text-secondary truncate">
                  {task.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pl-2">
              <span className="text-xs font-semibold text-sola-text-secondary">
                {task.durationMin} min
              </span>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-sola-orange transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <Button
          size="md"
          onClick={() => router.push('/session/today')}
          iconLeft={<Play className="w-4 h-4 fill-white" />}
          className="w-full sm:flex-1 shadow-sola-hover"
        >
          Start today&apos;s session →
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={() => router.push('/learn/weekly-plan')}
          iconLeft={<ListTodo className="w-4 h-4 text-sola-navy-muted" />}
          className="w-full sm:w-auto"
        >
          See full plan
        </Button>
      </div>
    </div>
  );
}
