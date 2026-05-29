"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

export default function SaveButton({ collegeId, collegeName }: { collegeId: string; collegeName: string }) {
  const { status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/saved/colleges")
      .then((r) => r.json())
      .then((data) => {
        const saved = data.savedColleges?.some(
          (sc: { college: { id: string } }) => sc.college.id === collegeId
        );
        setIsSaved(!!saved);
      })
      .catch(console.error);
  }, [status, collegeId]);

  const toggleSave = async () => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/saved/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      const data = await res.json();
      setIsSaved(data.action === "saved");
      showToast(
        data.action === "saved"
          ? `${collegeName} added to saved colleges`
          : `${collegeName} removed from saved`,
        data.action === "saved" ? "success" : "info"
      );
    } catch {
      showToast("Failed to update saved colleges", "error");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className={`px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all border ${
        isSaved
          ? "border-primary bg-primary/10 text-primary"
          : "border-outline-variant hover:border-primary hover:text-primary"
      } ${loading ? "opacity-50 cursor-wait" : ""}`}
      aria-label={isSaved ? `Remove ${collegeName} from saved` : `Save ${collegeName}`}
    >
      <span
        className="material-symbols-outlined text-lg"
        style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
      >
        bookmark
      </span>
      {isSaved ? "Saved" : "Save College"}
    </button>
  );
}
