import React from 'react';

export function UserMessage({ message }: { message: string }) {
  return (
    <div className="self-end max-w-xl bg-gray-900 text-white p-4 rounded-2xl">
      <p>{message}</p>
    </div>
  );
}
