import React from 'react';

export function PageContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-7xl mx-auto w-full px-4 py-6 ${className}`}>{children}</div>;
}
