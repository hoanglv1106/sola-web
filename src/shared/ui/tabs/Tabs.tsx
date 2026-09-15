import React from 'react';
import { cn } from '@/shared/lib/cn';

export type TabsProps = React.HTMLAttributes<HTMLDivElement>;

export function Tabs({ className = '', children, ...props }: TabsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-sola-border/60',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
