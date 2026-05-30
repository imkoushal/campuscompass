"use client";
import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError) {
      if (authError === "CredentialsSignin") {
        setError("Invalid email or password");
      } else {
        setError("Authentication error. Please try again.");
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/saved");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative">
      <div className="glow-orb bg-primary w-[400px] h-[400px] -top-20 -right-20 opacity-10" />
      <div className="glow-orb bg-secondary w-[300px] h-[300px] bottom-20 -left-20 opacity-10" />

      <div className="text-center mb-8 z-10">
        <div className="w-14 h-14 bg-primary-container rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-on-primary-container text-2xl">school</span>
        </div>
        <h1 className="text-2xl font-bold">CampusCompass</h1>
        <p className="text-on-surface-variant text-sm mt-1">Welcome back to the future of learning</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 w-full max-w-md z-10 space-y-6">
        {error && (
          <div className="bg-error-container/20 border border-error/30 text-error text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-semibold mb-2 block">Email Address</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@campus.edu"
              className="filter-input w-full pl-10 pr-4 py-3 rounded-lg text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="filter-input w-full pl-10 pr-12 py-3 rounded-lg text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full primary-btn py-3 rounded-lg text-sm font-bold disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/30" />
          </div>
          <span className="relative bg-surface-container px-4 text-xs text-on-surface-variant">Or continue with</span>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/saved" })}
          className="w-full border border-outline-variant py-3 rounded-lg text-sm flex items-center justify-center gap-2 hover:border-primary transition-colors bg-surface-container-high/50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google Login
        </button>
      </form>

      <p className="text-sm text-on-surface-variant mt-6 z-10">
        Don&apos;t have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Get Started</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><span className="text-on-surface-variant">Loading...</span></div>}>
      <LoginForm />
    </Suspense>
  );
}
