import React from 'react';
import { MistakesDashboard } from '@/modules/mistakes';

export const metadata = {
  title: 'Mistakes & Review | SOLA',
  description: 'Turn your English mistakes into real learning progress with SOLA.',
};

export default function MistakesPage() {
  return <MistakesDashboard />;
}
