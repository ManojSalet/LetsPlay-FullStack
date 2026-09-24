const express = require('express');
const {
  addSport,
  updateSport,
  deleteSport,
  findOneSport,
  showAllSports,
  showSportsByCategory,
} = require('../controllers/sportController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public catalog routes
router.get('/', showAllSports);
router.get('/:sportId', findOneSport);
router.get('/category/:categoryId', showSportsByCategory);

// Protected Admin mutations
router.post('/add', protect, adminOnly, addSport);
router.put('/update/:sportId', protect, adminOnly, updateSport);
router.delete('/delete/:sportId', protect, adminOnly, deleteSport);

module.exports = router;
