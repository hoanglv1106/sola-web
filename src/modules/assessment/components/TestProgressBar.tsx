import React from 'react';
import { ProgressBar } from '@/shared/ui/progress/Progress';
import { FileText, PenTool, BookOpen, Headphones, Mic, Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface TestProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  currentSkill: string;
}

export function TestProgressBar({
  currentQuestion = 5,
  totalQuestions = 20,
}: TestProgressBarProps) {
  const percentage = Math.round((currentQuestion / totalQuestions) * 100);

  const skills = [
    {
      id: 'grammar',
      name: 'Grammar',
      questions: '2 questions',
      icon: PenTool,
      status: 'completed', // completed, active, pending
      color: 'text-sola-green',
      bgColor: 'bg-emerald-50',
    },
    {
      id: 'vocabulary',
      name: 'Vocabulary',
      questions: '1 question',
      icon: BookOpen,
      status: 'active',
      color: 'text-sola-blue',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'listening',
      name: 'Listening',
      questions: '1 question',
      icon: Headphones,
      status: 'pending',
      color: 'text-sola-green',
      bgColor: 'bg-emerald-50',
    },
    {
      id: 'speaking',
      name: 'Speaking',
      questions: '1 question',
      icon: Mic,
      status: 'pending',
      color: 'text-sola-purple',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white border border-sola-border shadow-sola-card space-y-5">
      {/* Header with question counter and percentage */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sola-orange font-bold text-sm sm:text-base">
          <FileText className="w-5 h-5 text-sola-orange" />
          <span className="text-sola-navy">Test progress</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-semibold text-sola-text-secondary">
            {currentQuestion} / {totalQuestions} questions
          </span>
          <span className="text-base sm:text-lg font-extrabold text-sola-navy">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Main linear bar */}
      <ProgressBar value={percentage} variant="orange" size="md" />

      {/* 4 skill category mini status cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {skills.map((skill) => {
          const Icon = skill.icon;
          return (
            <div
              key={skill.id}
              className={cn(
                'p-3 sm:p-4 rounded-xl border transition-all flex flex-col justify-between',
                skill.status === 'active'
                  ? 'bg-[#fffbf8] border-sola-orange/50 shadow-xs'
                  : 'bg-white border-sola-border/80'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn('p-1.5 rounded-lg', skill.bgColor, skill.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-sola-navy">
                    {skill.name}
                  </span>
                </div>

                {/* Status indicator badge / dot */}
                {skill.status === 'completed' && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-sola-green text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                {skill.status === 'active' && (
                  <span className="w-4 h-4 rounded-full border-2 border-sola-orange flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-sola-orange" />
                  </span>
                )}
                {skill.status === 'pending' && (
                  <span className="w-4 h-4 rounded-full border-2 border-gray-200" />
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-sola-text-secondary">
                <span>{skill.questions}</span>
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    skill.status === 'completed' && 'bg-sola-green',
                    skill.status === 'active' && 'bg-sola-orange',
                    skill.status === 'pending' && 'bg-gray-300'
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
