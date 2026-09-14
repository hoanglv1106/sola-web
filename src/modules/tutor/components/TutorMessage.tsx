import React from 'react';

export function TutorMessage({ message }: { message: string }) {
  return (
    <div className="self-start max-w-xl bg-blue-50 text-blue-950 p-4 rounded-2xl border border-blue-100">
      <p>{message}</p>
    </div>
  );
}
