import React from 'react';

export function LessonConcept({ content }: { content: string }) {
  return (
    <div className="prose max-w-none my-4">
      <p>{content}</p>
    </div>
  );
}
