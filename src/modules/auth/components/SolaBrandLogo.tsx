'use client';

import React from 'react';
import Link from 'next/link';

interface SolaBrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SolaBrandLogo({ className = '', size = 'md' }: SolaBrandLogoProps) {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const taglineSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-xs' : 'text-[11px]';

  return (
    <Link
      href="/home"
      className={`inline-flex items-center gap-2.5 group transition-transform active:scale-95 ${className}`}
      aria-label="SOLA Homepage"
    >
      {/* Sun Icon with radiating rays */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform group-hover:rotate-45 duration-500 ease-out"
        >
          {/* Central sun body */}
          <circle cx="18" cy="18" r="6" fill="#fa5b2d" />

          {/* 8 rounded radiating rays */}
          {/* North */}
          <line x1="18" y1="2.5" x2="18" y2="7.5" stroke="#fa5b2d" strokeWidth="2.8" strokeLinecap="round" />
          {/* South */}
          <line x1="18" y1="28.5" x2="18" y2="33.5" stroke="#fa5b2d" strokeWidth="2.8" strokeLinecap="round" />
          {/* West */}
          <line x1="2.5" y1="18" x2="7.5" y2="18" stroke="#fa5b2d" strokeWidth="2.8" strokeLinecap="round" />
          {/* East */}
          <line x1="28.5" y1="18" x2="33.5" y2="18" stroke="#fa5b2d" strokeWidth="2.8" strokeLinecap="round" />
          {/* North-West */}
          <line x1="7" y1="7" x2="10.5" y2="10.5" stroke="#fa5b2d" strokeWidth="2.8" strokeLinecap="round" />
          {/* South-East */}
          <line x1="25.5" y1="25.5" x2="29" y2="29" stroke="#fa5b2d" strokeWidth="2.8" strokeLinecap="round" />
          {/* South-West */}
          <line x1="7" y1="29" x2="10.5" y2="25.5" stroke="#fa5b2d" strokeWidth="2.8" strokeLinecap="round" />
          {/* North-East */}
          <line x1="25.5" y1="10.5" x2="29" y2="7" stroke="#fa5b2d" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <span className={`font-black tracking-tight text-slate-900 ${textSize}`}>
          SOLA
        </span>
        <span className={`font-medium text-slate-600 ${taglineSize}`}>
          Speak a brighter you
        </span>
      </div>
    </Link>
  );
}
