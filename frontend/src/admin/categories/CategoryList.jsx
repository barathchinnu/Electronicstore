import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', icon: '📦', slug: '' };

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await getCategories();
      setCategories(data.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '📦', slug: cat.slug || '' });
    setEditing(cat._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Category name required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing, form);
        toast.success('Category updated!');
      } else {
        await createCategory({ ...form, slug: form.name.toLowerCase().replace(/\s+/g, '-') });
        toast.success('Category created!');
      }
      setShowForm(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      fetch();
    } catch { toast.error('Failed to delete category'); }
  };

  const commonIcons = ['🎧', '⌚', '🔊', '🔌', '🔋', '🎮', '💻', '📱', '🖱️', '⌨️', '📷', '🎙️', '🔦', '🖥️'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-white">Product Categories</h1>
          <p className="text-slate-400 text-xs mt-0.5">{categories.length} total categories configured</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto cursor-pointer">
          <FiPlus className="text-sm" /> Add Category
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">{editing ? 'Edit Category' : 'Create New Category'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white p-1">
                <FiX className="text-base" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-dark">Category Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Earphones" className="input-dark w-full text-xs sm:text-sm font-medium" required />
                </div>
                <div>
                  <label className="label-dark">Category Emoji / Icon</label>
                  <input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                    placeholder="Emoji e.g. 🎧" className="input-dark w-full text-xs sm:text-sm font-medium" />
                </div>
              </div>
              {/* Quick Icon Picker */}
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-2">Quick Pick Icon:</p>
                <div className="flex flex-wrap gap-2">
                  {commonIcons.map(icon => (
                    <button key={icon} type="button" onClick={() => setForm(p => ({ ...p, icon }))}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                        form.icon === icon ? 'bg-blue-600/30 border border-blue-500 text-white shadow-xs' : 'bg-slate-950 border border-slate-800 hover:border-slate-700'
                      }`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-dark">Short Description</label>
                <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brief category summary" className="input-dark w-full text-xs sm:text-sm font-medium" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-60 cursor-pointer flex items-center gap-1.5">
                  {saving ? 'Saving...' : <><FiCheck /> {editing ? 'Update Category' : 'Create Category'}</>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-slate-900 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all group shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl p-2 rounded-xl bg-slate-950 border border-slate-800/80 inline-block">{cat.icon}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all cursor-pointer" title="Edit">
                      <FiEdit2 className="text-xs" />
                    </button>
                    <button onClick={() => setDeleting(cat)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer" title="Delete">
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>
                <p className="font-bold text-white text-sm sm:text-base mt-1">{cat.name}</p>
                {cat.description && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{cat.description}</p>}
              </div>
              <p className="text-[11px] text-blue-400 font-mono font-medium mt-3">/{cat.slug}</p>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => handleDelete(deleting?._id)}
        title="Delete Category"
        message={`Delete category "${deleting?.name}"? Products in this category will remain intact.`}
      />
    </div>
  );
}

