import React from 'react';

export interface InputProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Input({ className = '', children, ...props }: InputProps) {
  return (
    <div className={`sola-${className}`} {...props}>
      {children}
    </div>
  );
}
