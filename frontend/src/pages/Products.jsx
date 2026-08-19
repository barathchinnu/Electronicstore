import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import ProductGrid from '../components/ProductGrid';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';

const brands = ['boAt', 'Sony', 'JBL', 'Noise', 'Samsung', 'Apple', 'Razer', 'Logitech', 'Anker', 'Mi', 'Realme'];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'discount', label: 'Highest Discount' },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    featured: searchParams.get('featured') || '',
    bestSeller: searchParams.get('bestSeller') || '',
    flashDeal: searchParams.get('flashDeal') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data.data || []));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { ...filters, page, limit: 12 };
        Object.keys(params).forEach((k) => !params[k] && delete params[k]);
        const { data } = await getProducts(params);
        setProducts(data.data || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.pages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, page]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', rating: '', featured: '', bestSeller: '', flashDeal: '', sort: 'newest' });
    setPage(1);
  };

  const activeFiltersCount = [filters.category, filters.brand, filters.minPrice, filters.maxPrice, filters.rating, filters.featured, filters.bestSeller, filters.flashDeal]
    .filter(Boolean).length;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.name}
                onChange={() => updateFilter('category', filters.category === cat.name ? '' : cat.name)}
                className="accent-blue-600 cursor-pointer"
              />
              <span className="text-slate-700 text-xs font-medium group-hover:text-blue-600 transition-colors">
                {cat.icon} {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Brand</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brand === brand}
                onChange={() => updateFilter('brand', filters.brand === brand ? '' : brand)}
                className="accent-blue-600 cursor-pointer"
              />
              <span className="text-slate-700 text-xs font-medium group-hover:text-blue-600 transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="input-light text-xs"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="input-light text-xs"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Min Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === String(r)}
                onChange={() => updateFilter('rating', filters.rating === String(r) ? '' : String(r))}
                className="accent-blue-600 cursor-pointer"
              />
              <span className="text-slate-700 text-xs font-medium group-hover:text-blue-600">{'⭐'.repeat(r)} & above</span>
            </label>
          ))}
        </div>
      </div>

      {/* Special */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Special</h4>
        <div className="space-y-2">
          {[
            { key: 'featured', label: '✨ Featured' },
            { key: 'bestSeller', label: '⭐ Best Sellers' },
            { key: 'flashDeal', label: '🔥 Flash Deals' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters[key] === 'true'}
                onChange={() => updateFilter(key, filters[key] === 'true' ? '' : 'true')}
                className="accent-blue-600 cursor-pointer"
              />
              <span className="text-slate-700 text-xs font-medium group-hover:text-blue-600">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <button onClick={clearFilters} className="w-full py-2 rounded-lg border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-all cursor-pointer">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="page-wrapper pt-4 pb-16 md:pb-8">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">All Products</h1>
            <p className="text-slate-500 text-xs mt-0.5">{total} products found</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="input-light pr-8 text-xs font-semibold appearance-none cursor-pointer bg-white"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
            </div>
            {/* Mobile Filter Button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-xs font-bold text-slate-700 border border-slate-200 relative shadow-xs"
            >
              <FiFilter className="text-xs" /> Filter
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{activeFiltersCount}</span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-4 sm:gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs sticky top-24">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="badge bg-blue-50 text-blue-600 border border-blue-200">{activeFiltersCount} active</span>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={products} loading={loading} loadingCount={12} emptyMessage="No products match your selected filters." />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                      p === page
                        ? 'bg-[#2874f0] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {filterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl border-r border-slate-200 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Filter Products</h3>
                <button onClick={() => setFilterOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                  <FiX className="text-base" />
                </button>
              </div>
              <div className="p-4">
                <FilterPanel />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

