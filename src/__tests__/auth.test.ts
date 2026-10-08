import { describe, it, expect } from 'vitest';
import { validatePasswordRules } from '@/modules/auth/types';

describe('Auth Password Validation Rules', () => {
  it('should fail when password is less than 8 characters', () => {
    const result = validatePasswordRules('Short1!');
    expect(result.hasMinLength).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it('should fail when password lacks letters or numbers', () => {
    const lettersOnly = validatePasswordRules('LongPasswordWithoutNumbers!');
    expect(lettersOnly.hasLetterAndNumber).toBe(false);
    expect(lettersOnly.isValid).toBe(false);

    const numbersOnly = validatePasswordRules('1234567890!@#$');
    expect(numbersOnly.hasLetterAndNumber).toBe(false);
    expect(numbersOnly.isValid).toBe(false);
  });

  it('should fail when password lacks special characters', () => {
    const noSpecial = validatePasswordRules('Password1234');
    expect(noSpecial.hasMinLength).toBe(true);
    expect(noSpecial.hasLetterAndNumber).toBe(true);
    expect(noSpecial.hasSpecialChar).toBe(false);
    expect(noSpecial.isValid).toBe(false);
  });

  it('should pass when password satisfies all 3 rules', () => {
    const valid = validatePasswordRules('AlexPass123!');
    expect(valid.hasMinLength).toBe(true);
    expect(valid.hasLetterAndNumber).toBe(true);
    expect(valid.hasSpecialChar).toBe(true);
    expect(valid.isValid).toBe(true);
  });
});
