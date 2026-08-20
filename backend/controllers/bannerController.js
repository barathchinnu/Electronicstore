const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const Banner = require('../models/Banner');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, data: banners });
});

// @desc    Get all banners for admin
// @route   GET /api/banners/admin
// @access  Private/Admin
const getAdminBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: banners });
});

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
  const { tag, title, sub, desc, image, waMsg, bg, accentBg, isActive } = req.body;

  if (!tag || !title || !image || !image.url) {
    res.status(400);
    throw new Error('Please provide tag, title, and banner image');
  }

  const banner = await Banner.create({
    tag,
    title,
    sub,
    desc,
    image,
    waMsg,
    bg: bg || 'from-blue-900 via-indigo-900 to-slate-900',
    accentBg: accentBg || 'bg-[#ffe500] text-slate-950',
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({ success: true, data: banner });
});

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }

  const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: updatedBanner });
});

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }

  // Delete image from Cloudinary if it exists
  if (banner.image && banner.image.publicId) {
    try {
      await cloudinary.uploader.destroy(banner.image.publicId);
    } catch (err) {
      console.error('Failed to delete banner image from Cloudinary:', err.message);
    }
  }

  await banner.deleteOne();
  res.json({ success: true, message: 'Banner deleted successfully' });
});

// @desc    Upload banner image to Cloudinary
// @route   POST /api/banners/upload
// @access  Private/Admin
const uploadBannerImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'electrostore/banners',
      transformation: [{ width: 1200, height: 600, crop: 'limit', quality: 'auto' }],
    });

    // Clean up temp file from disk after successful upload
    try { fs.unlinkSync(req.file.path); } catch (_) {}

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (err) {
    // Clean up temp file even on failure
    try { fs.unlinkSync(req.file.path); } catch (_) {}
    res.status(500);
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
});

module.exports = {
  getBanners,
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
};
