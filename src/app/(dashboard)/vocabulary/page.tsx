import React from 'react';
import { VocabularyDashboard } from '@/modules/vocabulary';

export const metadata = {
  title: 'Vocabulary | SOLA',
  description: 'Build a richer vocabulary for real conversations with SOLA English.',
};

export default function VocabularyPage() {
  return <VocabularyDashboard />;
}
