import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
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
    <div className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search for products, brands, categories..."
              className="input-dark w-full pl-11 py-3.5 text-base"
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary px-6">Search</button>
        </form>

        {/* Results */}
        {query && (
          <div className="mb-4">
            {loading ? null : (
              <p className="text-slate-400 text-sm">
                {total > 0 ? `Found ${total} results for "${query}"` : `No results found for "${query}"`}
              </p>
            )}
          </div>
        )}

        {!query ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">Search ElectroStore</h2>
            <p className="text-slate-400">Find earphones, headphones, smartwatches, and more...</p>
          </div>
        ) : loading ? (
          <Loading count={8} />
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Nothing found</h3>
            <p className="text-slate-400 mb-6">Try different keywords or browse our categories.</p>
            <Link to="/products" className="btn-primary">Browse All Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
