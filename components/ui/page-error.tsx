'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Consistent error display used by every route‑level error.tsx boundary.
 */
export function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mb-5">
        <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
      </div>

      <h2 className="text-lg font-semibold text-white mb-1">
        Something went wrong
      </h2>
      <p className="text-sm text-[#666] max-w-md text-center mb-6">
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>

      {error.digest && (
        <p className="text-[11px] text-[#444] font-mono mb-4">
          Error ID: {error.digest}
        </p>
      )}

      <Button
        onClick={reset}
        variant="outline"
        className="border-[#333] bg-[#111] text-white hover:bg-[#1a1a1a] hover:border-[#444] transition-all duration-200"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Try again
      </Button>
    </div>
  );
}
