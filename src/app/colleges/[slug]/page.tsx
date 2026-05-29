import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import SaveButton from "@/components/colleges/SaveButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const college = await prisma.college.findUnique({ where: { slug } });
  if (!college) return { title: "College Not Found" };

  const ranking = college.ranking as Record<string, number> | null;
  const fees = college.fees as Record<string, number> | null;

  return {
    title: `${college.name} — Admissions, Fees, Placements | CampusCompass`,
    description: `${college.name} in ${college.city}, ${college.state}. ${ranking?.nirf ? `NIRF Rank #${ranking.nirf}. ` : ""}Rating: ${college.rating}/5. ${fees?.btech ? `B.Tech fees: ₹${(fees.btech / 100000).toFixed(1)}L/yr. ` : ""}${college.description?.slice(0, 120) || ""}`,
    openGraph: {
      title: `${college.name} | CampusCompass`,
      description: college.description || `Explore ${college.name} — admissions, courses, placements & reviews.`,
      images: college.banner ? [{ url: college.banner, width: 800, height: 400, alt: college.name }] : [],
      type: "website",
    },
    keywords: [college.name, college.city, college.state, college.type, "admissions", "placements", "fees", "engineering"],
  };
}
export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const college = await prisma.college.findUnique({
    where: { slug },
    include: {
      courses: true,
      placements: { orderBy: { year: "desc" }, take: 1 },
      reviews: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!college) notFound();

  const fees = college.fees as Record<string, number> | null;
  const ranking = college.ranking as Record<string, number> | null;
  const highlights = college.highlights as Record<string, unknown> | null;
  const placement = college.placements[0];

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: college.name,
    url: college.website || undefined,
    address: { "@type": "PostalAddress", addressLocality: college.city, addressRegion: college.state, addressCountry: "IN" },
    description: college.description || undefined,
    foundingDate: college.established ? `${college.established}` : undefined,
    aggregateRating: { "@type": "AggregateRating", ratingValue: college.rating, bestRating: 5, worstRating: 1 },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-primary/30 via-surface-container to-secondary/20 h-64 md:h-80">
        {college.banner ? (
          <img src={college.banner} alt={college.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-[120px] text-primary/15">school</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-surface-container-lowest/90 to-transparent">
          {college.type && (
            <span className="inline-block bg-primary-container/80 text-on-primary-container text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {college.type}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{college.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">location_on</span>
              {college.location || `${college.city}, ${college.state}`}
            </span>
            <span className="flex items-center gap-1 text-secondary">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              {college.rating}/5.0
            </span>
            {ranking?.nirf && (
              <span className="text-tertiary font-semibold">NIRF #{ranking.nirf}</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/compare" className="primary-btn px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">compare_arrows</span>
          Compare
        </Link>
        <SaveButton collegeId={college.id} collegeName={college.name} />
        {college.website && (
          <a href={college.website} target="_blank" rel="noopener noreferrer" className="border border-outline-variant px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 hover:border-secondary hover:text-secondary transition-colors">
            <span className="material-symbols-outlined text-lg">open_in_new</span>
            Visit Website
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="glass-card p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              Overview
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-6">{college.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-low/50 p-4 rounded-lg text-center">
                <p className="text-xs text-outline uppercase mb-1">Established</p>
                <p className="text-lg font-bold">{college.established || "—"}</p>
              </div>
              <div className="bg-surface-container-low/50 p-4 rounded-lg text-center">
                <p className="text-xs text-outline uppercase mb-1">Affiliation</p>
                <p className="text-sm font-medium">{college.affiliation || "—"}</p>
              </div>
              <div className="bg-surface-container-low/50 p-4 rounded-lg text-center">
                <p className="text-xs text-outline uppercase mb-1">B.Tech Fees</p>
                <p className="text-lg font-bold text-secondary">{fees?.btech ? `₹${(fees.btech / 100000).toFixed(1)}L` : "—"}</p>
              </div>
              <div className="bg-surface-container-low/50 p-4 rounded-lg text-center">
                <p className="text-xs text-outline uppercase mb-1">Campus</p>
                <p className="text-sm font-medium">{highlights?.campusSize as string || "—"}</p>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="glass-card p-6 md:p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">menu_book</span>
              Courses Offered ({college.courses.length})
            </h2>
            <div className="space-y-3">
              {college.courses.map((course) => (
                <div key={course.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-surface-container-low/30 border border-outline-variant/10 hover:border-primary/30 transition-colors">
                  <div>
                    <h4 className="font-medium">{course.name}</h4>
                    <p className="text-sm text-on-surface-variant">{course.degree} • {course.duration}</p>
                  </div>
                  <div className="flex items-center gap-6 mt-2 md:mt-0">
                    <div className="text-right">
                      <p className="text-xs text-outline uppercase">Fees</p>
                      <p className="text-sm text-secondary font-medium">₹{((course.fees || 0) / 100000).toFixed(1)}L/{course.feesType || "yr"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-outline uppercase">Seats</p>
                      <p className="text-sm font-medium">{course.seats || "—"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-outline uppercase">Eligibility</p>
                      <p className="text-sm text-tertiary font-medium">{course.eligibility || "—"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Placements */}
          {placement && (
            <div className="glass-card p-6 md:p-8 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">trending_up</span>
                Placements {placement.year}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-surface-container-low/50 p-4 rounded-lg text-center">
                  <p className="text-xs text-outline uppercase mb-1">Avg Package</p>
                  <p className="text-2xl font-bold text-secondary">₹{placement.avgPackage?.toFixed(1)}L</p>
                </div>
                <div className="bg-surface-container-low/50 p-4 rounded-lg text-center">
                  <p className="text-xs text-outline uppercase mb-1">Highest Package</p>
                  <p className="text-2xl font-bold text-tertiary">₹{placement.highestPackage?.toFixed(1)}L</p>
                </div>
                <div className="bg-surface-container-low/50 p-4 rounded-lg text-center">
                  <p className="text-xs text-outline uppercase mb-1">Median Package</p>
                  <p className="text-2xl font-bold text-primary">₹{placement.medianPackage?.toFixed(1)}L</p>
                </div>
                <div className="bg-surface-container-low/50 p-4 rounded-lg text-center">
                  <p className="text-xs text-outline uppercase mb-1">Placed</p>
                  <p className="text-2xl font-bold text-on-surface">{placement.placementPercentage?.toFixed(0)}%</p>
                </div>
              </div>

              {placement.topRecruiters && (
                <div>
                  <h4 className="text-sm text-on-surface-variant mb-3 font-medium">Top Recruiters</h4>
                  <div className="flex flex-wrap gap-2">
                    {(placement.topRecruiters as string[]).map((rec) => (
                      <span key={rec} className="px-3 py-1.5 rounded-full bg-surface-container-high text-xs font-medium border border-outline-variant/20">
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">Rating</span>
                <span className="text-sm font-bold text-secondary">{college.rating}/5.0</span>
              </div>
              {ranking?.nirf && (
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">NIRF Rank</span>
                  <span className="text-sm font-bold text-tertiary">#{ranking.nirf}</span>
                </div>
              )}
              {ranking?.qs && (
                <div className="flex justify-between">
                  <span className="text-sm text-on-surface-variant">QS Rank</span>
                  <span className="text-sm font-bold">#{ranking.qs}</span>
                </div>
              )}
              {placement && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-on-surface-variant">Avg Package</span>
                    <span className="text-sm font-bold text-secondary">₹{placement.avgPackage?.toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-on-surface-variant">Placement %</span>
                    <span className="text-sm font-bold">{placement.placementPercentage?.toFixed(0)}%</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">Courses</span>
                <span className="text-sm font-bold">{college.courses.length}</span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">reviews</span>
              Reviews
            </h3>
            {college.reviews.length > 0 ? (
              <div className="space-y-4">
                {college.reviews.map((review) => (
                  <div key={review.id} className="border-b border-outline-variant/10 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-on-surface-variant text-lg">person</span>
                      <div className="flex text-tertiary text-sm">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    {review.title && <p className="text-sm font-medium mb-1">{review.title}</p>}
                    <p className="text-xs text-on-surface-variant">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No reviews yet. Be the first to share your experience!</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
