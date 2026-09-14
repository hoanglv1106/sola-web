import React from 'react';

export interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Button({ className = '', children, ...props }: ButtonProps) {
  return (
    <div className={`sola-${className}`} {...props}>
      {children}
    </div>
  );
}
