import React from 'react';

export interface HighlightedTextOptions {
  /** Tailwind text-decoration colour token, e.g. `red` or `emerald`. */
  tone?: 'red' | 'emerald' | 'orange';
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<HighlightedTextOptions['tone']>, string> = {
  red: 'underline decoration-red-500 underline-offset-4',
  emerald: 'underline decoration-emerald-500 underline-offset-4 font-black',
  orange: 'text-sola-orange font-bold',
};

/**
 * Render a sentence with the fixture-declared highlight emphasised.
 *
 * When the highlight does not occur in the sentence the sentence is rendered
 * unchanged, so mismatched mock data degrades gracefully instead of showing a
 * hardcoded frame.
 */
export function renderHighlightedText(
  sentence: string,
  highlight: string | undefined,
  options: HighlightedTextOptions = {}
): React.ReactNode {
  const tone = options.tone ?? 'orange';
  const text = sentence ?? '';
  const target = (highlight ?? '').trim();

  if (!text) return null;
  if (!target) return text;

  const index = text.toLowerCase().indexOf(target.toLowerCase());
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + target.length);
  const after = text.slice(index + target.length);

  return (
    <>
      {before}
      <span className={TONE_CLASSES[tone]}>{match}</span>
      {after}
    </>
  );
}
