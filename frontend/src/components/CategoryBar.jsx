import { Link, useLocation } from 'react-router-dom';

const categoryItems = [
  { id: 'for-you', name: 'For You', icon: '✨', slug: '' },
  { id: 'fashion', name: 'Fashion', icon: '👕', slug: 'fashion' },
  { id: 'mobiles', name: 'Mobiles', icon: '📱', slug: 'mobiles' },
  { id: 'electronics', name: 'Electronics', icon: '💻', slug: 'electronics' },
  { id: 'beauty', name: 'Beauty', icon: '💄', slug: 'beauty' },
  { id: 'home', name: 'Home', icon: '🛋️', slug: 'home' },
  { id: 'appliances', name: 'Appliances', icon: '📺', slug: 'appliances' },
  { id: 'toys', name: 'Toys, Baby', icon: '🧸', slug: 'toys' },
  { id: 'food', name: 'Food & Health', icon: '🧴', slug: 'food' },
  { id: 'auto', name: 'Auto Acc', icon: '🏎️', slug: 'auto' },
  { id: 'sports', name: 'Sports & Fitness', icon: '🏏', slug: 'sports' },
  { id: 'furniture', name: 'Furniture', icon: '🪑', slug: 'furniture' },
  { id: 'books', name: 'Books & More', icon: '📚', slug: 'books' },
  { id: '2wheelers', name: '2 Wheelers', icon: '🛵', slug: '2-wheelers' },
];

export default function CategoryBar() {
  const location = useLocation();

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 hide-scrollbar scroll-smooth">
          {categoryItems.map((cat) => {
            const isActive = cat.slug === '' 
              ? location.pathname === '/' && !location.search 
              : location.pathname.includes(cat.slug);

            const targetUrl = cat.slug === '' ? '/' : `/category/${cat.slug}`;

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
                <span className={`text-[11px] sm:text-xs font-medium mt-1.5 whitespace-nowrap ${
                  isActive ? 'text-[#2874f0] font-bold' : 'text-slate-700 group-hover:text-[#2874f0]'
                }`}>
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
