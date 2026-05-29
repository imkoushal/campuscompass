"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface College {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string;
  rating: number;
  banner: string | null;
  fees: Record<string, number> | null;
  ranking: Record<string, number> | null;
  placements: { avgPackage: number; placementPercentage: number }[];
}

interface Filters {
  states: string[];
  types: string[];
  cities: string[];
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen max-w-screen-2xl mx-auto px-4 md:px-8 gap-8">
        <div className="flex-1 py-4 pb-16">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-96 bg-surface-container-high rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="glass-card rounded-xl h-80" />)}
            </div>
          </div>
        </div>
      </div>
    }>
      <CollegesContent />
    </Suspense>
  );
}

function CollegesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ states: [], types: [], cities: [] });

  // Filter state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "rating");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const limit = 6;

  // Fetch filters
  useEffect(() => {
    fetch("/api/colleges/filters")
      .then((r) => r.json())
      .then(setFilters)
      .catch(console.error);
  }, []);

  // Fetch colleges
  const fetchColleges = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (state) params.set("state", state);
    if (type) params.set("type", type);
    if (minRating) params.set("minRating", minRating);
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    try {
      const res = await fetch(`/api/colleges?${params}`);
      const data = await res.json();
      setColleges(data.colleges || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [search, state, type, sortBy, sortOrder, minRating, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchColleges, 300);
    return () => clearTimeout(timeout);
  }, [fetchColleges]);

  const totalPages = Math.ceil(total / limit);

  const resetFilters = () => {
    setSearch("");
    setState("");
    setType("");
    setMinRating("");
    setSortBy("rating");
    setSortOrder("desc");
    setPage(1);
  };

  return (
    <div className="flex min-h-screen max-w-screen-2xl mx-auto px-4 md:px-8 gap-8">
      {/* Sidebar Filters */}
      <aside className="hidden lg:block w-72 h-[calc(100vh-120px)] sticky top-24 overflow-y-auto pr-2 pb-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium text-on-surface mb-5">Filters</h2>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
              <input
                className="filter-input w-full pl-10 pr-4 py-3 rounded-lg text-sm"
                placeholder="Search colleges..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">State</label>
            <select
              className="filter-input w-full px-4 py-3 rounded-lg text-sm appearance-none"
              value={state}
              onChange={(e) => { setState(e.target.value); setPage(1); }}
            >
              <option value="">All States</option>
              {filters.states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Institute Type</label>
            <div className="flex flex-wrap gap-2">
              {["", ...filters.types].map((t) => (
                <button
                  key={t}
                  onClick={() => { setType(t); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${
                    type === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                  }`}
                >
                  {t || "All"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Minimum Rating</label>
            <div className="flex flex-wrap gap-2">
              {["", "3", "3.5", "4", "4.5"].map((r) => (
                <button
                  key={r}
                  onClick={() => { setMinRating(r); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${
                    minRating === r
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                  }`}
                >
                  {r ? `${r}+` : "Any"}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/20">
            <button
              onClick={resetFilters}
              className="w-full border border-outline-variant py-3 rounded-lg text-sm flex items-center justify-center gap-2 hover:border-secondary hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">restart_alt</span>
              Reset Filters
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <section className="flex-1 py-4 pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-2">Premium Colleges</h1>
            <p className="text-lg text-on-surface-variant">
              Discover {total} world-class institutions tailored for your career.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-on-surface-variant whitespace-nowrap">Sort by:</span>
            <select
              className="filter-input px-4 py-2 rounded-lg text-sm bg-transparent"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split("-");
                setSortBy(sb);
                setSortOrder(so);
                setPage(1);
              }}
            >
              <option value="rating-desc">Highest Rating</option>
              <option value="rating-asc">Lowest Rating</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="established-asc">Oldest First</option>
              <option value="established-desc">Newest First</option>
            </select>
          </div>
        </div>

        {/* Mobile search */}
        <div className="lg:hidden mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
            <input
              className="filter-input w-full pl-10 pr-4 py-3 rounded-lg text-sm"
              placeholder="Search colleges..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* College Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden animate-pulse">
                <div className="h-52 bg-surface-container-high" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-surface-container-high rounded w-3/4" />
                  <div className="h-4 bg-surface-container-high rounded w-1/2" />
                  <div className="h-10 bg-surface-container-high rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
            <p className="text-xl text-on-surface-variant">No colleges found matching your filters.</p>
            <button onClick={resetFilters} className="mt-4 text-primary hover:underline text-sm">Reset all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colleges.map((college) => {
              const fees = college.fees as Record<string, number> | null;
              const avgPkg = college.placements?.[0]?.avgPackage;
              const ranking = college.ranking as Record<string, number> | null;
              return (
                <div key={college.id} className="glass-card group rounded-xl overflow-hidden flex flex-col">
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary/20 via-surface-container to-secondary/10 flex items-center justify-center">
                    {college.banner ? (
                      <img src={college.banner} alt={college.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="material-symbols-outlined text-7xl text-primary/20 group-hover:scale-110 transition-transform duration-500">school</span>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className="bg-surface-container/90 backdrop-blur-md text-primary px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {college.rating}
                      </span>
                    </div>
                    {ranking?.nirf && (
                      <div className="absolute top-4 left-4 bg-surface-container/90 backdrop-blur-md px-3 py-1 rounded-full text-xs text-tertiary">
                        NIRF #{ranking.nirf}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{college.name}</h3>
                      </div>
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-lg">location_on</span>
                        <span className="text-sm">{college.city}, {college.state}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 border-y border-outline-variant/10 py-4">
                      <div>
                        <p className="text-xs text-outline mb-1 uppercase font-semibold">Annual Fees</p>
                        <p className="text-sm text-on-surface">
                          {fees?.btech ? `₹${(fees.btech / 100000).toFixed(1)} Lakhs` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-outline mb-1 uppercase font-semibold">Avg Package</p>
                        <p className="text-sm text-secondary">
                          {avgPkg ? `₹${avgPkg.toFixed(1)} LPA` : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto pt-3">
                      <Link href={`/colleges/${college.slug}`} className="block w-full primary-btn py-3 rounded-lg text-sm text-center font-bold">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="border border-outline-variant p-3 rounded-lg disabled:opacity-30 hover:border-primary transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-12 h-12 rounded-lg text-sm font-medium transition-colors ${
                      page === pageNum
                        ? "bg-primary/20 text-primary border border-primary/50"
                        : "border border-outline-variant hover:border-primary"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="border border-outline-variant p-3 rounded-lg disabled:opacity-30 hover:border-primary transition-colors"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
