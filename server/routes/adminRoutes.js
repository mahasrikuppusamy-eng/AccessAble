const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getPendingPlaces,
  getAllPlacesAdmin,
  approvePlace,
  rejectPlace,
  getAllReviewsAdmin,
  getAllReportsAdmin,
} = require('../controllers/adminController');
const { protect, authorizeAdmin } = require('../middleware/auth');

router.use(protect);
router.use(authorizeAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

router.get('/places/pending', getPendingPlaces);
router.get('/places/all', getAllPlacesAdmin);
router.put('/places/:id/approve', approvePlace);
router.put('/places/:id/reject', rejectPlace);

router.get('/reviews', getAllReviewsAdmin);
router.get('/reports', getAllReportsAdmin);

module.exports = router;
