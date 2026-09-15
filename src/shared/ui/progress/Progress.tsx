import React from 'react';
import { cn } from '@/shared/lib/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  variant?: 'orange' | 'green' | 'blue';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'orange',
  size = 'md',
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    orange: 'bg-sola-orange',
    green: 'bg-sola-green',
    blue: 'bg-sola-blue',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        'w-full bg-[#f3ede6] rounded-full overflow-hidden',
        heights[size],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500 ease-out',
          colors[variant]
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
