import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { buyNowWhatsApp } from '../utils/whatsapp';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="page-wrapper flex flex-col items-center justify-center pt-20 pb-24 text-center px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-7xl mb-4">🤍</div>
          <h2 className="text-2xl font-extrabold font-display text-slate-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-sm">Save products you love and easily find them here anytime.</p>
          <Link to="/products" className="btn-primary">Explore Products</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-wrapper pt-4 pb-16 md:pb-8">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <FiHeart className="text-rose-500 text-2xl" />
          <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">My Wishlist</h1>
          <span className="text-slate-400 font-semibold text-sm">({wishlist.length} items)</span>
        </div>

        <div className="grid gap-4">
          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex gap-4 items-center"
              >
                {/* Image */}
                <Link to={`/products/${product._id}`} className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-center justify-center">
                  <img
                    src={product.images?.[0]?.url || 'https://placehold.co/100x100/f8fafc/64748b?text=?'}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{product.brand || 'Insta Digital'}</p>
                  <Link to={`/products/${product._id}`} className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#2874f0] line-clamp-2 transition-colors block">
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-slate-900 font-extrabold text-sm sm:text-base">{formatCurrency(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-slate-400 text-xs line-through">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="mt-1">
                    {product.stock === 0 ? (
                      <span className="text-rose-600 text-xs font-semibold">Out of Stock</span>
                    ) : product.stock <= 5 ? (
                      <span className="text-amber-600 text-xs font-semibold">Only {product.stock} left in stock</span>
                    ) : (
                      <span className="text-emerald-600 text-xs font-semibold">In Stock</span>
                    )}
                  </div>

                  {/* Mobile action buttons */}
                  <div className="flex gap-2 mt-3 sm:hidden">
                    <button
                      disabled={product.stock === 0}
                      onClick={() => { addToCart(product, 1); toast.success('Added to cart!'); }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#2874f0] text-white text-xs font-bold disabled:opacity-50"
                    >
                      <FiShoppingCart className="text-xs" /> Cart
                    </button>
                    <button
                      disabled={product.stock === 0}
                      onClick={() => buyNowWhatsApp(product, 1)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#388e3c] text-white text-xs font-bold disabled:opacity-50"
                    >
                      <FaWhatsapp className="text-xs" /> Buy
                    </button>
                  </div>
                </div>

                {/* Desktop action buttons */}
                <div className="hidden sm:flex flex-col items-end justify-between gap-4 self-stretch">
                  <button onClick={() => removeFromWishlist(product._id)} className="text-slate-400 hover:text-rose-500 transition-colors p-1" title="Remove">
                    <FiTrash2 className="text-base" />
                  </button>
                  <div className="flex gap-2">
                    <button
                      disabled={product.stock === 0}
                      onClick={() => { addToCart(product, 1); toast.success('Added to cart!'); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2874f0] hover:bg-[#1a64db] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      <FiShoppingCart className="text-xs" /> Add to Cart
                    </button>
                    <button
                      disabled={product.stock === 0}
                      onClick={() => buyNowWhatsApp(product, 1)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#388e3c] hover:bg-[#2e7d32] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      <FaWhatsapp className="text-sm" /> Buy Now
                    </button>
                  </div>
                </div>

                {/* Mobile remove icon */}
                <button onClick={() => removeFromWishlist(product._id)} className="sm:hidden self-start text-slate-400 hover:text-rose-500 transition-colors p-1">
                  <FiTrash2 className="text-base" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

