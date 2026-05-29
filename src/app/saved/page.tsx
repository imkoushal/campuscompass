"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

interface SavedCollege {
  id: string;
  college: {
    id: string;
    name: string;
    slug: string;
    city: string;
    state: string;
    type: string;
    rating: number;
    banner: string | null;
    fees: Record<string, number> | null;
  };
  createdAt: string;
}

export default function SavedPage() {
  const { data: session, status } = useSession();
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/saved/colleges")
      .then((r) => r.json())
      .then((data) => setSavedColleges(data.savedColleges || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status]);

  const unsaveCollege = async (collegeId: string) => {
    const college = savedColleges.find((sc) => sc.college.id === collegeId);
    try {
      await fetch("/api/saved/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      setSavedColleges(savedColleges.filter((sc) => sc.college.id !== collegeId));
      showToast(`${college?.college.name || "College"} removed from saved`, "info");
    } catch (e) {
      console.error(e);
      showToast("Failed to remove college", "error");
    }
  };

  if (status === "loading") {
    return (
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-surface-container-high rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16 text-center">
        <div className="glass-card rounded-2xl p-16 max-w-lg mx-auto">
          <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">bookmark</span>
          <h2 className="text-2xl font-bold mb-3">Save Your Favorites</h2>
          <p className="text-on-surface-variant mb-6">
            Sign in to save colleges and track your preferences.
          </p>
          <Link href="/login" className="primary-btn px-8 py-3 rounded-lg text-sm inline-block">
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Welcome back, {session?.user?.name?.split(" ")[0] || "there"}.
        </h1>
        <p className="text-lg text-on-surface-variant">
          You have {savedColleges.length} saved institution{savedColleges.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="glass-card rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">{savedColleges.length}</p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase">Saved</p>
        </div>
        <div className="glass-card rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-secondary">
            {savedColleges.filter((sc) => sc.college.type === "IIT").length}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase">IITs</p>
        </div>
        <div className="glass-card rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-tertiary">
            {savedColleges.filter((sc) => sc.college.type === "NIT").length}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase">NITs</p>
        </div>
        <div className="glass-card rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-on-surface">
            {savedColleges.filter((sc) => !["IIT", "NIT"].includes(sc.college.type)).length}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 uppercase">Others</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">bookmark</span>
          Saved Colleges
        </h2>
        {savedColleges.length >= 2 && (
          <Link href={`/compare`} className="text-primary text-sm hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">compare_arrows</span>
            Quick Compare
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      ) : savedColleges.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">bookmark_border</span>
          <p className="text-lg text-on-surface-variant mb-4">No saved colleges yet.</p>
          <Link href="/colleges" className="primary-btn px-6 py-2.5 rounded-lg text-sm inline-block">
            Explore Colleges
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((sc) => (
            <div key={sc.id} className="glass-card rounded-xl overflow-hidden group">
              <div className="h-36 bg-gradient-to-br from-primary/20 via-surface-container to-secondary/10 flex items-center justify-center relative overflow-hidden">
                {sc.college.banner ? (
                  <img src={sc.college.banner} alt={sc.college.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="material-symbols-outlined text-5xl text-primary/20">school</span>
                )}
                <div className="absolute bottom-3 left-3">
                  <span className="bg-primary-container/80 text-on-primary-container text-xs font-semibold px-2 py-0.5 rounded-full">
                    {sc.college.type}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{sc.college.name}</h3>
                <p className="text-xs text-on-surface-variant mb-3">{sc.college.city}, {sc.college.state}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary">{sc.college.rating} ★</span>
                  <div className="flex gap-2">
                    <Link href={`/colleges/${sc.college.slug}`} className="text-xs text-primary hover:underline">View</Link>
                    <button onClick={() => unsaveCollege(sc.college.id)} className="text-xs text-error hover:underline">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
