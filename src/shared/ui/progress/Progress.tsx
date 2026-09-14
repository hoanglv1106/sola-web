import React from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Progress({ className = '', children, ...props }: ProgressProps) {
  return (
    <div className={`sola-${className}`} {...props}>
      {children}
    </div>
  );
}
