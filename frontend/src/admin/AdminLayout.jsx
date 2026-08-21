import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiPackage,
  FiTag,
  FiShoppingBag,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiChevronRight,
  FiX,
  FiImage,
} from 'react-icons/fi';
import { MdElectricBolt } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/categories', icon: FiTag, label: 'Categories' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/banners', icon: FiImage, label: 'Banners' },
];

export default function AdminLayout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-200">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800 flex-shrink-0">
        <Link
          to="/admin"
          className="flex items-center gap-3"
          onClick={() => setDrawerOpen(false)}
        >
          <img
            src="/insta-logo.jpg"
            alt="Insta Digital Logo"
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-slate-700 shadow-sm"
          />

          <div className="min-w-0">
            <p className="font-extrabold text-white text-sm tracking-tight whitespace-nowrap">
              Insta Digital
            </p>

            <p className="text-[11px] text-blue-400 font-bold uppercase tracking-wider whitespace-nowrap">
              Admin Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">

        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all w-full ${isActive
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`text-lg flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'
                    }`}
                />

                <span className="truncate">
                  {label}
                </span>

                {isActive && (
                  <FiChevronRight className="ml-auto text-blue-400 text-sm flex-shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}

      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 border-t border-slate-800 pt-3 space-y-1 flex-shrink-0">

        {/* View Store */}
        <Link
          to="/"
          onClick={() => setDrawerOpen(false)}
          className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all w-full"
        >
          <FiSettings className="text-lg flex-shrink-0" />
          <span>View Storefront</span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all w-full cursor-pointer"
        >
          <FiLogOut className="text-lg flex-shrink-0" />
          <span>Logout</span>
        </button>

        {/* Admin Profile */}
        <div className="px-3 py-3 mt-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-sm font-extrabold shadow flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm text-white font-bold truncate">
                {user.name}
              </p>

              <p className="text-[10px] text-slate-400 truncate">
                {user.email}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex overflow-x-hidden">

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside
        className="
          hidden lg:flex
          sticky
          top-0
          h-screen
          w-72
          min-w-72
          flex-col
          bg-slate-900
          border-r
          border-slate-800
          shadow-xl
          flex-shrink-0
        "
      >
        <SidebarContent />
      </aside>

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 250,
              }}
              className="
                absolute
                left-0
                top-0
                bottom-0
                w-72
                max-w-[85vw]
                bg-slate-900
                border-r
                border-slate-800
                shadow-2xl
              "
            >
              {/* Close button */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute right-3 top-3 z-10 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <FiX className="text-xl" />
              </button>

              <SidebarContent />
            </motion.aside>

          </div>
        )}
      </AnimatePresence>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div
        className="
          flex
          flex-col
          flex-1
          min-w-0
          w-full
        "
      >

        {/* =================================================
            MOBILE HEADER
        ================================================== */}
        <header
          className="
            lg:hidden
            sticky
            top-0
            z-40
            h-14
            flex
            items-center
            justify-between
            px-4
            bg-slate-900
            border-b
            border-slate-800
          "
        >

          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-800 text-white"
          >
            <FiMenu className="text-xl" />
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-2"
          >
            <img
              src="/insta-logo.jpg"
              alt="Insta Digital Logo"
              className="w-6 h-6 rounded-full object-cover"
            />

            <span className="font-extrabold text-white text-sm">
              Admin Portal
            </span>
          </Link>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================== */}
        <main
          className="
            flex-1
            min-w-0
            w-full
            p-4
            sm:p-6
            lg:p-8
            overflow-x-auto
          "
        >
          <div className="w-full min-w-0">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}