import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { formatCurrency } from '../utils/formatCurrency';

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
  const [searchParams, setSearchParams] = useSearchParams();
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
        <h4 className="text-sm font-semibold text-white mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.name}
                onChange={() => updateFilter('category', filters.category === cat.name ? '' : cat.name)}
                className="accent-blue-500"
              />
              <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
                {cat.icon} {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">Brand</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brand === brand}
                onChange={() => updateFilter('brand', filters.brand === brand ? '' : brand)}
                className="accent-blue-500"
              />
              <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="input-dark text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="input-dark text-sm"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">Min Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === String(r)}
                onChange={() => updateFilter('rating', filters.rating === String(r) ? '' : String(r))}
                className="accent-blue-500"
              />
              <span className="text-slate-300 text-sm group-hover:text-white">{'⭐'.repeat(r)} & above</span>
            </label>
          ))}
        </div>
      </div>

      {/* Special */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">Special</h4>
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
                className="accent-blue-500"
              />
              <span className="text-slate-300 text-sm group-hover:text-white">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <button onClick={clearFilters} className="w-full py-2 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-all">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">All Products</h1>
            <p className="text-slate-400 text-sm mt-1">{total} products found</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="input-dark pr-8 text-sm appearance-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm" />
            </div>
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 glass rounded-xl text-sm text-slate-300 hover:text-white border border-white/10 relative"
            >
              <FiFilter className="text-sm" /> Filter
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">{activeFiltersCount}</span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="glass rounded-2xl p-5 border border-white/5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white text-sm">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="badge bg-blue-500/20 text-blue-400">{activeFiltersCount}</span>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <Loading count={12} />
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-slate-400 text-sm mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                          p === page
                            ? 'bg-blue-600 text-white'
                            : 'glass text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
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
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute left-0 top-0 bottom-0 w-72 glass border-r border-white/10 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Filters</h3>
                <button onClick={() => setFilterOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                  <FiX className="text-white" />
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
