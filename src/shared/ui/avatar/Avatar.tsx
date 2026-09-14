import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Avatar({ className = '', children, ...props }: AvatarProps) {
  return (
    <div className={`sola-${className}`} {...props}>
      {children}
    </div>
  );
}
