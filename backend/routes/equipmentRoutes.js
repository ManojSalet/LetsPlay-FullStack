const express = require('express');
const router = express.Router();
const {
  addEquipment,
  updateEquipment,
  deleteEquipment,
  findOneEquipment,
  showAllEquipment,
  showEquipmentBySport,
} = require('../controllers/equipmentController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public catalog routes
router.get('/all', showAllEquipment);
router.get('/find/:equipmentId', findOneEquipment);
router.get('/by-sport/:sportId', showEquipmentBySport);

// Protected Admin mutations
router.post('/add', protect, adminOnly, addEquipment);
router.put('/update/:equipmentId', protect, adminOnly, updateEquipment);
router.delete('/delete/:equipmentId', protect, adminOnly, deleteEquipment);

module.exports = router;
