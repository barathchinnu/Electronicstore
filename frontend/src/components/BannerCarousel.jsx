import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { openWhatsApp } from '../utils/whatsapp';

const mainSlides = [
  {
    id: 1,
    tag: 'RAKHI SPECIALS',
    title: 'Dolby Soundbars',
    sub: 'From ₹85/Day*',
    brand: 'LG, SONY & more',
    bg: 'from-amber-600 via-orange-500 to-rose-600',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
    waMsg: 'Hi! I am interested in Dolby Soundbars deal starting ₹85/day',
  },
  {
    id: 2,
    tag: 'FLIPKART UNIQUE',
    title: 'boltt Evo Launch',
    sub: 'Launch on 25th Aug, 12 PM',
    brand: '6.79" HD+ Big Screen',
    bg: 'from-slate-800 via-slate-700 to-blue-900',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    waMsg: 'Hi! I want details on the boltt Evo Launch',
  },
  {
    id: 3,
    tag: 'POWER PERFORMANCE',
    title: 'Snapdragon Power',
    sub: 'Explore Now',
    brand: 'Motorola Edge70 Max',
    bg: 'from-red-700 via-red-600 to-[#b91c1c]',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80',
    waMsg: 'Hi! I want to order Motorola Edge70 Max with Snapdragon',
  },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mainSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slideNext = () => setCurrent((prev) => (prev + 1) % mainSlides.length);
  const slidePrev = () => setCurrent((prev) => (prev - 1 + mainSlides.length) % mainSlides.length);

  return (
    <div className="w-full my-3">
      {/* Desktop 3-Column Banner Hero Row (Exact Flipkart layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Banner 1: Dolby soundbars */}
        <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-[#e11d48] via-[#f97316] to-[#ea580c] text-white p-5 flex flex-col justify-between min-h-[220px] sm:min-h-[240px]">
          <div>
            <span className="inline-block bg-yellow-400 text-slate-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full mb-2 tracking-wide uppercase shadow-xs">
              {mainSlides[0].tag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-display leading-tight mb-1 text-white">
              {mainSlides[0].title}
            </h3>
            <p className="text-xl font-bold text-yellow-200 mb-1">{mainSlides[0].sub}</p>
            <p className="text-xs text-rose-100 font-medium">{mainSlides[0].brand}</p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => openWhatsApp(mainSlides[0].waMsg)}
              className="bg-white text-rose-700 hover:bg-slate-100 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <FaWhatsapp className="text-emerald-600 text-sm" /> Shop Now
            </button>
            <span className="text-[10px] text-white/80 font-medium">*T&C Apply</span>
          </div>
        </div>

        {/* Banner 2: Boltt Evo launch */}
        <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 text-white p-5 flex flex-col justify-between min-h-[220px] sm:min-h-[240px]">
          <div>
            <span className="inline-block bg-sky-400 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full mb-2 tracking-wide uppercase shadow-xs">
              {mainSlides[1].tag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-display leading-tight mb-1 text-white">
              {mainSlides[1].title}
            </h3>
            <p className="text-lg font-bold text-sky-300 mb-1">{mainSlides[1].sub}</p>
            <p className="text-xs text-slate-300 font-medium">{mainSlides[1].brand}</p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Link
              to="/products"
              className="bg-sky-500 text-slate-950 hover:bg-sky-400 font-extrabold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              Explore <FiArrowRight />
            </Link>
            <span className="text-[10px] text-sky-200/80 font-medium">Coming Soon</span>
          </div>
        </div>

        {/* Banner 3: Snapdragon Power */}
        <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-red-800 via-red-700 to-rose-900 text-white p-5 flex flex-col justify-between min-h-[220px] sm:min-h-[240px]">
          <div>
            <span className="inline-block bg-white text-red-700 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full mb-2 tracking-wide uppercase shadow-xs">
              {mainSlides[2].tag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-display leading-tight mb-1 text-white">
              {mainSlides[2].title}
            </h3>
            <p className="text-lg font-bold text-rose-200 mb-1">{mainSlides[2].sub}</p>
            <p className="text-xs text-red-100 font-medium">{mainSlides[2].brand}</p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => openWhatsApp(mainSlides[2].waMsg)}
              className="bg-[#ffe500] text-slate-900 hover:bg-yellow-400 font-extrabold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <FaWhatsapp className="text-emerald-700 text-sm" /> Buy Now
            </button>
            <span className="text-[10px] text-white/80 font-medium">Limited Stock</span>
          </div>
        </div>
      </div>

      {/* Slide pagination dots */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {mainSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-[#2874f0]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
