const express = require('express');
const { addAddress, updateAddress, deleteAddress, showAddresses } = require('../controllers/addressController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/add',protect, addAddress);

router.put('/update/:addressId',protect, updateAddress);

router.delete('/delete/:addressId',protect, deleteAddress);

router.get('/:userId',protect, showAddresses);

module.exports = router;

