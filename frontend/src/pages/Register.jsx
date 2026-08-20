import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiZap, FiShield, FiTruck } from 'react-icons/fi';
import { MdElectricBolt } from 'react-icons/md';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const perks = [
  { icon: FiZap, text: 'Exclusive member-only deals' },
  { icon: FiShield, text: 'Secure account & order history' },
  { icon: FiTruck, text: 'Track orders in real-time' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await register({ name: form.name, email: form.email, password: form.password });
      const userData = data.data;
      loginUser(userData);
      toast.success(`Welcome to Insta Digital Shopping, ${userData.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch">
      {/* ── LEFT BRAND PANEL ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12 bg-gradient-to-br from-[#1a1f36] via-[#1e2a55] to-[#0f172a]">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <MdElectricBolt className="text-white text-xl" />
          </div>
          <div>
            <p className="text-white font-extrabold text-lg leading-tight tracking-tight font-display">Insta Digital</p>
            <p className="text-blue-300 text-xs font-semibold">Shopping</p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight font-display">
              Join Thousands<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                of Happy Shoppers
              </span>
            </h1>
            <p className="mt-4 text-slate-400 text-base leading-relaxed max-w-sm">
              Create your free account and unlock access to exclusive deals, flash sales, and member-only discounts.
            </p>
          </div>

          {/* Perks */}
          <div className="space-y-3">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="text-blue-300 text-sm" />
                </div>
                <span className="text-slate-300 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-slate-600 text-xs">
          © 2026 Insta Digital Shopping — All rights reserved
        </p>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 bg-white min-h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <MdElectricBolt className="text-white text-lg" />
            </div>
            <span className="font-extrabold text-slate-900 text-base font-display">Insta Digital Shopping</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 font-display tracking-tight">Create account</h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Already have one?{' '}
              <Link to="/login" className="text-[#2874f0] font-semibold hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder-slate-400 outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder-slate-400 outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-11 py-3 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder-slate-400 outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPw ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder-slate-400 outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 bg-[#2874f0] hover:bg-[#1a64db] text-white font-bold text-sm rounded-xl shadow-md shadow-blue-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2.5 cursor-pointer mt-1"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </>
              ) : 'Create My Account'}
            </motion.button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6 leading-relaxed">
            By creating an account, you agree to our{' '}
            <span className="text-[#2874f0] cursor-pointer hover:underline">Terms of Service</span>
            {' '}and{' '}
            <span className="text-[#2874f0] cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
