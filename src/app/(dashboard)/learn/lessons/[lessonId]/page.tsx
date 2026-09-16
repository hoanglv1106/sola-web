import React from 'react';
import { LessonEngine } from '@/modules/lesson';
import { mockGrammarLesson } from '@/mocks/lesson.mock';

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  await params; // consume dynamic param
  return <LessonEngine lesson={mockGrammarLesson} />;
}
