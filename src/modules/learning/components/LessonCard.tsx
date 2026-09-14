import React from 'react';

interface LessonCardProps {
  title: string;
  duration: string;
}

export function LessonCard({ title, duration }: LessonCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-sm transition">
      <h4 className="font-medium text-base">{title}</h4>
      <span className="text-xs text-gray-500">{duration}</span>
    </div>
  );
}
