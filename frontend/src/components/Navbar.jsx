import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingCart, FiHeart, FiSearch, FiMenu, FiX, FiUser,
  FiLogOut, FiSettings, FiPackage, FiChevronDown, FiMapPin, FiNavigation
} from 'react-icons/fi';
import { MdElectricBolt } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/productService';
import CategoryBar from './CategoryBar';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('flipkart');

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, logoutUser } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchResults([]);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Live search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const { data } = await getProducts({ keyword: searchQuery, limit: 5 });
        setSearchResults(data.data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Flipkart Utility Banner Bar */}
      <div className="bg-[#f0f5ff] border-b border-slate-200 text-xs py-1 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Left Pill Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('flipkart')}
              className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full font-bold text-xs transition-all ${
                activeTab === 'flipkart'
                  ? 'bg-[#ffe500] text-[#212121] shadow-xs'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <MdElectricBolt className="text-yellow-600 text-sm" />
              <span>Flipkart</span>
            </button>
            <button
              onClick={() => setActiveTab('travel')}
              className={`flex items-center gap-1 px-3 py-0.5 rounded-full font-medium text-xs transition-all ${
                activeTab === 'travel'
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
              }`}
            >
              <FiNavigation className="text-xs" />
              <span>Travel</span>
            </button>
          </div>

          {/* Right Location Selector */}
          <div className="hidden sm:flex items-center gap-1 text-slate-600 font-medium text-xs hover:text-[#2874f0] cursor-pointer transition-colors">
            <FiMapPin className="text-[#2874f0] text-sm" />
            <span>Location not set</span>
            <span className="text-[#2874f0] font-semibold underline ml-1">Select delivery location &gt;</span>
          </div>
        </div>
      </div>

      {/* Main Flipkart Header Row */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-lg bg-[#ffe500] border border-yellow-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <MdElectricBolt className="text-[#2874f0] text-2xl" />
            </div>
            <div className="leading-tight">
              <span className="text-lg font-black tracking-tight text-[#2874f0] font-display flex items-center gap-1">
                Flipkart <span className="text-xs text-yellow-600 italic font-bold">Plus</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium -mt-1 tracking-wide">
                Insta Digital Shopping
              </p>
            </div>
          </Link>

          {/* Main Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative hidden md:block">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 text-lg">
                <FiSearch />
              </div>
              <input
                type="text"
                placeholder="Search for Products, Brands and More"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                className="w-full bg-[#f0f5ff] text-slate-800 text-sm pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2874f0] focus:bg-white transition-all shadow-inner placeholder:text-slate-400"
              />
            </form>

            {/* Live Search Popup */}
            <AnimatePresence>
              {searchOpen && (searchResults.length > 0 || searching) && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 top-12 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                >
                  {searching ? (
                    <div className="p-4 text-center text-slate-500 text-sm">Searching Flipkart inventory...</div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {searchResults.map((product) => (
                        <Link
                          key={product._id}
                          to={`/products/${product._id}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50/60 transition-colors"
                        >
                          <img
                            src={product.images?.[0]?.url || 'https://placehold.co/100x100?text=Product'}
                            alt={product.name}
                            className="w-10 h-10 rounded-md object-cover bg-slate-100 border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                            <p className="text-xs text-slate-500">{product.brand || 'ElectroStore'}</p>
                          </div>
                          <span className="text-sm font-bold text-[#2874f0]">
                            ₹{product.price?.toLocaleString('en-IN')}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Right Nav Buttons */}
          <div className="hidden md:flex items-center gap-3 sm:gap-5">
            {/* Login Menu Dropdown */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#2874f0] text-white hover:bg-[#1a64db] transition-all text-sm font-semibold shadow-xs"
              >
                <FiUser className="text-base" />
                <span>{user ? user.name?.split(' ')[0] : 'Login'}</span>
                <FiChevronDown className={`text-xs transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 top-11 w-56 bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden z-50"
                  >
                    {user ? (
                      <div className="p-2">
                        <div className="px-3 py-2 bg-blue-50/80 rounded-md mb-1 border border-blue-100">
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <FiSettings className="text-slate-500" /> My Profile
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-md font-semibold transition-colors"
                          >
                            <FiPackage className="text-purple-600" /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full text-left font-medium"
                        >
                          <FiLogOut className="text-red-500" /> Logout
                        </button>
                      </div>
                    ) : (
                      <div className="p-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                          <span className="text-xs font-semibold text-slate-500">New customer?</span>
                          <Link to="/register" className="text-xs font-bold text-[#2874f0] hover:underline">
                            Sign Up
                          </Link>
                        </div>
                        <Link
                          to="/login"
                          className="block w-full text-center py-2 bg-[#2874f0] text-white font-semibold rounded-md text-sm hover:bg-[#1a64db] transition-colors"
                        >
                          Login
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="flex items-center gap-1.5 text-slate-700 hover:text-[#2874f0] font-medium text-sm transition-colors relative"
            >
              <FiHeart className="text-xl text-slate-600" />
              <span>Wishlist</span>
              {wishlist.length > 0 && (
                <span className="w-5 h-5 bg-pink-600 text-white text-[11px] rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="flex items-center gap-1.5 text-slate-700 hover:text-[#2874f0] font-semibold text-sm transition-colors relative"
            >
              <FiShoppingCart className="text-xl text-[#2874f0]" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-[#ffe500] text-[#212121] text-[11px] rounded-full flex items-center justify-center font-extrabold border border-yellow-500">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="relative text-slate-800">
              <FiShoppingCart className="text-2xl text-[#2874f0]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#ffe500] text-[#212121] text-[10px] rounded-full flex items-center justify-center font-black">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 text-slate-800 rounded-md hover:bg-slate-100"
            >
              {mobileOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="mt-2 md:hidden">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <FiSearch className="absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f0f5ff] text-slate-800 text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2874f0]"
            />
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2 shadow-lg"
          >
            <Link to="/" className="block py-2 text-slate-800 font-semibold text-sm">
              Home
            </Link>
            <Link to="/products" className="block py-2 text-slate-800 font-semibold text-sm">
              All Products
            </Link>
            <Link to="/wishlist" className="flex items-center justify-between py-2 text-slate-800 font-semibold text-sm">
              <span>Wishlist</span>
              <span className="badge bg-pink-100 text-pink-700">{wishlist.length}</span>
            </Link>

            {user ? (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-500">Logged in as {user.name}</p>
                <Link to="/profile" className="block py-1.5 text-sm text-slate-700 font-medium">
                  My Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block py-1.5 text-sm text-purple-700 font-bold">
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left py-1.5 text-sm text-red-600 font-bold">
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <Link to="/login" className="flex-1 btn-primary text-center py-2 text-xs">
                  Login
                </Link>
                <Link to="/register" className="flex-1 btn-secondary text-center py-2 text-xs">
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Bar Navigation below main header */}
      <CategoryBar />
    </header>
  );
}
