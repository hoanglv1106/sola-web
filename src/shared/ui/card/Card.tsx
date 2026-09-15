import React from 'react';
import { cn } from '@/shared/lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'soft' | 'outline' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Card({
  className,
  variant = 'surface',
  padding = 'lg',
  children,
  ...props
}: CardProps) {
  const variants = {
    surface: 'bg-white border border-sola-border shadow-sola-card',
    soft: 'bg-sola-orange-soft/40 border border-orange-100',
    outline: 'bg-transparent border border-sola-border',
    flat: 'bg-sola-bg border border-sola-border/70',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-200',
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
