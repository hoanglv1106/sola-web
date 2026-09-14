import React from 'react';

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Tabs({ className = '', children, ...props }: TabsProps) {
  return (
    <div className={`sola-${className}`} {...props}>
      {children}
    </div>
  );
}
