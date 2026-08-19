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
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
            <MdElectricBolt className="text-white text-lg" />
          </div>
          <div>
            <p className="font-extrabold text-white text-sm font-display tracking-tight">ElectroStore</p>
            <p className="text-[11px] text-blue-400 font-bold uppercase tracking-wider">Admin Portal</p>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`text-base ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {label}
                {isActive && <FiChevronRight className="ml-auto text-blue-400 text-xs" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-slate-800 pt-3 space-y-1">
        <Link to="/" onClick={() => setDrawerOpen(false)}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <FiSettings className="text-base text-slate-400" /> View Storefront
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all w-full cursor-pointer">
          <FiLogOut className="text-base" /> Logout
        </button>
        <div className="px-3 py-2.5 mt-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xs font-extrabold shadow-xs">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 flex-col bg-slate-900 border-r border-slate-800 fixed top-0 bottom-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xs" />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800">
              <SidebarContent />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-56 min-h-screen flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-lg hover:bg-slate-800 text-white">
            <FiMenu className="text-xl" />
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <MdElectricBolt className="text-blue-400 text-lg" />
            <span className="font-extrabold text-white text-sm">Admin Portal</span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

