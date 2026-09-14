import React from 'react';

export function LiveFeedback({ feedback }: { feedback: string }) {
  return (
    <aside className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-sm">
      <strong>Feedback:</strong> {feedback}
    </aside>
  );
}
