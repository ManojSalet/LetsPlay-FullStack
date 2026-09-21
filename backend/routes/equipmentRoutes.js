const express = require('express');
const router = express.Router();
const {
	addEquipment,
	updateEquipment,
	deleteEquipment,
	findOneEquipment,
	showAllEquipment,
	showEquipmentBySport
} = require('../controllers/equipmentController');


router.post('/add', addEquipment);
router.put('/update/:equipmentId', updateEquipment);
router.delete('/delete/:equipmentId', deleteEquipment);
router.get('/find/:equipmentId', findOneEquipment);
router.get('/all', showAllEquipment);
router.get('/by-sport/:sportId', showEquipmentBySport);

module.exports = router;
