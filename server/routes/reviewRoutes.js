const express = require('express');
const router = express.Router();
const {
  getReviewsForPlace,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/user/my-reviews', protect, getUserReviews);
router.get('/:placeId', getReviewsForPlace);
router.post('/:placeId', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
