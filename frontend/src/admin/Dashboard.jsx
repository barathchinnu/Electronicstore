import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiUsers, FiShoppingBag, FiAlertTriangle, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { getAdminStats, getOrders } from '../services/orderService';
import { getProducts } from '../services/productService';
import { formatCurrency } from '../utils/formatCurrency';

const StatCard = ({ icon: Icon, label, value, color, to, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`glass rounded-2xl p-5 border border-white/5 hover:border-${color}-500/30 transition-all group`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl bg-${color}-500/15 flex items-center justify-center`}>
        <Icon className={`text-${color}-400 text-lg`} />
      </div>
      {to && (
        <Link to={to} className="text-slate-500 hover:text-blue-400 transition-colors">
          <FiArrowRight className="text-sm" />
        </Link>
      )}
    </div>
    <p className="text-2xl font-bold font-display text-white">{value ?? '—'}</p>
    <p className="text-slate-400 text-sm mt-0.5">{label}</p>
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiPackage} label="Total Products" value={stats?.products} color="blue" to="/admin/products" delay={0} />
        <StatCard icon={FiUsers} label="Total Users" value={stats?.users} color="purple" to="/admin/users" delay={0.1} />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={stats?.orders} color="emerald" to="/admin/orders" delay={0.2} />
        <StatCard icon={FiAlertTriangle} label="Low Stock" value={stats?.lowStock} color="orange" to="/admin/products" delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass rounded-2xl border border-white/5">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white text-sm">Recent Orders</h3>
            <Link to="/admin/orders" className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-1">
              View All <FiArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-5 py-3 flex justify-between">
                  <div className="skeleton h-4 w-32 rounded" />
                  <div className="skeleton h-4 w-16 rounded" />
                </div>
              ))
            ) : recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">No orders yet</p>
            ) : recentOrders.map(order => (
              <div key={order._id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{order.user?.name || 'Guest'}</p>
                  <p className="text-xs text-slate-400">{order.items?.length || 0} items</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{formatCurrency(order.totalAmount)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass rounded-2xl border border-white/5">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <FiAlertTriangle className="text-orange-400 text-sm" /> Low Stock Alerts
            </h3>
            <Link to="/admin/products" className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-1">
              Manage <FiArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-5 py-3 flex justify-between">
                  <div className="skeleton h-4 w-36 rounded" />
                  <div className="skeleton h-4 w-12 rounded" />
                </div>
              ))
            ) : lowStock.length === 0 ? (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">All products are well-stocked ✓</p>
            ) : lowStock.map(p => (
              <div key={p._id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={p.images?.[0]?.url || ''} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-700" />
                  <p className="text-sm text-white line-clamp-1">{p.name}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${p.stock === 0 ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  {p.stock === 0 ? 'OUT' : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="mt-6 glass rounded-2xl p-5 border border-white/5">
        <h3 className="font-semibold text-white text-sm mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/products/add" className="btn-primary text-sm">+ Add Product</Link>
          <Link to="/admin/categories" className="btn-secondary text-sm">Manage Categories</Link>
          <Link to="/admin/orders" className="btn-secondary text-sm">View Orders</Link>
        </div>
      </motion.div>
    </div>
  );
}
