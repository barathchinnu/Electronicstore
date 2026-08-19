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
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-24 text-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-8xl mb-6">🤍</div>
          <h2 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
          <p className="text-slate-400 mb-8">Save products you love and come back to them later.</p>
          <Link to="/products" className="btn-primary">Explore Products</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <FiHeart className="text-pink-400 text-2xl" />
          <h1 className="text-2xl font-bold font-display text-white">My Wishlist</h1>
          <span className="text-slate-400 text-base">({wishlist.length} items)</span>
        </div>

        <div className="grid gap-4">
          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="glass rounded-2xl p-4 border border-white/5 flex gap-4"
              >
                {/* Image */}
                <Link to={`/products/${product._id}`} className="flex-shrink-0">
                  <img
                    src={product.images?.[0]?.url || 'https://placehold.co/100x100/1e293b/475569?text=?'}
                    alt={product.name}
                    className="w-24 h-24 rounded-xl object-cover bg-slate-800"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-0.5">{product.brand}</p>
                  <Link to={`/products/${product._id}`} className="text-base font-semibold text-white hover:text-blue-400 line-clamp-2 transition-colors block">
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-blue-400 font-bold">{formatCurrency(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-slate-500 text-sm line-through">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="mt-1">
                    {product.stock === 0 ? (
                      <span className="text-red-400 text-xs">Out of Stock</span>
                    ) : product.stock <= 5 ? (
                      <span className="text-orange-400 text-xs">Only {product.stock} left</span>
                    ) : (
                      <span className="text-green-400 text-xs">In Stock</span>
                    )}
                  </div>

                  {/* Mobile buttons */}
                  <div className="flex gap-2 mt-3 sm:hidden">
                    <button
                      disabled={product.stock === 0}
                      onClick={() => { addToCart(product, 1); toast.success('Added to cart!'); }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold disabled:opacity-50"
                    >
                      <FiShoppingCart className="text-xs" /> Cart
                    </button>
                    <button
                      disabled={product.stock === 0}
                      onClick={() => buyNowWhatsApp(product, 1)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold disabled:opacity-50"
                    >
                      <FaWhatsapp className="text-sm" /> Buy
                    </button>
                  </div>
                </div>

                {/* Desktop buttons */}
                <div className="hidden sm:flex flex-col items-end justify-between gap-2">
                  <button onClick={() => removeFromWishlist(product._id)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                    <FiTrash2 />
                  </button>
                  <div className="flex gap-2">
                    <button
                      disabled={product.stock === 0}
                      onClick={() => { addToCart(product, 1); toast.success('Added to cart!'); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
                    >
                      <FiShoppingCart className="text-xs" /> Add to Cart
                    </button>
                    <button
                      disabled={product.stock === 0}
                      onClick={() => buyNowWhatsApp(product, 1)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
                    >
                      <FaWhatsapp /> Buy Now
                    </button>
                  </div>
                </div>

                {/* Mobile remove */}
                <button onClick={() => removeFromWishlist(product._id)} className="sm:hidden self-start text-slate-500 hover:text-red-400 transition-colors p-1">
                  <FiTrash2 />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
