export interface MistakeRecord {
  id: string;
  originalText: string;
  correction: string;
  explanation: string;
  category: 'grammar' | 'vocabulary' | 'pronunciation';
  repeatedCount: number;
}
