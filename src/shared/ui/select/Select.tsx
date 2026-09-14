import React from 'react';

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Select({ className = '', children, ...props }: SelectProps) {
  return (
    <div className={`sola-${className}`} {...props}>
      {children}
    </div>
  );
}
