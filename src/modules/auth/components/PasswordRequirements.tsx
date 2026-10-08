'use client';

import React from 'react';
import { validatePasswordRules } from '../types';
import { Check } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const rules = validatePasswordRules(password);

  const items = [
    {
      id: 'length',
      label: 'At least 8 characters',
      satisfied: rules.hasMinLength,
    },
    {
      id: 'letter-number',
      label: 'Include a letter and a number',
      satisfied: rules.hasLetterAndNumber,
    },
    {
      id: 'special-char',
      label: 'Include a special character (e.g. !@#$%)',
      satisfied: rules.hasSpecialChar,
    },
  ];

  return (
    <div className="space-y-1.5 pt-1 select-none">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          {item.satisfied ? (
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs transition-colors">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          ) : (
            <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 bg-transparent transition-colors" />
          )}
          <span
            className={`text-xs transition-colors ${
              item.satisfied
                ? 'text-emerald-700 font-medium'
                : 'text-slate-600'
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
