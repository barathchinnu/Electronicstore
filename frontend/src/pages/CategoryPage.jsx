import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [catInfo, setCatInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const catName = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const [prodRes, catRes] = await Promise.all([
          getProducts({ category: catName, limit: 20 }),
          getCategories(),
        ]);
        setProducts(prodRes.data.data || []);
        setTotal(prodRes.data.pagination?.total || 0);
        const found = (catRes.data.data || []).find(c => c.slug === category || c.name.toLowerCase().replace(/\s+/g, '-') === category);
        setCatInfo(found || { name: catName, icon: '📦' });
      } catch { setProducts([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [category]);

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link to="/" className="hover:text-blue-400">Home</Link>
            <span>/</span>
            <span className="text-white">{catInfo?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{catInfo?.icon || '📦'}</span>
            <div>
              <h1 className="text-2xl font-bold font-display text-white">{catInfo?.name}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{total} products found</p>
            </div>
          </div>
          {catInfo?.description && (
            <p className="text-slate-400 text-sm mt-3 max-w-2xl">{catInfo.description}</p>
          )}
        </motion.div>

        {loading ? (
          <Loading count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">No products in this category</h3>
            <p className="text-slate-400 mb-6">Check back soon for new arrivals.</p>
            <Link to="/products" className="btn-primary">Browse All Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
