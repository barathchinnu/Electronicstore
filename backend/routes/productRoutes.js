const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getProducts, getProduct, createProduct, updateProduct,
  deleteProduct, uploadImages, addReview,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/upload/images', protect, adminOnly, upload.array('images', 6), uploadImages);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
