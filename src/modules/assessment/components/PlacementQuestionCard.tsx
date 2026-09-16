import React from 'react';
import { PlacementQuestion } from '../types';
import { Badge } from '@/shared/ui/badge/Badge';
import { Button } from '@/shared/ui/button/Button';
import { Flag, HelpCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface PlacementQuestionCardProps {
  question: PlacementQuestion;
  selectedOptionId: string | null;
  onSelectOption: (id: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirstQuestion?: boolean;
  isLastQuestion?: boolean;
}

export function PlacementQuestionCard({
  question,
  selectedOptionId,
  onSelectOption,
  onPrevious,
  onNext,
  isFirstQuestion = false,
  isLastQuestion = false,
}: PlacementQuestionCardProps) {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-sola-border shadow-sola-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sola-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-sola-orange">
              <HelpCircle className="w-4 h-4" />
            </span>
            <span className="text-sm font-bold text-sola-navy">
              Question {question.number} of {question.totalQuestions}
            </span>
          </div>

          <Badge variant="orange" size="md">
            {question.categoryLabel}
          </Badge>
        </div>

        {/* Report button */}
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-sola-navy transition-colors"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Report</span>
        </button>
      </div>

      {/* Question prompt sentence */}
      <div className="py-2">
        <p className="text-base sm:text-xl font-bold text-sola-navy leading-relaxed">
          {question.prompt}
        </p>
      </div>

      {/* Options list A, B, C, D */}
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option.id)}
              className={cn(
                'w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sola-orange',
                isSelected
                  ? 'bg-[#fff9f5] border-sola-orange ring-1 ring-sola-orange shadow-xs'
                  : 'bg-white border-sola-border hover:border-orange-200 hover:bg-[#fffdfb]'
              )}
            >
              {/* Radio Circle */}
              <span
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                  isSelected
                    ? 'border-sola-orange'
                    : 'border-gray-300 group-hover:border-gray-400'
                )}
              >
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-sola-orange" />
                )}
              </span>

              {/* Option Key letter */}
              <span
                className={cn(
                  'text-sm font-bold shrink-0 w-4',
                  isSelected ? 'text-sola-orange' : 'text-sola-text-secondary'
                )}
              >
                {option.key}
              </span>

              {/* Option Text */}
              <span
                className={cn(
                  'text-sm sm:text-base font-semibold transition-colors',
                  isSelected ? 'text-sola-navy' : 'text-sola-navy-muted'
                )}
              >
                {option.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Navigation buttons footer */}
      <div className="pt-4 flex items-center justify-between border-t border-sola-border/60">
        <Button
          variant="secondary"
          size="md"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          iconLeft={<ArrowLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={!selectedOptionId}
          iconRight={<ArrowRight className="w-4 h-4" />}
          className="min-w-[150px]"
        >
          {isLastQuestion ? 'Complete test' : 'Next question'}
        </Button>
      </div>
    </div>
  );
}

