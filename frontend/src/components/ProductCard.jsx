import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { buyNowWhatsApp } from '../utils/whatsapp';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#ffffff', color: '#212121', border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
      iconTheme: { primary: '#2874f0', secondary: '#ffffff' },
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥', {
      style: { background: '#ffffff', color: '#212121', border: '1px solid #e0e0e0' },
      icon: wishlisted ? '🤍' : '❤️',
    });
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    buyNowWhatsApp(product, 1);
  };

  return (
    <div className="product-card group relative bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-200">
      <Link to={`/products/${product._id}`} className="block">
        {/* Product Image Area */}
        <div className="relative aspect-square overflow-hidden bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100">
          <img
            src={imgError ? 'https://placehold.co/400x400/f8fafc/64748b?text=No+Image' : (product.images?.[0]?.url || 'https://placehold.co/400x400/f8fafc/64748b?text=No+Image')}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Flipkart Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.discount > 0 && (
              <span className="badge bg-[#388e3c] text-white text-[10px] font-extrabold rounded-sm shadow-xs">
                {product.discount}% OFF
              </span>
            )}
            {product.flashDeal && (
              <span className="badge bg-amber-500 text-white text-[10px] font-bold rounded-sm">
                🔥 DEAL
              </span>
            )}
            {product.bestSeller && (
              <span className="badge bg-[#ffe500] text-[#212121] text-[10px] font-bold rounded-sm border border-yellow-400">
                ⭐ TOP
              </span>
            )}
            {outOfStock && (
              <span className="badge bg-slate-600 text-white text-[10px] font-bold rounded-sm">
                OUT OF STOCK
              </span>
            )}
          </div>

          {/* Wishlist Heart Icon Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full border border-slate-200 flex items-center justify-center shadow-xs transition-transform hover:scale-110 z-10"
          >
            <FiHeart
              className={`text-xs transition-all ${wishlisted ? 'fill-pink-600 text-pink-600' : 'text-slate-400 hover:text-pink-500'}`}
            />
          </button>
        </div>

        {/* Product Details Info */}
        <div className="p-3 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5 truncate">
              {product.brand || 'ElectroStore'}
            </p>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 mb-1.5 leading-snug group-hover:text-[#2874f0] transition-colors">
              {product.name}
            </h3>

            {/* Flipkart Rating Pill */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="bg-[#388e3c] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                <span>{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
                <FiStar className="text-[10px] fill-white" />
              </div>
              <span className="text-[11px] text-slate-400 font-medium">({product.numReviews || 12})</span>
            </div>
          </div>

          {/* Price & Discounts */}
          <div>
            <div className="flex items-baseline gap-1.5 mb-2 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Low stock notice */}
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-[11px] text-amber-600 font-semibold mb-2">Only {product.stock} left in stock!</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-1.5 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  outOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#2874f0] hover:bg-[#1a64db] text-white shadow-xs'
                }`}
              >
                <FiShoppingCart className="text-xs" /> Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={outOfStock}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  outOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#388e3c] hover:bg-[#2e7d32] text-white shadow-xs'
                }`}
              >
                <FaWhatsapp className="text-sm" /> Buy
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
