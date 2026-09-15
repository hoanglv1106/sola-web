import React from 'react';
import { cn } from '@/shared/lib/cn';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-gray-200/80', className)}
      {...props}
    />
  );
}
