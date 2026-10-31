const Favorite = require('../models/Favorite');
const { Place } = require('../models/Place');

// @desc    Get user's favorite places
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'place',
        populate: {
          path: 'submittedBy',
          select: 'name',
        },
      })
      .sort({ createdAt: -1 });

    // Filter out any favorites where the place might have been deleted
    const validFavorites = favorites.filter((fav) => fav.place !== null);

    res.json({
      success: true,
      count: validFavorites.length,
      favorites: validFavorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching favorites',
    });
  }
};

// @desc    Add place to favorites
// @route   POST /api/favorites/:placeId
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const placeId = req.params.placeId;

    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found',
      });
    }

    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      place: placeId,
    });

    if (existingFavorite) {
      return res.json({
        success: true,
        message: 'Place is already in your favorites',
        favorite: existingFavorite,
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      place: placeId,
    });

    res.status(201).json({
      success: true,
      message: 'Place saved to favorites!',
      favorite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error saving favorite',
    });
  }
};

// @desc    Remove place from favorites
// @route   DELETE /api/favorites/:placeId
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const placeId = req.params.placeId;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      place: placeId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found',
      });
    }

    res.json({
      success: true,
      message: 'Place removed from favorites',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing favorite',
    });
  }
};

// @desc    Check if a place is favorited by current user
// @route   GET /api/favorites/check/:placeId
// @access  Private
const checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user._id,
      place: req.params.placeId,
    });

    res.json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking favorite status',
    });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
};
