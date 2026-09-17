import React from 'react';
import { SpeakingFeedbackReport } from '@/modules/tutor';

export const metadata = {
  title: 'Speaking Session Feedback | SOLA',
  description: 'Detailed assessment and personalized AI feedback for your English speaking session.',
};

export default async function SpeakingFeedbackPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <SpeakingFeedbackReport sessionId={sessionId} />;
}
