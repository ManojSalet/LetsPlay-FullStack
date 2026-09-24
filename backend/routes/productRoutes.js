const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public catalog routes
router.get('/', productController.showAllProducts);
router.get('/all', productController.showAllProducts);
router.get('/:productId', productController.viewProduct);
router.get('/equipment/:equipmentId', productController.viewProductsByEquipment);
router.get('/sport/:sportId', productController.viewProductsBySport);

// Protected Admin mutations
router.post('/addProduct', protect, adminOnly, productController.addProduct);
router.put('/updateProduct/:productId', protect, adminOnly, productController.updateProduct);
router.delete('/deleteProduct/:productId', protect, adminOnly, productController.deleteProduct);

module.exports = router;
