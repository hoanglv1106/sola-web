import React from 'react';

export function LessonHeader({ title }: { title: string }) {
  return (
    <header className="pb-4 border-b">
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
