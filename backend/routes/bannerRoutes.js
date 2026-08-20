const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const {
  getBanners,
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
} = require('../controllers/bannerController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Setup local storage for multer temp uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ⚠️  IMPORTANT: specific named routes must come before parameterized /:id routes
router.get('/', getBanners);
router.get('/admin', protect, adminOnly, getAdminBanners);
router.post('/upload', protect, adminOnly, upload.single('image'), uploadBannerImage); // must be before POST /:id
router.post('/', protect, adminOnly, createBanner);
router.put('/:id', protect, adminOnly, updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

module.exports = router;
