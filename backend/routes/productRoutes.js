const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/addProduct', productController.addProduct);
router.put('/updateProduct/:productId', productController.updateProduct);
router.delete('/deleteProduct/:productId', productController.deleteProduct);
router.get('/all', productController.showAllProducts);
router.get('/:productId', productController.viewProduct);
router.get('/equipment/:equipmentId', productController.viewProductsByEquipment);

module.exports = router;
