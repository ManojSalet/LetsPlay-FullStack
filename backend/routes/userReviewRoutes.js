const express = require('express');
const router = express.Router();
const { addReview, updateReview, deleteReview, getProductReviews } = require('../controllers/ReviewController');
const { protect } = require('../middlewares/authMiddleware');

// Route to add a review
router.post('/add', protect, addReview);

// Route to update a review
router.put('/update', protect, updateReview);

// Route to delete a review
router.delete('/delete', protect, deleteReview);

// Route to get all reviews for a specific product
router.get('/product/:productId', protect, getProductReviews);

module.exports = router;
