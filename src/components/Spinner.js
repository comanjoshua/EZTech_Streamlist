import React from 'react';

export default function Spinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
    </div>
  );
}
