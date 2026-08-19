import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiShoppingBag, FiAlertCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { cartWhatsApp } from '../utils/whatsapp';
import { formatCurrency } from '../utils/formatCurrency';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-24 text-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-400 mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </motion.div>
      </div>
    );
  }

  const discount = cartItems.reduce((acc, item) => {
    const saved = (item.originalPrice || item.price) - item.price;
    return acc + (saved > 0 ? saved * item.quantity : 0);
  }, 0);

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-display text-white">
            My Cart <span className="text-slate-400 text-lg font-normal">({cartItems.length} items)</span>
          </h1>
          <button onClick={clearCart} className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm transition-colors">
            <FiTrash2 className="text-sm" /> Clear All
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="glass rounded-2xl p-4 border border-white/5 flex gap-4"
                >
                  {/* Image */}
                  <Link to={`/products/${item._id}`} className="flex-shrink-0">
                    <img
                      src={item.image || 'https://placehold.co/80x80/1e293b/475569?text=?'}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-800"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-0.5">{item.brand}</p>
                    <Link to={`/products/${item._id}`} className="text-sm font-semibold text-white hover:text-blue-400 line-clamp-2 transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-blue-400 font-bold mt-1">{formatCurrency(item.price)}</p>

                    {item.stock <= 3 && item.stock > 0 && (
                      <p className="text-orange-400 text-xs flex items-center gap-1 mt-1">
                        <FiAlertCircle className="text-xs" /> Only {item.stock} left
                      </p>
                    )}
                  </div>

                  {/* Qty + Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(item._id)} className="text-slate-500 hover:text-red-400 transition-colors p-1">
                      <FiTrash2 className="text-sm" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-7 h-7 glass rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all"
                      >−</button>
                      <span className="text-white font-semibold w-5 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 glass rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all disabled:opacity-40"
                      >+</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link to="/products" className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 transition-colors mt-2">
              <FiShoppingBag className="text-sm" /> Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-5 border border-white/10 sticky top-24">
              <h3 className="font-bold text-white text-lg mb-5">Order Summary</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span className="text-white font-medium">{formatCurrency(cartTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Discount</span>
                    <span className="text-green-400 font-medium">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Delivery</span>
                  <span className="text-green-400 font-medium">FREE</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-xl font-bold gradient-text-blue">{formatCurrency(cartTotal)}</span>
                </div>
                {discount > 0 && (
                  <p className="text-green-400 text-xs mt-1">You're saving {formatCurrency(discount)} on this order!</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => cartWhatsApp(cartItems, cartTotal)}
                className="w-full btn-whatsapp text-base py-4 justify-center"
              >
                <FaWhatsapp className="text-xl" /> Proceed to WhatsApp
              </motion.button>

              <p className="text-xs text-slate-500 text-center mt-3">
                Your order will be sent to us via WhatsApp for confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
