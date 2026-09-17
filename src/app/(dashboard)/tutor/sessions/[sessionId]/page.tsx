import React from 'react';
import { AiTutorVoicePractice } from '@/modules/tutor';

export const metadata = {
  title: 'Voice Practice with Maya | SOLA',
  description: 'Interactive real-time voice coaching and speech practice with AI Tutor Maya.',
};

export default async function TutorSessionVoicePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <AiTutorVoicePractice sessionId={sessionId} />;
}
