import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
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
    <div className="page-wrapper pt-4 pb-16 md:pb-8">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4">
        {/* Header Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-xs mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
            <Link to="/" className="hover:text-[#2874f0]">Home</Link>
            <span>/</span>
            <span className="text-slate-800">{catInfo?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">{catInfo?.icon || '📦'}</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">{catInfo?.name}</h1>
              <p className="text-slate-500 text-xs mt-0.5">{total} products available</p>
            </div>
          </div>
          {catInfo?.description && (
            <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed">{catInfo.description}</p>
          )}
        </motion.div>

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} loadingCount={12} emptyMessage="No products found in this category yet." />
      </div>
    </div>
  );
}

