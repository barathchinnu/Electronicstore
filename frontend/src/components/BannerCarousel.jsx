import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiZap, FiShield } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { openWhatsApp } from '../utils/whatsapp';

const slides = [
  {
    id: 1,
    tag: 'LIMITED TIME DEAL',
    title: 'Dolby Atmos Soundbars',
    sub: 'Up to 55% Off • Starting ₹2,999',
    desc: 'Immersive 3D surround sound for home theatre experience.',
    bg: 'from-blue-900 via-indigo-900 to-slate-900',
    accentBg: 'bg-[#ffe500] text-slate-950',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    waMsg: 'Hi! I want to inquire about Dolby Soundbars offer',
  },
  {
    id: 2,
    tag: 'NEW LAUNCH 2026',
    title: 'Ultra Wireless Earbuds',
    sub: '40Hrs Playtime • Active Noise Cancellation',
    desc: 'Low latency gaming mode with deep bass driver system.',
    bg: 'from-slate-950 via-purple-950 to-indigo-950',
    accentBg: 'bg-cyan-400 text-slate-950',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    waMsg: 'Hi! I am interested in the Ultra Wireless Earbuds launch',
  },
  {
    id: 3,
    tag: 'FLASH SALE',
    title: 'Smartwatches & Fitness',
    sub: 'AMOLED Display • BT Calling',
    desc: 'Track heart rate, SpO2, sleep & 100+ sports modes.',
    bg: 'from-rose-950 via-red-900 to-amber-950',
    accentBg: 'bg-amber-400 text-slate-950',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    waMsg: 'Hi! I want to order Smartwatches on Flash Sale',
  },
  {
    id: 4,
    tag: 'SPECIAL DISCOUNTS',
    title: 'Fast Chargers & Cables',
    sub: '65W GaN Fast Charging Hubs',
    desc: 'Charge laptop, tablet & phone simultaneously at max speed.',
    bg: 'from-emerald-950 via-teal-900 to-slate-950',
    accentBg: 'bg-emerald-400 text-slate-950',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
    waMsg: 'Hi! Send me details about 65W Fast Chargers',
  },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slideNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const slidePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const activeSlide = slides[current];

  return (
    <div className="w-full my-2">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Main Sliding Hero Carousel (3 cols desktop, full width mobile) */}
        <div
          className="lg:col-span-3 relative h-[240px] sm:h-[300px] md:h-[340px] rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-950 group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className={`absolute inset-0 bg-gradient-to-r ${activeSlide.bg} text-white p-5 sm:p-8 flex flex-col justify-between`}
            >
              {/* Overlay graphics */}
              <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

              <div className="relative z-10 max-w-xl">
                <span className={`inline-block font-extrabold text-[10px] sm:text-xs px-3 py-1 rounded-full mb-2 sm:mb-3 uppercase tracking-wider shadow-xs ${activeSlide.accentBg}`}>
                  {activeSlide.tag}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight leading-tight text-white mb-1.5 sm:mb-2">
                  {activeSlide.title}
                </h2>
                <p className="text-sm sm:text-lg font-bold text-yellow-300 mb-1">
                  {activeSlide.sub}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-md hidden sm:block">
                  {activeSlide.desc}
                </p>
              </div>

              {/* Product Background Image */}
              <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-36 h-36 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-xl border border-white/10 opacity-90 hidden xs:block">
                <img
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Action Bar */}
              <div className="relative z-10 flex items-center gap-3 pt-2">
                <button
                  onClick={() => openWhatsApp(activeSlide.waMsg)}
                  className="bg-[#ffe500] hover:bg-yellow-400 text-slate-950 font-extrabold px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <FaWhatsapp className="text-emerald-700 text-base" /> Buy Now
                </button>
                <Link
                  to="/products"
                  className="bg-white/15 hover:bg-white/25 text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 backdrop-blur-xs border border-white/20 transition-colors"
                >
                  Browse Deals <FiArrowRight className="text-sm" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Prev/Next Arrows */}
          <button
            onClick={slidePrev}
            aria-label="Previous Slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
          >
            <FiChevronLeft className="text-lg" />
          </button>
          <button
            onClick={slideNext}
            aria-label="Next Slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
          >
            <FiChevronRight className="text-lg" />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === current ? 'w-7 bg-[#ffe500]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Side Promo Cards (1 col on desktop, hidden or stacked on smaller screens) */}
        <div className="hidden lg:flex lg:col-span-1 flex-col gap-3 h-[340px]">
          {/* Card 1 */}
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4 text-white flex flex-col justify-between border border-blue-500/30 shadow-xs relative overflow-hidden">
            <div>
              <span className="text-[10px] font-extrabold bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded-md border border-blue-400/30 uppercase tracking-wider">
                ⚡ FAST DISPATCH
              </span>
              <h4 className="text-base font-extrabold font-display mt-2 leading-tight">Same Day Doorstep Dispatch</h4>
              <p className="text-xs text-blue-100 mt-1 font-medium">Genuine warranty on all orders.</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-xs font-bold text-yellow-300 hover:text-yellow-200 transition-colors"
            >
              Shop Inventory &gt;
            </Link>
          </div>

          {/* Card 2 */}
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 p-4 text-white flex flex-col justify-between border border-emerald-500/30 shadow-xs relative overflow-hidden">
            <div>
              <span className="text-[10px] font-extrabold bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-md border border-emerald-400/30 uppercase tracking-wider">
                💬 DIRECT HELP
              </span>
              <h4 className="text-base font-extrabold font-display mt-2 leading-tight">Order via WhatsApp</h4>
              <p className="text-xs text-emerald-100 mt-1 font-medium">Chat live with our store representative.</p>
            </div>
            <button
              onClick={() => openWhatsApp('Hi! I need help with choosing products on Insta Digital Shopping')}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg self-start shadow-xs transition-colors cursor-pointer"
            >
              <FaWhatsapp className="text-sm text-yellow-300" /> Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

