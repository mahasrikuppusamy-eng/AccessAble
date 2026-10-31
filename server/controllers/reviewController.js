const Review = require('../models/Review');
const { Place } = require('../models/Place');

// @desc    Get all reviews for a place
// @route   GET /api/reviews/:placeId
// @access  Public
const getReviewsForPlace = async (req, res) => {
  try {
    const reviews = await Review.find({ place: req.params.placeId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reviews',
    });
  }
};

// @desc    Add review for a place
// @route   POST /api/reviews/:placeId
// @access  Private
const createReview = async (req, res) => {
  try {
    const { rating, comment, accessibilityHighlights, experienceDate } = req.body;
    const placeId = req.params.placeId;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both rating (1-5) and review comment',
      });
    }

    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found',
      });
    }

    // Check if user already reviewed this place
    const existingReview = await Review.findOne({
      place: placeId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this place. You can edit your existing review.',
      });
    }

    const review = await Review.create({
      place: placeId,
      user: req.user._id,
      rating: Number(rating),
      comment,
      accessibilityHighlights: accessibilityHighlights || [],
      experienceDate: experienceDate || '',
    });

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name profileImage'
    );

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting review',
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { rating, comment, accessibilityHighlights } = req.body;
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Ensure user is the owner
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review',
      });
    }

    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment;
    if (accessibilityHighlights) review.accessibilityHighlights = accessibilityHighlights;
    review.updatedAt = Date.now();

    await review.save();

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name profileImage'
    );

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating review',
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Ensure user is the owner or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting review',
    });
  }
};

// @desc    Get all reviews written by current user
// @route   GET /api/reviews/user/my-reviews
// @access  Private
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('place', 'name category images address city averageRating')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving user reviews',
    });
  }
};

module.exports = {
  getReviewsForPlace,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
};
