const User = require('../models/User');
const { Place } = require('../models/Place');
const Review = require('../models/Review');
const Report = require('../models/Report');

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPlaces = await Place.countDocuments();
    const pendingPlaces = await Place.countDocuments({ status: 'pending' });
    const approvedPlaces = await Place.countDocuments({ status: 'approved' });
    const rejectedPlaces = await Place.countDocuments({ status: 'rejected' });
    const totalReviews = await Review.countDocuments();
    const totalReports = await Report.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalPlaces,
        pendingPlaces,
        approvedPlaces,
        rejectedPlaces,
        totalReviews,
        totalReports,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin statistics',
    });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching users',
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `User ${user.name} was successfully removed`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting user',
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user role',
    });
  }
};

// @desc    Get all pending place submissions
// @route   GET /api/admin/places/pending
// @access  Private (Admin)
const getPendingPlaces = async (req, res) => {
  try {
    const pendingPlaces = await Place.find({ status: 'pending' })
      .populate('submittedBy', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pendingPlaces.length,
      places: pendingPlaces,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching pending places',
    });
  }
};

// @desc    Get all places regardless of status for admin
// @route   GET /api/admin/places/all
// @access  Private (Admin)
const getAllPlacesAdmin = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const places = await Place.find(filter)
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: places.length,
      places,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin places',
    });
  }
};

// @desc    Approve place submission
// @route   PUT /api/admin/places/:id/approve
// @access  Private (Admin)
const approvePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found',
      });
    }

    place.status = 'approved';
    place.rejectionReason = '';
    await place.save();

    res.json({
      success: true,
      message: `Place "${place.name}" has been approved and is now live!`,
      place,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error approving place',
    });
  }
};

// @desc    Reject place submission
// @route   PUT /api/admin/places/:id/reject
// @access  Private (Admin)
const rejectPlace = async (req, res) => {
  try {
    const { reason } = req.body;
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found',
      });
    }

    place.status = 'rejected';
    place.rejectionReason = reason || 'Does not meet verification criteria';
    await place.save();

    res.json({
      success: true,
      message: `Place "${place.name}" has been rejected`,
      place,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error rejecting place',
    });
  }
};

// @desc    Get all reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private (Admin)
const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email profileImage')
      .populate('place', 'name category city')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reviews for moderation',
    });
  }
};

// @desc    Get all accessibility issue reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
const getAllReportsAdmin = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('place', 'name category address city')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching accessibility reports',
    });
  }
};

module.exports = {
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
};
