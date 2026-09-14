export interface AssessmentTest {
  id: string;
  title: string;
  category: 'general' | 'ielts' | 'toeic';
  durationMinutes: number;
}
