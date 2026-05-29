import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="text-[180px] md:text-[240px] font-bold text-primary/5 leading-none select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-7xl md:text-8xl text-primary/40 animate-float">explore_off</span>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Page Not Found
      </h1>
      <p className="text-lg text-on-surface-variant max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/" className="primary-btn px-8 py-3 rounded-lg text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">home</span>
          Back to Home
        </Link>
        <Link href="/colleges" className="border border-outline-variant px-8 py-3 rounded-lg text-sm flex items-center gap-2 hover:border-primary hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">school</span>
          Explore Colleges
        </Link>
      </div>
    </div>
  );
}
