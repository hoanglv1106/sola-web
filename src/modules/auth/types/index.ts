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

/**
 * Human-readable error for the first unmet password rule.
 *
 * The messages mirror the labels rendered by `PasswordRequirements` so the
 * inline hints and the submit error never disagree.
 */
export function getPasswordRuleError(rules: PasswordRuleStatus): string {
  if (!rules.hasMinLength) {
    return 'Password must be at least 8 characters';
  }
  if (!rules.hasLetterAndNumber) {
    return 'Password must include a letter and a number';
  }
  if (!rules.hasSpecialChar) {
    return 'Password must include a special character (e.g. !@#$%)';
  }
  return '';
}
