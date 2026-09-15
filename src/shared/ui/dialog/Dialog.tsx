import React from 'react';
import { cn } from '@/shared/lib/cn';

export type DialogProps = React.HTMLAttributes<HTMLDivElement>;

export function Dialog({ className = '', children, ...props }: DialogProps) {
  return (
    <div className={cn('relative z-50', className)} {...props}>
      {children}
    </div>
  );
}
