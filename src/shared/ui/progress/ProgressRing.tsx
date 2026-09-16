import React from 'react';
import { cn } from '@/shared/lib/cn';

export interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number; // diameter in pixels, default 96
  strokeWidth?: number; // stroke width in pixels, default 8
  color?: 'orange' | 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  label?: string;
  sublabel?: string;
  badge?: React.ReactNode;
  className?: string;
}

export function ProgressRing({
  value,
  size = 96,
  strokeWidth = 8,
  color = 'orange',
  label,
  sublabel,
  badge,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const colorMap = {
    orange: { stroke: '#ff7139', bg: '#fef0e9' },
    blue: { stroke: '#4c8df6', bg: '#eff5ff' },
    green: { stroke: '#27b47e', bg: '#eefaf4' },
    purple: { stroke: '#8b5cf6', bg: '#f5f0ff' },
    red: { stroke: '#ed646f', bg: '#fef0f1' },
    yellow: { stroke: '#f7ab29', bg: '#fef7eb' },
  };

  const selectedColor = colorMap[color];

  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f2eee8"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={selectedColor.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center percentage value */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-sola-navy tracking-tight">
            {clampedValue}%
          </span>
        </div>
      </div>

      {/* Label and details */}
      {label && (
        <span className="font-semibold text-sm text-sola-navy mt-3">
          {label}
        </span>
      )}
      {sublabel && (
        <span className="text-xs text-sola-text-secondary mt-0.5">
          {sublabel}
        </span>
      )}
      {badge && <div className="mt-2">{badge}</div>}
    </div>
  );
}

