import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCategories } from '../services/categoryService';

// Static fallback items shown while loading or if DB has no categories
const staticFallbacks = [
  { id: 'for-you', name: 'For You', icon: '✨', slug: '' },
  { id: 'mobiles', name: 'Mobiles', icon: '📱', slug: 'mobiles' },
  { id: 'electronics', name: 'Electronics', icon: '💻', slug: 'electronics' },
  { id: 'earphones', name: 'Earphones', icon: '🎧', slug: 'earphones' },
  { id: 'smart-watches', name: 'Smart Watches', icon: '⌚', slug: 'smart-watches' },
  { id: 'laptops', name: 'Laptops', icon: '💻', slug: 'laptops' },
  { id: 'keyboards', name: 'Keyboards', icon: '⌨️', slug: 'keyboards' },
  { id: 'power-banks', name: 'Power Banks', icon: '🔋', slug: 'power-banks' },
  { id: 'chargers', name: 'Chargers', icon: '🔌', slug: 'chargers' },
  { id: 'accessories', name: 'Accessories', icon: '🖱️', slug: 'laptop-accessories' },
];

// Emoji mapping for common category names
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
  const lower = name.toLowerCase();
  return emojiMap[lower] || '📦';
}

export default function CategoryBar() {
  const location = useLocation();
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then(({ data }) => {
        const cats = (data.data || []).map((c) => ({
          id: c._id,
          name: c.name,
          icon: c.icon || getEmoji(c.name),
          slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
        }));
        if (cats.length > 0) setDbCategories(cats);
      })
      .catch(() => {}); // silently fail — use static fallback
  }, []);

  // If DB categories loaded, prepend "For You" and use them; else use static fallback
  const displayCategories =
    dbCategories.length > 0
      ? [{ id: 'for-you', name: 'For You', icon: '✨', slug: '' }, ...dbCategories]
      : staticFallbacks;

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 hide-scrollbar scroll-smooth">
          {displayCategories.map((cat) => {
            // "For You" is active on home root
            const isActive =
              cat.slug === ''
                ? location.pathname === '/' && !location.search
                : location.pathname.includes(cat.slug) ||
                  location.search.includes(`category=${cat.slug}`);

            // Route: empty slug → home, otherwise → category page
            const targetUrl =
              cat.slug === '' ? '/' : `/category/${cat.slug}`;

            return (
              <Link
                key={cat.id}
                to={targetUrl}
                className={`flex flex-col items-center justify-center flex-shrink-0 px-2 sm:px-3 py-1 rounded-md transition-all group min-w-[72px] sm:min-w-[84px] text-center ${
                  isActive ? 'border-b-2 border-[#2874f0]' : ''
                }`}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 group-hover:bg-blue-50 transition-all shadow-xs">
                  {cat.icon}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-medium mt-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-[#2874f0] font-bold'
                      : 'text-slate-700 group-hover:text-[#2874f0]'
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
