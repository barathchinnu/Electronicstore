export default function Loading({ count = 8, type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="product-card overflow-hidden">
            <div className="skeleton aspect-square rounded-t-xl" />
            <div className="p-3 space-y-2">
              <div className="skeleton h-3 w-2/3 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-4/5 rounded" />
              <div className="skeleton h-5 w-1/2 rounded" />
              <div className="flex gap-1.5">
                <div className="skeleton h-7 flex-1 rounded-lg" />
                <div className="skeleton h-7 flex-1 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-4 flex gap-4 items-center">
            <div className="skeleton w-16 h-16 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-2/3 rounded" />
              <div className="skeleton h-3 w-1/3 rounded" />
            </div>
            <div className="skeleton h-8 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
