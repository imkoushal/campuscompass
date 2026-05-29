"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/login");
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
        <h1 className="text-2xl font-bold">Join CampusCompass</h1>
        <p className="text-on-surface-variant text-sm mt-1">Create your account to start exploring</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 w-full max-w-md z-10 space-y-5">
        {error && (
          <div className="bg-error-container/20 border border-error/30 text-error text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-semibold mb-2 block">Full Name</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">person</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivers" className="filter-input w-full pl-10 pr-4 py-3 rounded-lg text-sm" required />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Email Address</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">mail</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@campus.edu" className="filter-input w-full pl-10 pr-4 py-3 rounded-lg text-sm" required />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters" className="filter-input w-full pl-10 pr-4 py-3 rounded-lg text-sm" required minLength={8} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full primary-btn py-3 rounded-lg text-sm font-bold disabled:opacity-50">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-on-surface-variant mt-6 z-10">
        Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Login</Link>
      </p>
    </div>
  );
}
