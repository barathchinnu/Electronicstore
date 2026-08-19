import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap, FiShield, FiTruck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import BannerCarousel from '../components/BannerCarousel';
import CountdownTimer from '../components/CountdownTimer';
import Loading from '../components/Loading';
import { openWhatsApp } from '../utils/whatsapp';
import { getProducts } from '../services/productService';

const features = [
  { icon: FiShield, title: 'Quality Assured', desc: '100% genuine products with warranty' },
  { icon: FiZap, title: 'Express Delivery', desc: 'Fast & safe doorstep dispatch' },
  { icon: FaWhatsapp, title: 'Instant WhatsApp Order', desc: 'Click to buy directly without fuss' },
  { icon: FiTruck, title: 'Unbeatable Prices', desc: 'Direct distributor rates & discounts' },
];

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendRes, flashRes, newRes, bestRes] = await Promise.all([
          getProducts({ limit: 8, sort: 'popular' }),
          getProducts({ flashDeal: true, limit: 4 }),
          getProducts({ limit: 8, sort: 'newest' }),
          getProducts({ bestSeller: true, limit: 8 }),
        ]);
        setTrending(trendRes.data.data || []);
        setFlashDeals(flashRes.data.data || []);
        setNewArrivals(newRes.data.data || []);
        setBestSellers(bestRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="page-wrapper pb-16 md:pb-8">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 space-y-4">
        {/* Flipkart Multi-Banner Hero Grid */}
        <BannerCarousel />

        {/* Flipkart "In demand" / Flash Deals Section */}
        <section className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs">
          <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 p-3 rounded-md mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-yellow-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 flex items-center gap-2">
                In demand 🔥
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Top rated electronics requested by customers this week
              </p>
            </div>
            <CountdownTimer targetHours={8} />
          </div>

          {loading ? (
            <Loading count={4} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {flashDeals.length > 0
                ? flashDeals.map((p) => <ProductCard key={p._id} product={p} />)
                : trending.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>

        {/* Trending Products Grid */}
        <section className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                🚀 Trending Products
              </h2>
              <p className="text-xs text-slate-500">Most ordered electronics & gadgets</p>
            </div>
            <Link
              to="/products?sort=popular"
              className="bg-[#2874f0] text-white hover:bg-[#1a64db] text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs transition-colors"
            >
              VIEW ALL <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <Loading count={8} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {trending.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>

        {/* Why Choose Us Bar */}
        <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 shadow-xs">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold font-display text-slate-900">Why Shop With Insta Digital Shopping?</h2>
            <p className="text-xs text-slate-600 mt-1">Smart Choice, Best Deals — Direct Customer Support</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 border border-blue-100 shadow-xs text-center flex flex-col items-center"
              >
                <div className="w-11 h-11 rounded-full bg-[#f0f5ff] text-[#2874f0] border border-blue-100 flex items-center justify-center text-xl mb-2">
                  <feature.icon />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Best Sellers Grid */}
        <section className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                ⭐ Best Sellers
              </h2>
              <p className="text-xs text-slate-500">Customer favorite items with top ratings</p>
            </div>
            <Link
              to="/products?bestSeller=true"
              className="bg-[#2874f0] text-white hover:bg-[#1a64db] text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs transition-colors"
            >
              VIEW ALL <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <Loading count={8} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {bestSellers.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>

        {/* New Arrivals Grid */}
        <section className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                ✨ New Arrivals
              </h2>
              <p className="text-xs text-slate-500">Fresh stock added this month</p>
            </div>
            <Link
              to="/products?sort=newest"
              className="bg-[#2874f0] text-white hover:bg-[#1a64db] text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs transition-colors"
            >
              VIEW ALL <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <Loading count={8} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>

        {/* Flipkart style WhatsApp CTA */}
        <section className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-600 rounded-lg p-6 text-white text-center shadow-md">
          <div className="max-w-xl mx-auto space-y-3">
            <div className="text-4xl">💬</div>
            <h2 className="text-2xl font-black font-display">Need Help Ordering on WhatsApp?</h2>
            <p className="text-emerald-100 text-sm">
              Instant customer support! Pick any product and chat directly with our store team for fast delivery.
            </p>
            <button
              onClick={() => openWhatsApp('Hi! I am looking for product deals on Insta Digital Shopping.')}
              className="inline-flex items-center gap-2 bg-[#ffe500] text-slate-900 font-extrabold px-6 py-3 rounded-lg text-sm shadow-md hover:bg-yellow-400 transition-transform active:scale-95"
            >
              <FaWhatsapp className="text-emerald-700 text-lg" />
              Chat on WhatsApp Now
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
