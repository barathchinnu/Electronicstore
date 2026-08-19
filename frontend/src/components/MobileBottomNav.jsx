import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiShoppingCart, FiHeart, FiUser } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const tabs = [
  { to: '/', icon: FiHome, label: 'Home' },
  { to: '/search', icon: FiSearch, label: 'Search' },
  { to: '/cart', icon: FiShoppingCart, label: 'Cart' },
  { to: '/wishlist', icon: FiHeart, label: 'Wishlist' },
  { to: '/profile', icon: FiUser, label: 'Account' },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();

  const getBadge = (to) => {
    if (to === '/cart' && cartCount > 0) return cartCount;
    if (to === '/wishlist' && wishlist.length > 0) return wishlist.length;
    return null;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-200 shadow-lg">
      <div className="px-2 py-1">
        <div className="flex items-center justify-around">
          {tabs.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            const badge = getBadge(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all min-w-[3.5rem] relative ${
                  active ? 'text-[#2874f0]' : 'text-slate-500'
                }`}
              >
                {badge && (
                  <span className="absolute top-0.5 right-2 w-4 h-4 bg-[#ffe500] text-[#212121] text-[9px] rounded-full flex items-center justify-center font-bold border border-yellow-500">
                    {badge}
                  </span>
                )}
                <Icon className={`text-lg ${active ? 'text-[#2874f0]' : ''}`} />
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
