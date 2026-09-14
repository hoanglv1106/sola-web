import React from 'react';

export interface TextareaProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Textarea({ className = '', children, ...props }: TextareaProps) {
  return (
    <div className={`sola-${className}`} {...props}>
      {children}
    </div>
  );
}
