import React from 'react';
import { VocabularyReviewSession } from '@/modules/vocabulary';

export const metadata = {
  title: 'Vocabulary Review Session | SOLA',
  description: 'Review words with spaced repetition to make them stick with SOLA English.',
};

export default function VocabularyReviewPage() {
  return <VocabularyReviewSession />;
}
