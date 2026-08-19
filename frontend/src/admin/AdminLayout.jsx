import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiPackage, FiTag, FiShoppingBag, FiUsers,
  FiLogOut, FiMenu, FiX, FiSettings, FiChevronRight,
} from 'react-icons/fi';
import { MdElectricBolt } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const navItems = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/categories', icon: FiTag, label: 'Categories' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
];

export default function AdminLayout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/5">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <MdElectricBolt className="text-white text-lg" />
          </div>
          <div>
            <p className="font-bold text-white text-sm font-display">ElectroStore</p>
            <p className="text-xs text-purple-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`text-base ${isActive ? 'text-blue-400' : ''}`} />
                {label}
                {isActive && <FiChevronRight className="ml-auto text-blue-400 text-xs" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-white/5 pt-4 space-y-1">
        <Link to="/" onClick={() => setDrawerOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <FiSettings className="text-base" /> View Store
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-all w-full">
          <FiLogOut className="text-base" /> Logout
        </button>
        <div className="px-3 py-2.5 mt-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-white font-medium">{user.name}</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 flex-col glass border-r border-white/5 fixed top-0 bottom-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute left-0 top-0 bottom-0 w-64 glass border-r border-white/10">
              <SidebarContent />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-56 min-h-screen flex flex-col">
        {/* Mobile Top Bar */}
        <div className="lg:hidden glass border-b border-white/5 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-lg hover:bg-white/5 text-white">
            <FiMenu className="text-xl" />
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <MdElectricBolt className="text-blue-400 text-lg" />
            <span className="font-bold text-white text-sm">Admin Panel</span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
