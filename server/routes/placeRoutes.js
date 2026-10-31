const express = require('express');
const router = express.Router();
const {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  getMyPlaces,
  reportPlace,
  getMetadata,
} = require('../controllers/placeController');
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Metadata options
router.get('/meta/options', getMetadata);

// User's own submitted places
router.get('/user/my-places', protect, getMyPlaces);

// Public place search & retrieval
router.get('/', getPlaces);
router.get('/:id', getPlaceById);

// Place submission & management
router.post('/', protect, upload.array('images', 5), createPlace);
router.put('/:id', protect, upload.array('images', 5), updatePlace);
router.delete('/:id', protect, deletePlace);

// Report accessibility issue
router.post('/:id/report', optionalAuth, reportPlace);

module.exports = router;
