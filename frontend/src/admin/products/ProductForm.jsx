import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX, FiPlus, FiMinus, FiPackage, FiTag, FiDollarSign, FiFileText, FiList, FiImage, FiFlag } from 'react-icons/fi';
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
    if ((name === 'price' || name === 'originalPrice') && (name === 'price' ? form.originalPrice : value)) {
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
          <FiPackage className="text-blue-400" /> Basic Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-dark">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Sony WH-1000XM5 Wireless Headphones" className="input-dark w-full" required />
          </div>
          <div>
            <label className="label-dark">Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Sony" className="input-dark w-full" />
          </div>
          <div>
            <label className="label-dark">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-dark w-full bg-slate-950 text-white" required>
              <option value="" className="bg-slate-900 text-slate-400">Select category</option>
              {categories.map(c => (
                <option key={c._id} value={c.name} className="bg-slate-900 text-white">
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-dark">Stock Units *</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="10" className="input-dark w-full" min="0" required />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
          <FiDollarSign className="text-emerald-400" /> Pricing & Discounts
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label-dark">Selling Price (₹) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="1999" className="input-dark w-full" min="0" required />
          </div>
          <div>
            <label className="label-dark">Original Price / MRP (₹)</label>
            <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} placeholder="2999" className="input-dark w-full" min="0" />
          </div>
          <div>
            <label className="label-dark">Discount (%)</label>
            <input type="number" name="discount" value={form.discount} onChange={handleChange} placeholder="Auto-calculated" className="input-dark w-full" min="0" max="99" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
          <FiFileText className="text-amber-400" /> Product Description
        </h3>
        <textarea name="description" value={form.description} onChange={handleChange}
          rows={4} placeholder="Write detailed product features, highlights, and specs summary..." className="input-dark w-full resize-none" />
      </div>

      {/* Specifications */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <FiList className="text-purple-400" /> Key Specifications
          </h3>
          <button type="button" onClick={addSpec} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-600/30 transition-all">
            <FiPlus className="text-xs" /> Add Specification
          </button>
        </div>
        <div className="space-y-3">
          {form.specifications.map((spec, i) => (
            <div key={i} className="flex gap-2.5 items-center">
              <input value={spec.key} onChange={e => handleSpecChange(i, 'key', e.target.value)}
                placeholder="Feature (e.g. Battery Life)" className="input-dark flex-1 text-xs sm:text-sm" />
              <input value={spec.value} onChange={e => handleSpecChange(i, 'value', e.target.value)}
                placeholder="Detail (e.g. Up to 30 hours)" className="input-dark flex-1 text-xs sm:text-sm" />
              <button type="button" onClick={() => removeSpec(i)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-all">
                <FiMinus className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
          <FiImage className="text-cyan-400" /> Product Images (max 5)
        </h3>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-24 group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex items-center justify-center">
              <img src={img.url} alt="" className="w-full h-full object-contain" />
              <button type="button" onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110">
                <FiX className="text-xs" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/50 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-all cursor-pointer">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiUpload className="text-base mb-1" />
                  <span className="text-xs font-semibold">Upload Image</span>
                </>
              )}
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
        <p className="text-xs text-slate-400 font-medium">Supports JPG, PNG, WebP format. Maximum 5MB per file.</p>
      </div>

      {/* Flags */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
          <FiFlag className="text-rose-400" /> Display Flags
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'featured', label: '✨ Featured' },
            { name: 'bestSeller', label: '⭐ Best Seller' },
            { name: 'flashDeal', label: '🔥 Flash Deal' },
            { name: 'isActive', label: '✅ Active' },
          ].map(({ name, label }) => (
            <label key={name} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
              form[name] ? 'border-blue-500/60 bg-blue-500/15 text-blue-300 font-bold' : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
            }`}>
              <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="accent-blue-500 cursor-pointer" />
              <span className="text-xs sm:text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => navigate('/admin/products')} className="py-2.5 px-6 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-all cursor-pointer">
          Cancel
        </button>
        <button type="submit" disabled={loading || uploading} className="py-2.5 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-md transition-all disabled:opacity-60 cursor-pointer">
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving Product...
            </span>
          ) : submitLabel}
        </button>
      </div>
    </form>
  );
}

