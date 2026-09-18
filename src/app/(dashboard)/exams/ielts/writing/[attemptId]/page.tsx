import React from 'react';
import { IeltsWritingFeedbackView } from '@/modules/exams';

export const metadata = {
  title: 'IELTS Writing Feedback | SOLA',
  description: 'AI-evaluated IELTS Task 2 writing feedback with detailed rubric scoring and targeted correction suggestions.',
};

export default function IeltsWritingPage() {
  return <IeltsWritingFeedbackView />;
}
