const express = require('express');
const {
  addCategory,
  updateCategory,
  deleteCategory,
  showCategories,
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public catalog routes
router.get('/', showCategories);

// Protected Admin mutations
router.post('/add', protect, adminOnly, addCategory);
router.put('/update/:categoryId', protect, adminOnly, updateCategory);
router.delete('/delete/:categoryId', protect, adminOnly, deleteCategory);

module.exports = router;
