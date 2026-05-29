"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const navLinks = [
  { href: "/colleges", label: "Colleges" },
  { href: "/compare", label: "Compare" },
  { href: "/saved", label: "Saved" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container/80 backdrop-blur-md border-b border-outline-variant/20 shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="flex justify-between items-center px-4 md:px-8 h-20 w-full max-w-screen-2xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-on-surface tracking-tight">
          CampusCompass
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-primary font-semibold border-b-2 border-primary pb-1"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-on-surface-variant hidden md:inline">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Sign out of your account"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="primary-btn px-5 py-2 rounded-lg text-sm"
              >
                Get Started
              </Link>
            </>
          )}
          <button
            className="md:hidden text-on-surface-variant"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface-container border-t border-outline-variant/20 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${
                pathname === link.href ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
