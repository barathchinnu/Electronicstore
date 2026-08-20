import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';

// Emoji mapping for display
const emojiMap = {
  mobiles: '📱', phones: '📱', smartphones: '📱',
  earphones: '🎧', headphones: '🎧', earbuds: '🎧',
  'smart watches': '⌚', smartwatches: '⌚', watches: '⌚',
  laptops: '💻', computers: '🖥️',
  keyboards: '⌨️',
  mouse: '🖱️', accessories: '🖱️', 'laptop accessories': '🖱️',
  'power banks': '🔋', powerbanks: '🔋',
  chargers: '🔌', cables: '🔌',
  speakers: '🔊', soundbars: '🔊',
  cameras: '📷',
  tablets: '📱',
  gaming: '🎮',
  electronics: '💻',
};

function getEmoji(name = '') {
  return emojiMap[name.toLowerCase()] || '📦';
}

// Convert slug like "smart-watches" → "Smart Watches"
function slugToName(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [catInfo, setCatInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setProducts([]);

      try {
        // Convert slug → human name (e.g. "smart-watches" → "Smart Watches")
        const catName = slugToName(category);

        // Fetch categories and products in parallel
        const [prodRes, catRes] = await Promise.all([
          getProducts({ category: catName, limit: 40 }),
          getCategories(),
        ]);

        const fetchedProducts = prodRes.data.data || [];
        setProducts(fetchedProducts);
        setTotal(prodRes.data.pagination?.total || fetchedProducts.length);

        // Find matching category info from DB
        const allCats = catRes.data.data || [];
        const found = allCats.find(
          (c) =>
            c.slug === category ||
            c.name.toLowerCase() === catName.toLowerCase() ||
            c.name.toLowerCase().replace(/\s+/g, '-') === category
        );

        setCatInfo(
          found
            ? { name: found.name, icon: found.icon || getEmoji(found.name), description: found.description }
            : { name: catName, icon: getEmoji(catName) }
        );
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  return (
    <div className="page-wrapper pt-4 pb-16 md:pb-8">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-xs mb-6"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
            <Link to="/" className="hover:text-[#2874f0]">Home</Link>
            <span>/</span>
            <span className="text-slate-800">{catInfo?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">{catInfo?.icon || '📦'}</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
                {catInfo?.name}
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                {loading ? 'Loading...' : `${total} product${total !== 1 ? 's' : ''} available`}
              </p>
            </div>
          </div>
          {catInfo?.description && (
            <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
              {catInfo.description}
            </p>
          )}
        </motion.div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          loadingCount={12}
          emptyMessage={`No products found in "${catInfo?.name || 'this category'}" yet.`}
        />
      </div>
    </div>
  );
}
