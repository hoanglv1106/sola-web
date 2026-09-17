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
  await params; // Ensure params Promise is resolved in Next.js 15
  return <PracticeMistakeRunner />;
}
