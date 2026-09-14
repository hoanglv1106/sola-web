import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className = '', children, ...props }: SkeletonProps) {
  return (
    <div className={`sola-${className}`} {...props}>
      {children}
    </div>
  );
}
