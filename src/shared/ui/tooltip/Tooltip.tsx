import React from 'react';
import { cn } from '@/shared/lib/cn';

export type TooltipProps = React.HTMLAttributes<HTMLDivElement>;

export function Tooltip({ className = '', children, ...props }: TooltipProps) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center text-xs text-white bg-sola-navy rounded-lg px-2 py-1 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
