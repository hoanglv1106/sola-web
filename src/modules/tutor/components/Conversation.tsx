import React from 'react';

export function Conversation({ children }: { children?: React.ReactNode }) {
  return <div className="space-y-4 flex flex-col">{children}</div>;
}
