import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiUpload,
  FiMessageSquare,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import {
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
} from '../../services/bannerService';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deletingBanner, setDeletingBanner] = useState(null);

  // Form states
  const [form, setForm] = useState({
    tag: '',
    title: '',
    sub: '',
    desc: '',
    waMsg: '',
    bg: 'from-blue-900 via-indigo-900 to-slate-900',
    accentBg: 'bg-[#ffe500] text-slate-950',
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminBanners();
      setBanners(data.data || []);
    } catch (err) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setForm({
      tag: 'LIMITED TIME DEAL',
      title: '',
      sub: '',
      desc: '',
      waMsg: '',
      bg: 'from-blue-900 via-indigo-900 to-slate-900',
      accentBg: 'bg-[#ffe500] text-slate-950',
      isActive: true,
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setEditingBanner(banner);
    setForm({
      tag: banner.tag,
      title: banner.title,
      sub: banner.sub || '',
      desc: banner.desc || '',
      waMsg: banner.waMsg || '',
      bg: banner.bg || 'from-blue-900 via-indigo-900 to-slate-900',
      accentBg: banner.accentBg || 'bg-[#ffe500] text-slate-950',
      isActive: banner.isActive,
    });
    setImageFile(null);
    setImagePreview(banner.image?.url || '');
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await updateBanner(banner._id, { isActive: !banner.isActive });
      toast.success(`Banner ${banner.isActive ? 'deactivated' : 'activated'}`);
      fetchBanners();
    } catch (err) {
      toast.error('Failed to update banner status');
    }
  };

  const handleDelete = async () => {
    if (!deletingBanner) return;
    try {
      await deleteBanner(deletingBanner._id);
      toast.success('Banner deleted');
      setDeletingBanner(null);
      fetchBanners();
    } catch (err) {
      toast.error('Failed to delete banner');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageData = editingBanner ? editingBanner.image : null;

      // Handle file upload first if a new file is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await uploadBannerImage(formData);
        imageData = uploadRes.data.data; // { url, publicId }
      }

      if (!imageData) {
        toast.error('Please upload an offer image');
        setUploading(false);
        return;
      }

      const bannerData = {
        ...form,
        image: imageData,
      };

      if (editingBanner) {
        await updateBanner(editingBanner._id, bannerData);
        toast.success('Banner updated successfully');
      } else {
        await createBanner(bannerData);
        toast.success('Banner created successfully');
      }

      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save banner');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold font-display text-white">
            Home Carousel Banners
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Manage banner images and special offers shown on the home page
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all self-start sm:self-auto whitespace-nowrap cursor-pointer"
        >
          <FiPlus className="text-sm" />
          Add Offer Banner
        </button>
      </div>

      {/* BANNER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-[200px] animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-4 bg-slate-800 rounded w-1/4" />
                <div className="h-6 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
              </div>
              <div className="h-8 bg-slate-800 rounded w-1/3" />
            </div>
          ))
        ) : banners.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl py-12 px-5 text-center">
            <p className="text-slate-400 text-sm">
              No offer banners defined. Homepage is displaying default static banners.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold hover:bg-blue-600/30 transition-all cursor-pointer"
            >
              Create Your First Banner
            </button>
          </div>
        ) : (
          banners.map((banner) => (
            <motion.div
              key={banner._id}
              layout
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between"
            >
              {/* Banner visual simulation */}
              <div
                className={`bg-gradient-to-r ${banner.bg} text-white p-5 min-h-[160px] flex justify-between gap-3 relative`}
              >
                <div className="max-w-[65%] z-10 flex flex-col justify-between h-full">
                  <div>
                    <span
                      className={`inline-block font-extrabold text-[9px] px-2 py-0.5 rounded-full mb-1.5 uppercase tracking-wider ${banner.accentBg}`}
                    >
                      {banner.tag}
                    </span>
                    <h3 className="text-lg font-black font-display tracking-tight leading-tight line-clamp-1">
                      {banner.title}
                    </h3>
                    {banner.sub && (
                      <p className="text-xs font-bold text-yellow-300 line-clamp-1 mt-0.5">
                        {banner.sub}
                      </p>
                    )}
                    {banner.desc && (
                      <p className="text-[10px] text-slate-300 line-clamp-2 mt-1 font-medium">
                        {banner.desc}
                      </p>
                    )}
                  </div>

                  {banner.waMsg && (
                    <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-slate-950/60 px-2 py-1 rounded-md self-start mt-2">
                      <FiMessageSquare className="text-xs" /> WhatsApp enabled
                    </div>
                  )}
                </div>

                {banner.image?.url && (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-white/10 shadow-lg flex-shrink-0 bg-slate-950 p-1 self-center">
                    <img
                      src={banner.image.url}
                      alt={banner.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="px-5 py-3.5 bg-slate-950/50 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400">
                    Status:{' '}
                    <span
                      className={banner.isActive ? 'text-emerald-400' : 'text-slate-500'}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </span>

                  <button
                    onClick={() => handleToggleActive(banner)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    title={banner.isActive ? 'Deactivate Banner' : 'Activate Banner'}
                  >
                    {banner.isActive ? (
                      <FiEyeOff className="text-sm text-slate-400" />
                    ) : (
                      <FiEye className="text-sm text-emerald-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(banner)}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all cursor-pointer"
                    title="Edit Banner"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>

                  <button
                    onClick={() => setDeletingBanner(banner)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                    title="Delete Banner"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>

              <h2 className="text-lg font-bold text-white mb-4">
                {editingBanner ? 'Edit Banner Offer' : 'Create Banner Offer'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="label-dark">Offer Banner Image</label>
                  <div className="mt-1 flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 p-1 flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-[10px] cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="w-24 h-24 border border-dashed border-slate-700 hover:border-slate-500 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-slate-300 transition-colors cursor-pointer bg-slate-950/40">
                        <FiUpload className="text-lg mb-1" />
                        <span className="text-[10px] font-bold">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}

                    <div className="text-xs text-slate-500 font-medium">
                      <p>Select a banner image demonstrating the product offer.</p>
                      <p className="mt-1">Recommended size: 800x800 px or square.</p>
                    </div>
                  </div>
                </div>

                {/* Tag & Accent Color */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-dark">Tag / Label</label>
                    <input
                      type="text"
                      value={form.tag}
                      onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}
                      placeholder="e.g. FLASH SALE"
                      className="input-dark text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="label-dark">Tag Accent Styling</label>
                    <select
                      value={form.accentBg}
                      onChange={(e) => setForm((p) => ({ ...p, accentBg: e.target.value }))}
                      className="input-dark text-xs"
                    >
                      <option value="bg-[#ffe500] text-slate-950">Yellow (Default)</option>
                      <option value="bg-cyan-400 text-slate-950">Cyan</option>
                      <option value="bg-emerald-400 text-slate-950">Emerald</option>
                      <option value="bg-purple-600 text-white">Purple</option>
                      <option value="bg-rose-500 text-white">Rose</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="label-dark">Banner Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Dolby Atmos Soundbars"
                    className="input-dark text-xs"
                    required
                  />
                </div>

                {/* Sub Title */}
                <div>
                  <label className="label-dark">Sub-heading (Promo text)</label>
                  <input
                    type="text"
                    value={form.sub}
                    onChange={(e) => setForm((p) => ({ ...p, sub: e.target.value }))}
                    placeholder="e.g. Up to 55% Off • Starting ₹2,999"
                    className="input-dark text-xs"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="label-dark">Description</label>
                  <textarea
                    value={form.desc}
                    onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
                    placeholder="Short description of the offer..."
                    rows={2}
                    className="input-dark text-xs resize-none"
                  />
                </div>

                {/* background gradient & whatsapp */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-dark">Background Gradient</label>
                    <select
                      value={form.bg}
                      onChange={(e) => setForm((p) => ({ ...p, bg: e.target.value }))}
                      className="input-dark text-xs"
                    >
                      <option value="from-blue-900 via-indigo-900 to-slate-900">
                        Midnight Blue (Default)
                      </option>
                      <option value="from-slate-950 via-purple-950 to-indigo-950">
                        Deep Purple
                      </option>
                      <option value="from-rose-950 via-red-900 to-amber-950">
                        Sunset Red
                      </option>
                      <option value="from-emerald-950 via-teal-900 to-slate-950">
                        Emerald Teal
                      </option>
                      <option value="from-slate-800 to-slate-900">Charcoal Dark</option>
                    </select>
                  </div>

                  <div>
                    <label className="label-dark">WhatsApp Buy Text (Optional)</label>
                    <input
                      type="text"
                      value={form.waMsg}
                      onChange={(e) => setForm((p) => ({ ...p, waMsg: e.target.value }))}
                      placeholder="e.g. Hi! I want to order Dolby Soundbars offer"
                      className="input-dark text-xs"
                    />
                  </div>
                </div>

                {/* Is Active */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-600 cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-xs font-semibold text-slate-300 cursor-pointer select-none">
                    Show immediately in home carousel banner (Active)
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                  >
                    {uploading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Offer'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={!!deletingBanner}
        onClose={() => setDeletingBanner(null)}
        onConfirm={handleDelete}
        title="Delete Banner Offer"
        message={`Are you sure you want to delete the banner "${deletingBanner?.title}"? This will permanently remove it from the home carousel.`}
        confirmText="Delete"
      />
    </div>
  );
}
