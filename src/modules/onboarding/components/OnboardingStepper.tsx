import React from 'react';
import { cn } from '@/shared/lib/cn';

interface Step {
  number: number;
  label: string;
}

const steps: Step[] = [
  { number: 1, label: 'Your goals' },
  { number: 2, label: 'About you' },
  { number: 3, label: 'Study plan' },
  { number: 4, label: "You're all set!" },
];

export function OnboardingStepper({ currentStep = 1 }: { currentStep?: number }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 py-3 select-none overflow-x-auto">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <React.Fragment key={step.number}>
            {idx > 0 && (
              <div
                className={cn(
                  'h-[1.5px] w-8 sm:w-16 transition-colors',
                  isCompleted ? 'bg-sola-orange' : 'bg-gray-200'
                )}
              />
            )}
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors',
                  isActive
                    ? 'bg-sola-orange text-white shadow-sm'
                    : isCompleted
                    ? 'bg-orange-100 text-sola-orange'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                {step.number}
              </span>
              <span
                className={cn(
                  'text-xs sm:text-sm font-semibold whitespace-nowrap',
                  isActive ? 'text-sola-orange' : isCompleted ? 'text-sola-navy' : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

