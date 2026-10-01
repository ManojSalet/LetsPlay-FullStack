const express = require('express');
const {
  addAddress,
  updateAddress,
  deleteAddress,
  showAddresses,
  setDefaultAddress,
} = require('../controllers/addressController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add', protect, addAddress);
router.put('/update/:addressId', protect, updateAddress);
router.put('/default/:addressId', protect, setDefaultAddress);
router.delete('/delete/:addressId', protect, deleteAddress);
router.get('/', protect, showAddresses);
router.get('/my-addresses', protect, showAddresses);
router.get('/:userId', protect, showAddresses);

module.exports = router;
