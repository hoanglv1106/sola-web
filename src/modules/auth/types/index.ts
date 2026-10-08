export type SocialProvider = 'google' | 'microsoft' | 'apple';

export interface LoginFormState {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  targetGoal?: string;
  currentLevel?: string;
  dailyGoalMinutes?: number;
}

export interface PasswordRuleStatus {
  hasMinLength: boolean;
  hasLetterAndNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

export function validatePasswordRules(password: string): PasswordRuleStatus {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasLetterAndNumber = hasLetter && hasNumber;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    hasMinLength,
    hasLetterAndNumber,
    hasSpecialChar,
    isValid: hasMinLength && hasLetterAndNumber && hasSpecialChar,
  };
}
