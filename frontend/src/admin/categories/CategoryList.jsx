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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold font-display text-white">Categories</h1>
          <p className="text-slate-400 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm"><FiPlus /> Add Category</button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl border border-white/10 p-5 mb-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-sm">{editing ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-dark">Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Earphones" className="input-dark w-full" required />
                </div>
                <div>
                  <label className="label-dark">Icon</label>
                  <input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                    placeholder="Emoji e.g. 🎧" className="input-dark w-full" />
                </div>
              </div>
              {/* Quick Icon Picker */}
              <div>
                <p className="text-xs text-slate-400 mb-2">Quick pick:</p>
                <div className="flex flex-wrap gap-2">
                  {commonIcons.map(icon => (
                    <button key={icon} type="button" onClick={() => setForm(p => ({ ...p, icon }))}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${form.icon === icon ? 'bg-blue-500/30 border border-blue-500/50' : 'glass border border-white/10 hover:border-white/30'}`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-dark">Description</label>
                <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description" className="input-dark w-full" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm px-5">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary text-sm px-5 disabled:opacity-60">
                  {saving ? 'Saving...' : <><FiCheck /> {editing ? 'Update' : 'Create'}</>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 border border-white/5 hover:border-blue-500/20 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{cat.icon}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                    <FiEdit2 className="text-xs" />
                  </button>
                  <button onClick={() => setDeleting(cat)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-white text-sm">{cat.name}</p>
              {cat.description && <p className="text-slate-500 text-xs mt-1 line-clamp-2">{cat.description}</p>}
              <p className="text-xs text-slate-600 mt-2">/{cat.slug}</p>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => handleDelete(deleting?._id)}
        title="Delete Category"
        message={`Delete "${deleting?.name}"? Products in this category will not be deleted.`}
      />
    </div>
  );
}
