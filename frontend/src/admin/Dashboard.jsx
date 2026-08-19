import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiUsers, FiShoppingBag, FiAlertTriangle, FiArrowRight, FiPlus } from 'react-icons/fi';
import { getAdminStats, getOrders } from '../services/orderService';
import { getProducts } from '../services/productService';
import { formatCurrency } from '../utils/formatCurrency';

const StatCard = ({ icon: Icon, label, value, colorClass, borderClass, to, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl hover:border-slate-700 transition-all group"
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon className="text-xl" />
      </div>
      {to && (
        <Link to={to} className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
          <FiArrowRight className="text-sm" />
        </Link>
      )}
    </div>
    <p className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">{value ?? '—'}</p>
    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">{label}</p>
  </motion.div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, lowRes, ordersRes] = await Promise.all([
          getAdminStats(),
          getProducts({ limit: 5, sort: 'stock_asc' }),
          getOrders({ limit: 5 }),
        ]);
        setStats(statsRes.data.data);
        setLowStock((lowRes.data.data || []).filter(p => p.stock <= 5));
        setRecentOrders(ordersRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-white">Store Overview</h1>
          <p className="text-slate-400 text-xs mt-0.5">Real-time inventory and sales summary</p>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <FiPlus className="text-sm" /> Add Product
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiPackage} label="Total Products" value={stats?.products} colorClass="bg-blue-500/20 text-blue-400 border border-blue-500/30" to="/admin/products" delay={0} />
        <StatCard icon={FiUsers} label="Total Users" value={stats?.users} colorClass="bg-purple-500/20 text-purple-400 border border-purple-500/30" to="/admin/users" delay={0.05} />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={stats?.orders} colorClass="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" to="/admin/orders" delay={0.1} />
        <StatCard icon={FiAlertTriangle} label="Low Stock Items" value={stats?.lowStock} colorClass="bg-amber-500/20 text-amber-400 border border-amber-500/30" to="/admin/products" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-blue-400 text-xs font-semibold hover:text-blue-300 flex items-center gap-1">
              View All <FiArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="divide-y divide-slate-800/80">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-5 py-3.5 flex justify-between items-center">
                  <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
                </div>
              ))
            ) : recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-center text-slate-400 text-xs">No customer orders recorded yet.</p>
            ) : recentOrders.map(order => (
              <div key={order._id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                <div>
                  <p className="text-xs sm:text-sm text-white font-bold">{order.user?.name || 'Guest User'}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{order.items?.length || 0} items purchased</p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-extrabold text-white">{formatCurrency(order.totalAmount)}</p>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                    order.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    order.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FiAlertTriangle className="text-amber-400 text-sm" /> Inventory Stock Alerts
            </h3>
            <Link to="/admin/products" className="text-blue-400 text-xs font-semibold hover:text-blue-300 flex items-center gap-1">
              Manage Products <FiArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="divide-y divide-slate-800/80">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-5 py-3.5 flex justify-between items-center">
                  <div className="h-4 w-36 bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-slate-800 rounded animate-pulse" />
                </div>
              ))
            ) : lowStock.length === 0 ? (
              <p className="px-5 py-8 text-center text-slate-400 text-xs">All inventory items are well-stocked! ✓</p>
            ) : lowStock.map(p => (
              <div key={p._id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <img src={p.images?.[0]?.url || 'https://placehold.co/100x100/1e293b/475569?text=?'} alt="" className="w-9 h-9 rounded-lg object-contain bg-slate-950 p-1 border border-slate-800 flex-shrink-0" />
                  <p className="text-xs text-white font-bold truncate">{p.name}</p>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex-shrink-0 ${p.stock === 0 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                  {p.stock === 0 ? 'OUT OF STOCK' : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Links Footer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="font-bold text-white text-sm mb-3">Quick Admin Controls</h3>
        <div className="flex flex-wrap gap-2.5">
          <Link to="/admin/products/add" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all">
            + Add New Product
          </Link>
          <Link to="/admin/categories" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all">
            Manage Categories
          </Link>
          <Link to="/admin/orders" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all">
            View Orders List
          </Link>
        </div>
      </div>
    </div>
  );
}

