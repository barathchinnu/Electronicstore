import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHeart, FiShoppingCart, FiStar, FiChevronLeft, FiChevronRight,
  FiCheck, FiTruck, FiShield, FiAlertCircle
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { getProduct, getProducts, addReview } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { buyNowWhatsApp } from '../utils/whatsapp';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getProduct(id);
        const p = data.data;
        setProduct(p);
        // fetch related
        const rel = await getProducts({ category: p.category, limit: 4 });
        setRelated((rel.data.data || []).filter(r => r._id !== id));
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    setImgIndex(0);
    setQuantity(1);
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' },
    });
  };

  const handleBuyNow = () => {
    if (!product || product.stock === 0) return;
    buyNowWhatsApp(product, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to submit a review'); return; }
    try {
      setSubmitting(true);
      await addReview(id, reviewForm);
      toast.success('Review submitted!');
      const { data } = await getProduct(id);
      setProduct(data.data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading type="page" />;

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-24">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
      <p className="text-slate-400 mb-6">This product doesn't exist or was removed.</p>
      <Link to="/products" className="btn-primary">Browse Products</Link>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : [{ url: 'https://placehold.co/600x600/1e293b/475569?text=No+Image' }];
  const wishlisted = isWishlisted(product._id);
  const outOfStock = product.stock === 0;

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-400">Products</Link>
          <span>/</span>
          <Link to={`/category/${product.category?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-400">{product.category}</Link>
          <span>/</span>
          <span className="text-white line-clamp-1">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left — Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800 mb-3">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={images[imgIndex]?.url}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </AnimatePresence>

              {/* Nav Arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
                    <FiChevronLeft />
                  </button>
                  <button onClick={() => setImgIndex(i => (i + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
                    <FiChevronRight />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {product.discount > 0 && <span className="badge bg-red-500 text-white">-{product.discount}%</span>}
                {product.flashDeal && <span className="badge bg-orange-500 text-white">🔥 DEAL</span>}
              </div>

              {/* Wishlist */}
              <button onClick={() => toggleWishlist(product)}
                className="absolute top-3 right-3 w-10 h-10 glass rounded-full flex items-center justify-center hover:scale-110 transition-all">
                <FiHeart className={`text-lg ${wishlisted ? 'fill-pink-500 text-pink-500' : 'text-slate-300'}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIndex(i)}
                    className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === imgIndex ? 'border-blue-500' : 'border-transparent'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className="space-y-5">
            <div>
              <p className="text-blue-400 text-sm font-medium mb-1">{product.brand}</p>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <FiStar key={s} className={`text-sm ${s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`} />
                  ))}
                </div>
                <span className="text-sm text-slate-400">{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="glass rounded-2xl p-4 border border-white/5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-white">{formatCurrency(product.price)}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-slate-500 line-through text-lg">{formatCurrency(product.originalPrice)}</span>
                    <span className="badge bg-green-500/20 text-green-400 text-sm">{product.discount}% OFF</span>
                  </>
                )}
              </div>
              {product.originalPrice > product.price && (
                <p className="text-green-400 text-sm mt-1">
                  You save {formatCurrency(product.originalPrice - product.price)}!
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {outOfStock ? (
                <><FiAlertCircle className="text-red-400" /><span className="text-red-400 font-medium">Out of Stock</span></>
              ) : product.stock <= 5 ? (
                <><FiAlertCircle className="text-orange-400" /><span className="text-orange-400 font-medium">Only {product.stock} left in stock</span></>
              ) : (
                <><FiCheck className="text-green-400" /><span className="text-green-400 font-medium">In Stock</span></>
              )}
            </div>

            {/* Quantity */}
            {!outOfStock && (
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all text-lg font-bold">−</button>
                  <span className="text-white font-semibold text-lg w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all text-lg font-bold">+</button>
                  <span className="text-slate-500 text-sm">({product.stock} available)</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} disabled={outOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold transition-all ${outOfStock ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'btn-secondary'}`}>
                <FiShoppingCart /> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={outOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold transition-all ${outOfStock ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'btn-whatsapp'}`}>
                <FaWhatsapp className="text-lg" /> Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FiShield, text: 'Quality Checked' },
                { icon: FiTruck, text: 'Fast Delivery' },
                { icon: FaWhatsapp, text: 'WA Support' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="glass rounded-xl p-3 flex flex-col items-center gap-1 border border-white/5 text-center">
                  <Icon className="text-blue-400 text-lg" />
                  <span className="text-xs text-slate-400">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-1 border-b border-white/10 mb-6">
            {['description', 'specifications', 'reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2.5 text-sm font-medium capitalize rounded-t-xl transition-all ${tab === t ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}>
                {t} {t === 'reviews' && `(${product.numReviews})`}
              </button>
            ))}
          </div>

          {tab === 'description' && (
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{product.description || 'No description available.'}</p>
            </div>
          )}

          {tab === 'specifications' && (
            <div className="glass rounded-2xl overflow-hidden border border-white/5">
              {product.specifications?.length > 0 ? (
                product.specifications.map((spec, i) => (
                  <div key={i} className={`flex gap-4 px-4 py-3 ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
                    <span className="text-slate-400 text-sm w-40 flex-shrink-0">{spec.key}</span>
                    <span className="text-white text-sm">{spec.value}</span>
                  </div>
                ))
              ) : <p className="p-4 text-slate-400">No specifications available.</p>}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-4">
              {product.reviews?.map((review, i) => (
                <div key={i} className="glass rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {review.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white text-sm font-medium">{review.name}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <FiStar key={s} className={`text-xs ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`} />)}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm">{review.comment}</p>
                </div>
              ))}

              {/* Review Form */}
              {user && (
                <div className="glass rounded-2xl p-5 border border-white/10 mt-6">
                  <h4 className="font-semibold text-white mb-4">Write a Review</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">Rating</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: s }))}>
                            <FiStar className={`text-2xl transition-all ${s <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600 hover:text-yellow-400'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                      placeholder="Share your experience..."
                      rows={3}
                      className="input-dark w-full resize-none"
                      required
                    />
                    <button type="submit" disabled={submitting} className="btn-primary">
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold font-display text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
