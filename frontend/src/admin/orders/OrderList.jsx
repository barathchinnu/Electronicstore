import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown, FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { openWhatsApp } from '../../utils/whatsapp';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  Pending: 'bg-yellow-500/20 text-yellow-400',
  Contacted: 'bg-blue-500/20 text-blue-400',
  Confirmed: 'bg-purple-500/20 text-purple-400',
  Completed: 'bg-green-500/20 text-green-400',
  Cancelled: 'bg-red-500/20 text-red-400',
};
const STATUSES = ['Pending', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const { data } = await getOrders(params);
      setOrders(data.data || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [filter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold font-display text-white">WhatsApp Orders</h1>
          <p className="text-slate-400 text-sm">{orders.length} enquiries</p>
        </div>
        <div className="relative">
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="input-dark pr-8 text-sm appearance-none">
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-white/5">
          <FiMessageCircle className="text-4xl text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 border border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {order.user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{order.user?.name || 'Guest'}</p>
                    <p className="text-slate-400 text-xs">{order.user?.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-white font-medium">{formatCurrency(order.totalAmount)}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">{order.items?.length || 0} items</span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 ml-13 sm:ml-0">
                  <span className={`badge text-xs ${STATUS_COLORS[order.status] || 'bg-slate-700 text-slate-400'}`}>
                    {order.status}
                  </span>
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                      className="input-dark text-xs py-1.5 pr-7 appearance-none"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
                  </div>
                  {order.whatsappNumber && (
                    <button
                      onClick={() => openWhatsApp(`Hi ${order.user?.name || ''}, regarding your order...`, order.whatsappNumber)}
                      className="p-2 rounded-xl bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-all"
                      title="Contact on WhatsApp"
                    >
                      <FaWhatsapp className="text-sm" />
                    </button>
                  )}
                </div>
              </div>

              {/* Items */}
              {order.items?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                  {order.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 text-xs text-slate-300">
                      <span>{item.name}</span>
                      <span className="text-slate-500">×{item.quantity}</span>
                      <span className="text-blue-400">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
