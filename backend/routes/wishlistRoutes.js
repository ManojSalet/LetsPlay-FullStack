const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { addToWishlist, getWishlist, removeFromWishlist, deleteWishlist } = require('../controllers/wishlistController');

// Route to add a product to wishlist
router.post('/add',protect, addToWishlist);
// Route to view wishlist
router.get('/',protect, getWishlist);
// Route to remove a product from wishlist
router.delete('/remove',protect, removeFromWishlist);
// Route to delete entire wishlist
router.delete('/delete',protect, deleteWishlist);

module.exports = router;
