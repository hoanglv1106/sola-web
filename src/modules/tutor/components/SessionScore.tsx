import React from 'react';

export function SessionScore({ score }: { score: number }) {
  return (
    <div className="text-center p-6 border rounded-xl">
      <h2 className="text-3xl font-bold text-blue-600">{score}/100</h2>
      <p className="text-gray-500 mt-1">Session Performance</p>
    </div>
  );
}
