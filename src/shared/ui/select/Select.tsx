import React from 'react';
import { cn } from '@/shared/lib/cn';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border border-sola-border bg-white text-sola-navy focus:outline-none focus:ring-2 focus:ring-sola-orange/20 focus:border-sola-orange text-sm transition-all',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
