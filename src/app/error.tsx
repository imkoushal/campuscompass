"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="text-[180px] md:text-[240px] font-bold text-error/5 leading-none select-none">500</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-7xl md:text-8xl text-error/40 animate-float">error</span>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-lg text-on-surface-variant max-w-md mb-8">
        An unexpected error occurred. Our team has been notified and we&apos;re working on a fix.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={reset}
          className="primary-btn px-8 py-3 rounded-lg text-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          Try Again
        </button>
        <Link href="/" className="border border-outline-variant px-8 py-3 rounded-lg text-sm flex items-center gap-2 hover:border-primary hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">home</span>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
