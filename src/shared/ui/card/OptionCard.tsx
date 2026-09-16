import React from 'react';
import { cn } from '@/shared/lib/cn';
import { Check } from 'lucide-react';

export interface OptionCardProps {
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  layout?: 'vertical' | 'horizontal';
  className?: string;
  disabled?: boolean;
}

export function OptionCard({
  selected = false,
  onClick,
  icon,
  title,
  description,
  badge,
  layout = 'vertical',
  className,
  disabled = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative text-left w-full transition-all duration-200 cursor-pointer rounded-2xl border p-4 sm:p-5 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sola-orange',
        selected
          ? 'bg-[#fff9f5] border-sola-orange shadow-[0_2px_12px_rgba(255,113,57,0.12)] ring-1 ring-sola-orange'
          : 'bg-white border-sola-border hover:border-orange-200 hover:bg-[#fffdfb] shadow-sola-card',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        layout === 'horizontal' ? 'flex items-center gap-4' : 'flex flex-col',
        className
      )}
    >
      {/* Selection indicator checkmark pill */}
      {selected && (
        <span className="absolute top-3.5 right-3.5 flex items-center justify-center w-5 h-5 rounded-full bg-sola-orange text-white shadow-sm animate-fade-in">
          <Check className="w-3 h-3 stroke-[3]" />
        </span>
      )}

      {/* Optional Badge */}
      {badge && <div className="mb-2">{badge}</div>}

      {/* Icon */}
      {icon && (
        <div
          className={cn(
            'flex items-center justify-center rounded-xl transition-colors',
            layout === 'horizontal' ? 'shrink-0' : 'mb-3',
            selected
              ? 'text-sola-orange bg-white shadow-sm'
              : 'text-sola-navy-muted group-hover:text-sola-orange'
          )}
        >
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <h4
          className={cn(
            'font-semibold text-sm sm:text-base leading-snug transition-colors',
            selected ? 'text-sola-navy font-bold' : 'text-sola-navy'
          )}
        >
          {title}
        </h4>
        {description && (
          <p className="text-xs sm:text-sm text-sola-text-secondary mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </button>
  );
}

