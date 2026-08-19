import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getProducts, deleteProduct } from '../../services/productService';
import ConfirmModal from '../../components/ConfirmModal';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.keyword = search;
      const { data } = await getProducts(params);
      setProducts(data.data || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.pages || 1);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete product'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold font-display text-white">Products</h1>
          <p className="text-slate-400 text-sm">{total} total products</p>
        </div>
        <Link to="/admin/products/add" className="btn-primary text-sm">
          <FiPlus /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="input-dark w-full sm:w-80 pl-10 text-sm"
        />
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Stock</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {[1,2,3,4,5].map(j => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded w-full" /></td>)}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">No products found</td>
                </tr>
              ) : products.map(product => (
                <motion.tr key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0]?.url || 'https://placehold.co/40x40/1e293b/475569?text=?'}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover bg-slate-800 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium line-clamp-1">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="badge bg-blue-500/15 text-blue-400 text-xs">{product.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-white font-medium">{formatCurrency(product.price)}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`badge text-xs ${
                      product.stock === 0 ? 'bg-red-500/20 text-red-400' :
                      product.stock <= 5 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? `Low (${product.stock})` : product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/edit/${product._id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        <FiEdit2 className="text-sm" />
                      </Link>
                      <button onClick={() => setDeleting(product)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-40 border border-white/10">
            <FiChevronLeft className="text-sm" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-blue-600 text-white' : 'glass text-slate-400 hover:text-white border border-white/10'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-40 border border-white/10">
            <FiChevronRight className="text-sm" />
          </button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => handleDelete(deleting?._id)}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleting?.name}"? This cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}
