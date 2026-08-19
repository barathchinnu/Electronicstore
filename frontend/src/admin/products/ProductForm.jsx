import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { getCategories } from '../../services/categoryService';
import { uploadProductImages } from '../../services/productService';
import toast from 'react-hot-toast';

const initialForm = {
  name: '', brand: '', category: '', price: '', originalPrice: '', discount: '',
  stock: '', description: '', specifications: [{ key: '', value: '' }],
  featured: false, bestSeller: false, flashDeal: false, isActive: true,
};

export default function ProductForm({ initialData = null, onSubmit, submitLabel = 'Publish Product', loading = false }) {
  const [form, setForm] = useState(initialData || initialForm);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data.data || []));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    // Auto-calc discount
    if ((name === 'price' || name === 'originalPrice') && form.originalPrice && form.price) {
      const op = name === 'originalPrice' ? +value : +form.originalPrice;
      const pr = name === 'price' ? +value : +form.price;
      if (op > pr && op > 0) {
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value, discount: Math.round(((op - pr) / op) * 100) }));
      }
    }
  };

  const handleSpecChange = (i, field, value) => {
    setForm(p => {
      const specs = [...p.specifications];
      specs[i] = { ...specs[i], [field]: value };
      return { ...p, specifications: specs };
    });
  };

  const addSpec = () => setForm(p => ({ ...p, specifications: [...p.specifications, { key: '', value: '' }] }));
  const removeSpec = (i) => setForm(p => ({ ...p, specifications: p.specifications.filter((_, idx) => idx !== i) }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (images.length + files.length > 5) { toast.error('Max 5 images'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));
      const { data } = await uploadProductImages(formData);
      setImages(prev => [...prev, ...data.data]);
      toast.success(`${files.length} image(s) uploaded`);
    } catch { toast.error('Image upload failed'); }
    finally { setUploading(false); }
  };

  const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Product name required'); return; }
    if (!form.category) { toast.error('Category required'); return; }
    if (!form.price || isNaN(+form.price)) { toast.error('Valid price required'); return; }
    if (!form.stock && form.stock !== 0) { toast.error('Stock required'); return; }

    const payload = {
      ...form,
      price: +form.price,
      originalPrice: +form.originalPrice || +form.price,
      discount: +form.discount || 0,
      stock: +form.stock,
      specifications: form.specifications.filter(s => s.key && s.value),
      images,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
        <h3 className="font-semibold text-white text-sm border-b border-white/5 pb-3">Basic Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-dark">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Sony WH-1000XM5" className="input-dark w-full" required />
          </div>
          <div>
            <label className="label-dark">Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Sony" className="input-dark w-full" />
          </div>
          <div>
            <label className="label-dark">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-dark w-full" required>
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id} value={c.name}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-dark">Stock *</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" className="input-dark w-full" min="0" required />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
        <h3 className="font-semibold text-white text-sm border-b border-white/5 pb-3">Pricing</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label-dark">Selling Price (₹) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="1999" className="input-dark w-full" min="0" required />
          </div>
          <div>
            <label className="label-dark">Original Price (₹)</label>
            <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} placeholder="2999" className="input-dark w-full" min="0" />
          </div>
          <div>
            <label className="label-dark">Discount (%)</label>
            <input type="number" name="discount" value={form.discount} onChange={handleChange} placeholder="Auto-calculated" className="input-dark w-full" min="0" max="99" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
        <h3 className="font-semibold text-white text-sm border-b border-white/5 pb-3">Description</h3>
        <textarea name="description" value={form.description} onChange={handleChange}
          rows={4} placeholder="Detailed product description..." className="input-dark w-full resize-none" />
      </div>

      {/* Specifications */}
      <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="font-semibold text-white text-sm">Specifications</h3>
          <button type="button" onClick={addSpec} className="flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300">
            <FiPlus className="text-xs" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.specifications.map((spec, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={spec.key} onChange={e => handleSpecChange(i, 'key', e.target.value)}
                placeholder="Key (e.g. Battery Life)" className="input-dark flex-1 text-sm" />
              <input value={spec.value} onChange={e => handleSpecChange(i, 'value', e.target.value)}
                placeholder="Value (e.g. 30 hours)" className="input-dark flex-1 text-sm" />
              <button type="button" onClick={() => removeSpec(i)} className="text-slate-500 hover:text-red-400 p-1 transition-colors">
                <FiMinus className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
        <h3 className="font-semibold text-white text-sm border-b border-white/5 pb-3">Product Images (max 5)</h3>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 group">
              <img src={img.url} alt="" className="w-full h-full rounded-xl object-cover bg-slate-800" />
              <button type="button" onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiX className="text-white text-xs" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500/50 hover:text-blue-400 transition-all">
              {uploading ? (
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiUpload className="text-sm mb-1" />
                  <span className="text-xs">Upload</span>
                </>
              )}
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
        <p className="text-xs text-slate-500">Upload to Cloudinary. Supports JPG, PNG, WebP.</p>
      </div>

      {/* Flags */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="font-semibold text-white text-sm border-b border-white/5 pb-3 mb-4">Product Flags</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'featured', label: '✨ Featured' },
            { name: 'bestSeller', label: '⭐ Best Seller' },
            { name: 'flashDeal', label: '🔥 Flash Deal' },
            { name: 'isActive', label: '✅ Active' },
          ].map(({ name, label }) => (
            <label key={name} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
              form[name] ? 'border-blue-500/40 bg-blue-500/10 text-blue-300' : 'border-white/10 text-slate-400 hover:border-white/20'
            }`}>
              <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="accent-blue-500" />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary px-6">Cancel</button>
        <button type="submit" disabled={loading || uploading} className="btn-primary px-8 disabled:opacity-60">
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : submitLabel}
        </button>
      </div>
    </form>
  );
}
