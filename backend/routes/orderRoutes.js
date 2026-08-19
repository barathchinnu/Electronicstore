const express = require('express');
const router = express.Router();
const {
  createOrder, getOrders, getMyOrders, updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', createOrder);
router.get('/', protect, adminOnly, getOrders);
router.get('/my', protect, getMyOrders);
router.put('/:id', protect, adminOnly, updateOrderStatus);

module.exports = router;
