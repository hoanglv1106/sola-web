import React from 'react';
import { cn } from '@/shared/lib/cn';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border border-sola-border bg-white text-sola-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sola-orange/20 focus:border-sola-orange text-sm transition-all',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
