import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Badge({ className = '', children, ...props }: BadgeProps) {
  return (
    <div className={`sola-${className}`} {...props}>
      {children}
    </div>
  );
}
