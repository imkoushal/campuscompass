"use client";
import { useState, useEffect } from "react";

interface College {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string;
  rating: number;
  fees: Record<string, number> | null;
  ranking: Record<string, number> | null;
  courses: { name: string; degree: string }[];
  placements: { avgPackage: number; highestPackage: number; medianPackage: number; placementPercentage: number; topRecruiters: string[] }[];
}

interface CompareData {
  colleges: College[];
  highlights: Record<string, string>;
}

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; slug: string; city: string; state: string; type: string; rating: number }[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [compareData, setCompareData] = useState<CompareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Search colleges
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/colleges?search=${encodeURIComponent(searchQuery)}&limit=8`);
        const data = await res.json();
        setSearchResults((data.colleges || []).filter((c: { id: string }) => !selectedIds.includes(c.id)));
      } catch (e) { console.error(e); }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedIds]);

  // Fetch compare data
  useEffect(() => {
    if (selectedIds.length < 2) { setCompareData(null); return; }
    setLoading(true);
    fetch(`/api/compare?ids=${selectedIds.join(",")}`)
      .then((r) => r.json())
      .then(setCompareData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedIds]);

  const addCollege = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const removeCollege = (id: string) => {
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
  };

  const getBadgeColor = (key: string) => {
    switch (key) {
      case "bestRating": return "text-secondary bg-secondary/10 border-secondary/30";
      case "lowestFees": return "text-tertiary bg-tertiary/10 border-tertiary/30";
      case "highestPackage": return "text-primary bg-primary/10 border-primary/30";
      case "bestPlacement": return "text-secondary bg-secondary/10 border-secondary/30";
      default: return "text-on-surface bg-surface-variant/10";
    }
  };

  const getBadgeLabel = (key: string) => {
    switch (key) {
      case "bestRating": return "TOP RATED";
      case "lowestFees": return "BEST VALUE";
      case "highestPackage": return "HIGH AVG";
      case "bestPlacement": return "TOP PLACED";
      default: return key.toUpperCase();
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Compare Institutions</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          Make data-driven decisions by comparing up to 3 top-tier colleges side-by-side with our precision analytics tools.
        </p>
      </div>

      {/* Selection Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {selectedIds.map((id, idx) => {
          const college = compareData?.colleges.find((c) => c.id === id);
          const searchCollege = searchResults.find((c) => c.id === id);
          const name = college?.name || searchCollege?.name || "Loading...";
          return (
            <div key={id} className="glass-card rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">school</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold uppercase ${idx === 0 ? "text-primary" : idx === 1 ? "text-secondary" : "text-tertiary"}`}>
                  Selected {idx + 1}
                </p>
                <p className="font-bold truncate">{name}</p>
              </div>
              <button onClick={() => removeCollege(id)} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          );
        })}

        {selectedIds.length < 3 && (
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="glass-card rounded-xl p-5 w-full h-full min-h-[80px] flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl text-on-surface-variant">add</span>
              <span className="text-sm text-on-surface-variant">Add College to Compare</span>
            </button>

            {showSearch && (
              <div className="absolute top-full left-0 right-0 mt-2 z-20 glass-card rounded-xl p-4 border border-primary/30 shadow-xl">
                <input
                  autoFocus
                  className="filter-input w-full px-4 py-3 rounded-lg text-sm mb-3"
                  placeholder="Search by college name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {searchResults.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => addCollege(c.id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-primary/10 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-on-surface-variant">{c.city}, {c.state} • {c.type}</p>
                      </div>
                      <span className="text-xs text-secondary">{c.rating}★</span>
                    </button>
                  ))}
                  {searchQuery && searchResults.length === 0 && (
                    <p className="text-sm text-on-surface-variant text-center py-4">No colleges found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {loading ? (
        <div className="glass-card rounded-xl p-8 animate-pulse">
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-surface-container-high rounded" />
            ))}
          </div>
        </div>
      ) : compareData && compareData.colleges.length >= 2 ? (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="p-5 text-sm text-on-surface-variant uppercase tracking-wider font-medium w-48">Metric</th>
                  {compareData.colleges.map((c, i) => (
                    <th key={c.id} className={`p-5 text-sm font-bold ${i === 0 ? "text-primary" : i === 1 ? "text-secondary" : "text-tertiary"}`}>
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Tuition Fees */}
                <tr className="border-b border-outline-variant/10 hover:bg-surface-variant/10 transition-colors">
                  <td className="p-5 font-medium text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-on-surface-variant">payments</span>
                    Tuition Fees (Annual)
                  </td>
                  {compareData.colleges.map((c) => {
                    const f = c.fees as Record<string, number> | null;
                    const isHighlight = compareData.highlights.lowestFees === c.id;
                    return (
                      <td key={c.id} className="p-5 text-sm">
                        {f?.btech ? `₹${(f.btech / 100000).toFixed(1)} Lakhs` : "—"}
                        {isHighlight && (
                          <span className={`ml-2 inline-block px-2 py-0.5 rounded text-xs font-semibold border ${getBadgeColor("lowestFees")}`}>
                            {getBadgeLabel("lowestFees")}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Rating */}
                <tr className="border-b border-outline-variant/10 hover:bg-surface-variant/10 transition-colors">
                  <td className="p-5 font-medium text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    Student Rating
                  </td>
                  {compareData.colleges.map((c) => {
                    const isHighlight = compareData.highlights.bestRating === c.id;
                    return (
                      <td key={c.id} className="p-5 text-sm">
                        {c.rating} ★
                        {isHighlight && (
                          <span className={`ml-2 inline-block px-2 py-0.5 rounded text-xs font-semibold border ${getBadgeColor("bestRating")}`}>
                            {getBadgeLabel("bestRating")}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Avg Package */}
                <tr className="border-b border-outline-variant/10 hover:bg-surface-variant/10 transition-colors">
                  <td className="p-5 font-medium text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-on-surface-variant">account_balance_wallet</span>
                    Avg. Package
                  </td>
                  {compareData.colleges.map((c) => {
                    const p = c.placements?.[0];
                    const isHighlight = compareData.highlights.highestPackage === c.id;
                    return (
                      <td key={c.id} className="p-5 text-sm">
                        {p ? `₹${p.avgPackage?.toFixed(1)} LPA` : "—"}
                        {isHighlight && (
                          <span className={`ml-2 inline-block px-2 py-0.5 rounded text-xs font-semibold border ${getBadgeColor("highestPackage")}`}>
                            {getBadgeLabel("highestPackage")}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Highest Package */}
                <tr className="border-b border-outline-variant/10 hover:bg-surface-variant/10 transition-colors">
                  <td className="p-5 font-medium text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-on-surface-variant">rocket_launch</span>
                    Highest Package
                  </td>
                  {compareData.colleges.map((c) => {
                    const p = c.placements?.[0];
                    return (
                      <td key={c.id} className="p-5 text-sm">
                        {p ? `₹${p.highestPackage?.toFixed(1)} LPA` : "—"}
                      </td>
                    );
                  })}
                </tr>

                {/* Placement % */}
                <tr className="border-b border-outline-variant/10 hover:bg-surface-variant/10 transition-colors">
                  <td className="p-5 font-medium text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-on-surface-variant">trending_up</span>
                    Placement %
                  </td>
                  {compareData.colleges.map((c) => {
                    const p = c.placements?.[0];
                    const isHighlight = compareData.highlights.bestPlacement === c.id;
                    return (
                      <td key={c.id} className="p-5 text-sm">
                        {p ? `${p.placementPercentage?.toFixed(0)}%` : "—"}
                        {isHighlight && (
                          <span className={`ml-2 inline-block px-2 py-0.5 rounded text-xs font-semibold border ${getBadgeColor("bestPlacement")}`}>
                            {getBadgeLabel("bestPlacement")}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Key Courses */}
                <tr className="border-b border-outline-variant/10 hover:bg-surface-variant/10 transition-colors">
                  <td className="p-5 font-medium text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-on-surface-variant">menu_book</span>
                    Key Courses
                  </td>
                  {compareData.colleges.map((c) => (
                    <td key={c.id} className="p-5">
                      <div className="flex flex-wrap gap-1">
                        {c.courses?.slice(0, 3).map((course) => (
                          <span key={course.name} className="px-2 py-1 bg-surface-container-high rounded text-xs">
                            {course.degree === "B.Tech" ? course.name.replace("Engineering", "").replace("Computer Science", "CS").trim() : course.degree}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Location */}
                <tr className="hover:bg-surface-variant/10 transition-colors">
                  <td className="p-5 font-medium text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-on-surface-variant">location_on</span>
                    Location
                  </td>
                  {compareData.colleges.map((c) => (
                    <td key={c.id} className="p-5 text-sm">{c.city}, {c.state}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedIds.length > 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">compare</span>
          <p className="text-lg text-on-surface-variant">Select at least 2 colleges to start comparing.</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-16 text-center">
          <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">compare_arrows</span>
          <h3 className="text-xl font-bold mb-2">Start Your Comparison</h3>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Search and select colleges above to see a detailed side-by-side analysis of fees, placements, ratings, and more.
          </p>
        </div>
      )}
    </div>
  );
}
