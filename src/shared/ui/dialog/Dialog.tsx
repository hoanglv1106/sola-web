import React from 'react';

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Dialog({ className = '', children, ...props }: DialogProps) {
  return (
    <div className={`sola-${className}`} {...props}>
      {children}
    </div>
  );
}
