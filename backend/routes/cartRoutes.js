const express = require('express');
const { addToCart, removeFromCart, getCart, updateCartQuantity } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add', protect, addToCart);
router.delete('/remove/:productId', protect, removeFromCart);
router.get('/', protect, getCart);
router.put('/update', protect, updateCartQuantity);
module.exports = router;
