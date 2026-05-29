import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  const colleges = await prisma.college.findMany({
    take: 4,
    orderBy: { rating: "desc" },
    include: { placements: { where: { year: 2024 }, take: 1 } },
  });

  const totalColleges = await prisma.college.count();

  return (
    <>
      {/* Hero Section */}
      <header className="relative py-20 md:py-32 px-4 md:px-8 min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="glow-orb bg-primary w-[500px] h-[500px] -top-20 -left-20" />
        <div className="glow-orb bg-secondary w-[400px] h-[400px] bottom-0 right-0" />

        <div className="max-w-4xl text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-on-surface to-on-surface-variant bg-clip-text text-transparent leading-tight animate-fade-in-up">
            Find Your Perfect College
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 animate-fade-in-up animate-fade-in-up-delay-1">
            Navigate the complex world of higher education with data-driven insights.
            Compare top universities and secure your future with precision tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animate-fade-in-up-delay-2">
            <Link href="/colleges" className="primary-btn px-8 py-3 rounded-lg text-sm shadow-lg shadow-primary/20">
              Explore Colleges
            </Link>
            <Link href="/compare" className="border border-outline-variant bg-surface-variant/20 backdrop-blur-sm text-on-surface px-8 py-3 rounded-lg text-sm hover:bg-surface-variant/40 transition-all">
              Compare
            </Link>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="relative w-full max-w-4xl mt-16 flex justify-center gap-4 flex-wrap animate-fade-in-up animate-fade-in-up-delay-3">
          <div className="glass-card p-5 rounded-xl shadow-2xl animate-float max-w-[220px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase">TOP RATED</span>
            </div>
            <h4 className="font-bold mb-1">IIT Madras</h4>
            <div className="text-2xl font-medium text-secondary">4.9/5.0</div>
          </div>

          <div className="glass-card p-5 rounded-xl shadow-2xl animate-float-delay max-w-[220px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-secondary">payments</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase">AVG PACKAGE</span>
            </div>
            <h4 className="font-bold mb-1">B.Tech CS</h4>
            <div className="text-2xl font-medium text-primary">₹21.8 LPA</div>
          </div>

          <div className="glass-card p-5 rounded-xl shadow-2xl animate-float-delay-2 max-w-[220px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-tertiary">trending_up</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase">PLACEMENT</span>
            </div>
            <h4 className="font-bold mb-1">Recent Season</h4>
            <div className="text-2xl font-medium text-tertiary">94.5%</div>
          </div>
        </div>
      </header>

      {/* Trust Stats */}
      <section className="py-16 px-4 md:px-8 bg-surface-container-low/50">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{totalColleges}+</div>
            <div className="text-sm text-on-surface-variant">Listed Colleges</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">1000+</div>
            <div className="text-sm text-on-surface-variant">Verified Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-tertiary mb-2">50k+</div>
            <div className="text-sm text-on-surface-variant">Monthly Applicants</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-on-surface mb-2">120+</div>
            <div className="text-sm text-on-surface-variant">Career Paths</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto">
        <h2 className="text-2xl font-medium text-center mb-16">Everything you need to decide.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "explore", color: "primary", title: "Discovery", desc: "Smart filters to find colleges matching your rank, budget, and location preferences." },
            { icon: "compare_arrows", color: "secondary", title: "Comparison", desc: "Side-by-side technical breakdown of placement records and infrastructure metrics." },
            { icon: "insights", color: "tertiary", title: "Insights", desc: "Data-driven reports on industry demand and alumni salary distributions." },
            { icon: "bookmark", color: "on-surface", title: "Favorites", desc: "Save and monitor your top-choice institutions for quick access." },
          ].map((f) => (
            <div key={f.title} className="glass-card p-6 rounded-xl group hover:border-primary/50 transition-colors">
              <div className={`w-12 h-12 bg-${f.color}/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className={`material-symbols-outlined text-${f.color} text-2xl`}>{f.icon}</span>
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-on-surface-variant">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-16 px-4 md:px-8 max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-2xl font-medium mb-2">Featured Institutions</h2>
            <p className="text-on-surface-variant text-sm">Explore elite campuses with high national rankings.</p>
          </div>
          <Link href="/colleges" className="text-primary text-sm hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {colleges.map((college) => {
            const fees = college.fees as Record<string, number> | null;
            const avgPkg = college.placements[0]?.avgPackage;
            return (
              <Link key={college.id} href={`/colleges/${college.slug}`} className="glass-card rounded-xl overflow-hidden group block">
                <div className="h-48 w-full relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
                  {college.banner ? (
                    <img src={college.banner} alt={college.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="material-symbols-outlined text-6xl text-primary/30">school</span>
                  )}
                  <div className="absolute top-3 right-3 bg-surface-container/90 backdrop-blur-md px-3 py-1 rounded text-xs font-semibold">
                    {college.type}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{college.name}</h3>
                  <p className="text-xs text-on-surface-variant mb-4">{college.city}, {college.state}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary">{college.rating} ★</span>
                    <span className="text-on-surface-variant">
                      {avgPkg ? `Avg ₹${avgPkg.toFixed(0)}L` : fees?.btech ? `₹${(fees.btech / 100000).toFixed(1)}L/yr` : ""}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="glow-orb bg-primary/20 w-[600px] h-[600px] -top-64 left-1/2 -translate-x-1/2" />
        <div className="max-w-4xl mx-auto glass-card p-12 md:p-16 rounded-2xl text-center relative z-10 border-primary/20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to start your journey?</h2>
          <p className="text-lg text-on-surface-variant mb-8">
            Join thousands of students who have found their dream campus using CampusCompass.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="bg-primary text-on-primary px-8 py-3 rounded-lg text-sm font-bold shadow-xl shadow-primary/30 hover:brightness-110 transition-all">
              Get Early Access
            </Link>
            <Link href="/colleges" className="border border-outline-variant text-on-surface px-8 py-3 rounded-lg text-sm hover:bg-surface-variant/20 transition-all">
              Explore Colleges
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
