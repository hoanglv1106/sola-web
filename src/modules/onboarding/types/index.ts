export type LearningGoal =
  | 'daily_communication'
  | 'professional_english'
  | 'ielts'
  | 'toeic'
  | 'career_growth';

export type LearnerPersona =
  | 'student'
  | 'working_professional'
  | 'job_seeker'
  | 'business_owner'
  | 'other';

export type DailyStudyTime = '5_minutes' | '15_minutes' | '30_minutes' | '60_plus_minutes';

export type TargetTimeline =
  | '1_month'
  | '3_months'
  | '6_months'
  | '1_year'
  | 'not_sure';

export interface OnboardingFormValues {
  goal: LearningGoal;
  persona: LearnerPersona;
  studyTime: DailyStudyTime;
  targetTimeline: TargetTimeline;
}
