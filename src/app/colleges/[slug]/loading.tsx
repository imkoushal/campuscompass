export default function Loading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
      <div className="animate-pulse">
        {/* Hero skeleton */}
        <div className="rounded-2xl bg-surface-container-high h-64 md:h-80 mb-8" />

        {/* Action buttons skeleton */}
        <div className="flex gap-3 mb-8">
          <div className="h-10 w-32 bg-surface-container-high rounded-lg" />
          <div className="h-10 w-36 bg-surface-container-high rounded-lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Overview skeleton */}
            <div className="glass-card p-8 rounded-xl space-y-4">
              <div className="h-6 w-32 bg-surface-container-high rounded" />
              <div className="h-4 w-full bg-surface-container-high rounded" />
              <div className="h-4 w-3/4 bg-surface-container-high rounded" />
              <div className="grid grid-cols-4 gap-4 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-surface-container-high rounded-lg" />
                ))}
              </div>
            </div>
            {/* Courses skeleton */}
            <div className="glass-card p-8 rounded-xl space-y-3">
              <div className="h-6 w-48 bg-surface-container-high rounded" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-surface-container-high rounded-lg" />
              ))}
            </div>
          </div>
          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-xl space-y-4">
              <div className="h-6 w-32 bg-surface-container-high rounded" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-5 bg-surface-container-high rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
