import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-[#730404]/10 border border-[#730404]/20 flex items-center justify-center mb-5">
        <FileQuestion className="w-6 h-6 text-[#730404]" />
      </div>

      <h2 className="text-lg font-semibold text-white mb-1">Page not found</h2>
      <p className="text-sm text-[#666] max-w-md text-center mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#730404] text-white text-sm font-medium hover:bg-[#8b1a1a] transition-all duration-200 shadow-lg shadow-[#730404]/20"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
