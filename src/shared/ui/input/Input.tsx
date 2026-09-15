import React from 'react';
import { cn } from '@/shared/lib/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border border-sola-border bg-white text-sola-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sola-orange/20 focus:border-sola-orange text-sm transition-all',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
