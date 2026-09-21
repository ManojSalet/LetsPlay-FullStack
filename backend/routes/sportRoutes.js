const express = require('express');
const {
	addSport,
	updateSport,
	deleteSport,
	findOneSport,
	showAllSports,
	showSportsByCategory
} = require('../controllers/sportController');
const router = express.Router();

router.post('/add', addSport);
router.put('/update/:sportId', updateSport);
router.delete('/delete/:sportId', deleteSport);
router.get('/:sportId', findOneSport);
router.get('/', showAllSports);
router.get('/category/:categoryId', showSportsByCategory);

module.exports = router;
