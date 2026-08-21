import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

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

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const params = {
        page,
        limit: 10,
      };

      if (search) {
        params.keyword = search;
      }

      const { data } = await getProducts(params);

      setProducts(data.data || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      setDeleting(null);
      // If we just deleted the last item on this page, go back one page
      const remainingOnPage = products.length - 1;
      if (remainingOnPage === 0 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchProducts();
      }
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold font-display text-white">
            Product Inventory
          </h1>

          <p className="text-slate-400 text-xs mt-0.5">
            {total} total products listed
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto whitespace-nowrap"
        >
          <FiPlus className="text-sm" />
          Add Product
        </Link>
      </div>

      {/* SEARCH */}
      <div className="relative w-full">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

        <input
          type="text"
          placeholder="Search products by name or brand..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input-dark w-full sm:w-80 pl-10 text-xs sm:text-sm font-medium"
        />
      </div>

      {/* TABLE */}
      <div className="w-full max-w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">

        {/* IMPORTANT:
            horizontal scrolling belongs here
        */}
        <div className="w-full max-w-full overflow-x-auto">

          <table className="w-full min-w-[950px] text-left border-collapse table-fixed">

            <colgroup>
              <col className="w-[38%]" />
              <col className="w-[18%]" />
              <col className="w-[15%]" />
              <col className="w-[17%]" />
              <col className="w-[12%]" />
            </colgroup>

            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50">

                {/* PRODUCT */}
                <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Product
                </th>

                {/* CATEGORY */}
                <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Category
                </th>

                {/* PRICE */}
                <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Selling Price
                </th>

                {/* STOCK */}
                <th className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Stock Status
                </th>

                {/* ACTIONS */}
                <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">

              {/* LOADING */}
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>

                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-slate-800 rounded animate-pulse w-full" />
                      </td>
                    ))}

                  </tr>
                ))
              ) : products.length === 0 ? (

                /* EMPTY */
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-slate-400 text-xs"
                  >
                    No products found matching your search
                  </td>
                </tr>

              ) : (

                /* PRODUCTS */
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >

                    {/* PRODUCT */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">

                        <img
                          src={
                            product.images?.[0]?.url ||
                            'https://placehold.co/48x48/1e293b/475569?text=?'
                          }
                          alt={product.name || 'Product'}
                          className="w-12 h-12 rounded-lg object-contain bg-slate-950 p-1 border border-slate-800 flex-shrink-0"
                        />

                        <div className="min-w-0">
                          <p
                            className="text-sm text-white font-bold truncate"
                            title={product.name}
                          >
                            {product.name}
                          </p>

                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            {product.brand || 'Insta Digital'}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex badge bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[11px] font-bold whitespace-nowrap">
                        {product.category}
                      </span>
                    </td>

                    {/* PRICE */}
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-white font-extrabold whitespace-nowrap">
                        {formatCurrency(product.price)}
                      </span>
                    </td>

                    {/* STOCK */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex badge text-[11px] font-bold whitespace-nowrap ${product.stock === 0
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : product.stock <= 5
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                      >
                        {product.stock === 0
                          ? 'Out of Stock'
                          : product.stock <= 5
                            ? `Low (${product.stock})`
                            : `${product.stock} units`}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">

                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all"
                          title="Edit Product"
                        >
                          <FiEdit2 className="text-sm" />
                        </Link>

                        <button
                          onClick={() => setDeleting(product)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>

        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">

          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
          >
            <FiChevronLeft className="text-sm" />
          </button>

          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${p === page
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={page === totalPages}
            className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
          >
            <FiChevronRight className="text-sm" />
          </button>

        </div>
      )}

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => handleDelete(deleting?._id)}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />

    </div>
  );
}