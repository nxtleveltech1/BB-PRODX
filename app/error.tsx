'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9E7C9]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-[var(--bb-mahogany)]">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="bg-[var(--bb-citron)] hover:bg-[var(--bb-citron)]/90 text-[var(--bb-black-bean)] px-6 py-3 font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}