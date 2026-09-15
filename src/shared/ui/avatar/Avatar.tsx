import React from 'react';
import { cn } from '@/shared/lib/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'away';
}

export function Avatar({
  src,
  alt = 'Avatar',
  fallback = 'U',
  size = 'md',
  status,
  className,
  ...props
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  return (
    <div className={cn('relative inline-flex shrink-0', className)} {...props}>
      <div
        className={cn(
          'rounded-full overflow-hidden bg-orange-100 text-sola-navy font-semibold flex items-center justify-center border-2 border-white shadow-sm select-none',
          sizes[size]
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken image and let fallback show
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span>{fallback}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            status === 'online' && 'bg-sola-green',
            status === 'busy' && 'bg-sola-red',
            status === 'away' && 'bg-sola-yellow',
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
