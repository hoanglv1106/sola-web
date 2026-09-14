import React from 'react';

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Tooltip({ className = '', children, ...props }: TooltipProps) {
  return (
    <div className={`sola-${className}`} {...props}>
      {children}
    </div>
  );
}
