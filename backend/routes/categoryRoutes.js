const express = require('express');
const {
	addCategory,
	updateCategory,
	deleteCategory,
	showCategories,
} = require('../controllers/categoryController');
const router = express.Router();

router.post('/add', addCategory);
router.put('/update/:categoryId', updateCategory);
router.delete('/delete/:categoryId', deleteCategory);
router.get('/', showCategories);

module.exports = router;
