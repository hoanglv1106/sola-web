'use client';

import React from 'react';
import { cn } from '@/shared/lib/cn';

export interface SelectionOption {
  value: string;
  label: React.ReactNode;
  /** Optional visible description (e.g. the sentence blank). */
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectionGroupProps {
  /** Accessible name for the whole group, rendered as a fieldset legend. */
  label: string;
  /** Visually hide the legend but keep it for assistive tech. */
  hideLabel?: boolean;
  options: SelectionOption[];
  value: string | null;
  onChange: (value: string) => void;
  /** Accessible label for each radio, typically the question sentence. */
  getOptionAriaLabel?: (option: SelectionOption) => string;
  /** `radiogroup` (default) or `group` for non-exclusive chips. */
  role?: 'radiogroup' | 'group';
  className?: string;
  optionClassName?: string | ((option: SelectionOption, isSelected: boolean) => string);
  /** Renders the check indicator used by the daily-session radio chips. */
  showRadioDot?: boolean;
  /** Renders the state ring applied when a group is graded. */
  helperText?: string;
}

/**
 * Shared single-choice primitive.
 *
 * Implements the WAI-ARIA radio pattern with roving tabindex: one tab stop for
 * the group, Arrow keys move the selection, and the selected option carries
 * `aria-checked="true"`.
 */
export function SelectionGroup({
  label,
  hideLabel = false,
  options,
  value,
  onChange,
  getOptionAriaLabel,
  role = 'radiogroup',
  className,
  optionClassName,
  showRadioDot = false,
  helperText,
}: SelectionGroupProps) {
  const groupId = React.useId();
  const enabledOptions = options.filter((option) => !option.disabled);
  const selectedIndex = enabledOptions.findIndex((option) => option.value === value);
  const activeValue =
    selectedIndex >= 0 ? value : enabledOptions[0]?.value ?? null;
  const isRadioGroup = role === 'radiogroup';

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isRadioGroup || enabledOptions.length === 0) return;

    const currentIndex = enabledOptions.findIndex((option) => option.value === activeValue);
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % enabledOptions.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
        break;
      case ' ':
      case 'Enter':
        if (activeValue) {
          event.preventDefault();
          onChange(activeValue);
        }
        return;
      default:
        return;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    const nextOption = enabledOptions[nextIndex];
    onChange(nextOption.value);
    const node = event.currentTarget.querySelector<HTMLButtonElement>(
      `[data-selection-value="${CSS.escape(nextOption.value)}"]`
    );
    node?.focus();
  };

  return (
    <div
      role={role}
      aria-label={hideLabel ? label : undefined}
      aria-labelledby={hideLabel ? undefined : `${groupId}-label`}
      className={className}
      onKeyDown={handleKeyDown}
    >
      {!hideLabel && (
        <span id={`${groupId}-label`} className="sr-only">
          {label}
        </span>
      )}

      {options.map((option) => {
        const isSelected = option.value === value;
        const isTabbable = isRadioGroup ? option.value === activeValue : true;
        const optionClass =
          typeof optionClassName === 'function'
            ? optionClassName(option, isSelected)
            : optionClassName;

        return (
          <button
            key={option.value}
            type="button"
            role={isRadioGroup ? 'radio' : undefined}
            aria-checked={isRadioGroup ? isSelected : undefined}
            aria-pressed={isRadioGroup ? undefined : isSelected}
            aria-label={getOptionAriaLabel?.(option)}
            data-selection-value={option.value}
            tabIndex={isTabbable ? 0 : -1}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-sola-orange focus-visible:ring-offset-1',
              optionClass
            )}
          >
            {showRadioDot && (
              <span
                aria-hidden="true"
                className={cn(
                  'w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0',
                  isSelected ? 'border-sola-orange' : 'border-gray-300'
                )}
              >
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sola-orange" />}
              </span>
            )}
            <span>{option.label}</span>
            {option.description && <span className="sr-only">{option.description}</span>}
          </button>
        );
      })}

      {helperText && <p className="sr-only">{helperText}</p>}
    </div>
  );
}
