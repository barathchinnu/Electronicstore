import ProductCard from './ProductCard';
import Loading from './Loading';

export default function ProductGrid({
  products = [],
  loading = false,
  loadingCount = 8,
  emptyMessage = 'No products found.',
}) {
  if (loading) {
    return <Loading count={loadingCount} />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <div className="text-4xl mb-3">📦</div>
        <p className="text-slate-500 font-medium text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
