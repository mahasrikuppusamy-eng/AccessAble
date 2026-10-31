const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getFavorites);
router.post('/:placeId', addFavorite);
router.delete('/:placeId', removeFavorite);
router.get('/check/:placeId', checkFavorite);

module.exports = router;
