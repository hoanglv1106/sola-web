export interface IELTSAttempt {
  id: string;
  taskType: 'task1' | 'task2';
  score?: number;
  submittedAt: string;
}
