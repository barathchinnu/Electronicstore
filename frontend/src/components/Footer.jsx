import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { MdElectricBolt } from 'react-icons/md';
import { openWhatsApp } from '../utils/whatsapp';

const categories = [
  { name: 'Earphones', slug: 'earphones' },
  { name: 'Headphones', slug: 'headphones' },
  { name: 'Smart Watches', slug: 'smart-watches' },
  { name: 'Speakers', slug: 'speakers' },
  { name: 'Chargers', slug: 'chargers' },
  { name: 'Gaming', slug: 'gaming' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img
                src="/insta-logo.jpg"
                alt="Insta Digital Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-base font-black text-white font-display leading-tight">
                Insta Digital<br />
                <span className="text-[10px] text-yellow-400 font-normal">Shopping</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Smart Choice, Best Deals! Premium electronics at unbeatable prices — Trusted by 1000+ customers.
            </p>
            <p className="text-slate-400 text-xs mb-3">
              Owner: <span className="text-yellow-400 font-bold">R.Adhithya</span>
            </p>
            <button
              onClick={() => openWhatsApp('Hi! I have a question about Insta Digital Shopping.')}
              className="bg-[#388e3c] text-white text-xs font-bold px-3 py-2 rounded-md flex items-center gap-1.5 hover:bg-[#2e7d32] transition-colors"
            >
              <FaWhatsapp className="text-sm" /> Chat on WhatsApp
            </button>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Categories</h3>
            <ul className="space-y-1.5 text-xs">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Quick Links</h3>
            <ul className="space-y-1.5 text-xs">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/products?featured=true', label: 'Featured' },
                { to: '/products?bestSeller=true', label: 'Best Sellers' },
                { to: '/products?flashDeal=true', label: 'Flash Deals' },
                { to: '/cart', label: 'My Cart' },
                { to: '/wishlist', label: 'Wishlist' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Contact Us</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-400">
                <FiPhone className="text-[#2874f0]" />
                <span>+91 63816 03160</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <FiMail className="text-[#2874f0]" />
                <span>instadigitalshopping@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <FiMapPin className="text-[#2874f0] mt-0.5" />
                <span>Tamil Nadu, India</span>
              </li>
            </ul>
            <div className="flex gap-2 mt-4">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <button
                  key={i}
                  className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <Icon className="text-xs" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2024 Insta Digital Shopping. Owner: R.Adhithya</p>
          <p>Insta Digital Shopping UI 🚀</p>
        </div>
      </div>
    </footer>
  );
}
