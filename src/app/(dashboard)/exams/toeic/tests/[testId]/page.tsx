import React from 'react';
import { ToeicPracticeTestRunner } from '@/modules/exams';

export const metadata = {
  title: 'TOEIC Practice Test Simulation | SOLA',
  description: 'Practice simulated TOEIC test with interactive photograph questions, timer, and detailed AI guidance.',
};

export default function ToeicTestPage() {
  return <ToeicPracticeTestRunner />;
}
