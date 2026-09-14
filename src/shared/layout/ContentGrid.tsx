import React from 'react';

export function ContentGrid({ children, columns = 2 }: { children: React.ReactNode; columns?: number }) {
  return <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>{children}</div>;
}
