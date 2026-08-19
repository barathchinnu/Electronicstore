import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import ProductGrid from '../components/ProductGrid';
import { getProducts } from '../services/productService';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [input, setInput] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setInput(q);
    if (!q) { setResults([]); return; }
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getProducts({ keyword: q, limit: 20 });
        setResults(data.data || []);
        setTotal(data.pagination?.total || 0);
      } catch { setResults([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) setSearchParams({ q: input.trim() });
  };

  return (
    <div className="page-wrapper pt-4 pb-16 md:pb-8">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4">
        {/* Search Bar Container */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="input-light w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-[#2874f0] hover:bg-[#1a64db] text-white px-5 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results Header */}
        {query && (
          <div className="mb-4">
            {!loading && (
              <p className="text-slate-600 text-xs sm:text-sm font-semibold">
                {total > 0 ? `Found ${total} result${total > 1 ? 's' : ''} for "${query}"` : `No results found for "${query}"`}
              </p>
            )}
          </div>
        )}

        {!query ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
            <div className="text-6xl mb-3">🔍</div>
            <h2 className="text-xl font-extrabold font-display text-slate-900 mb-2">Search Insta Digital Shopping</h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">Find bluetooth earbuds, wireless headphones, smartwatches, fast chargers and more.</p>
          </div>
        ) : (
          <ProductGrid products={results} loading={loading} loadingCount={8} emptyMessage={`No products match your search query "${query}".`} />
        )}
      </div>
    </div>
  );
}

