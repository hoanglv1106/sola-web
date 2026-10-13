import React from 'react';
import { PracticeMistakeRunner } from '@/modules/mistakes';

export const metadata = {
  title: 'Practice a Mistake | SOLA',
  description: 'Practice and master tricky English mistakes with SOLA AI Tutor.',
};

export default async function PracticeMistakePage({
  params,
}: {
  params: Promise<{ mistakeId: string }>;
}) {
  // Next.js 15: params is a Promise and must be awaited before use.
  const { mistakeId } = await params;
  return <PracticeMistakeRunner mistakeId={mistakeId} />;
}
