import React from 'react';
import { cn } from '@/shared/lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'orange' | 'green' | 'blue' | 'purple' | 'red' | 'gray' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'orange',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    orange: 'bg-sola-orange-soft text-sola-orange border border-orange-200/60',
    green: 'bg-sola-green-soft text-sola-green border border-green-200/60',
    blue: 'bg-sola-blue-soft text-sola-blue border border-blue-200/60',
    purple: 'bg-sola-purple-soft text-sola-purple border border-purple-200/60',
    red: 'bg-sola-red-soft text-sola-red border border-red-200/60',
    gray: 'bg-gray-100 text-sola-navy-muted border border-gray-200/60',
    outline: 'bg-transparent text-sola-navy border border-sola-border',
  };

  const sizes = {
    sm: 'text-[11px] font-medium px-2 py-0.5 rounded-md',
    md: 'text-xs font-semibold px-2.5 py-1 rounded-lg',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-sans whitespace-nowrap transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
