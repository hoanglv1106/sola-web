import React from 'react';
import { cn } from '@/shared/lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft-orange';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      iconLeft,
      iconRight,
      isLoading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sola-orange focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-sola-orange text-white hover:bg-sola-orange-hover shadow-[0_4px_14px_rgba(255,113,57,0.3)]',
      secondary:
        'bg-white text-sola-navy border border-sola-border hover:bg-sola-bg shadow-sm',
      outline:
        'bg-transparent border border-sola-border text-sola-navy hover:border-sola-orange hover:text-sola-orange',
      ghost:
        'bg-transparent text-sola-text-secondary hover:text-sola-navy hover:bg-black/5',
      'soft-orange':
        'bg-sola-orange-soft text-sola-orange hover:bg-orange-100',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 rounded-lg gap-1.5',
      md: 'text-sm px-5 py-2.5 rounded-xl gap-2',
      lg: 'text-base px-7 py-3 rounded-2xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          iconLeft && <span className="inline-flex shrink-0">{iconLeft}</span>
        )}
        <span>{children}</span>
        {!isLoading && iconRight && (
          <span className="inline-flex shrink-0">{iconRight}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
