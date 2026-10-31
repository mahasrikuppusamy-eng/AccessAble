const { Place, ACCESSIBILITY_FEATURES, CATEGORIES } = require('../models/Place');
const Review = require('../models/Review');
const Report = require('../models/Report');

// @desc    Get all accessible places with search, filter, sort, pagination
// @route   GET /api/places
// @access  Public
const getPlaces = async (req, res) => {
  try {
    const {
      search,
      category,
      features,
      city,
      sort,
      page = 1,
      limit = 12,
      minRating,
    } = req.query;

    const query = { status: 'approved' };

    // Search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { address: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== 'All' && category.trim() !== '') {
      query.category = category;
    }

    // City filter
    if (city && city.trim() !== '') {
      query.city = new RegExp(city.trim(), 'i');
    }

    // Accessibility features filter (must match all selected features)
    if (features) {
      const featureList = Array.isArray(features)
        ? features
        : features.split(',').map((f) => f.trim()).filter(Boolean);

      if (featureList.length > 0) {
        query.accessibilityFeatures = { $all: featureList };
      }
    }

    // Rating filter
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'rating_desc') {
      sortOption = { averageRating: -1, reviewCount: -1 };
    } else if (sort === 'rating_asc') {
      sortOption = { averageRating: 1 };
    } else if (sort === 'reviews') {
      sortOption = { reviewCount: -1 };
    } else if (sort === 'name_asc') {
      sortOption = { name: 1 };
    } else if (sort === 'score_desc') {
      // In MongoDB, we can sort by length of accessibilityFeatures or rely on averageRating
      sortOption = { averageRating: -1, createdAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const totalPlaces = await Place.countDocuments(query);
    const places = await Place.find(query)
      .populate('submittedBy', 'name email profileImage')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalPlaces / limitNum) || 1;

    res.json({
      success: true,
      count: places.length,
      total: totalPlaces,
      totalPages,
      currentPage: pageNum,
      places,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching places',
    });
  }
};

// @desc    Get single place by ID
// @route   GET /api/places/:id
// @access  Public
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate(
      'submittedBy',
      'name email profileImage'
    );

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found',
      });
    }

    // Fetch reviews for this place with reviewer information
    const reviews = await Review.find({ place: place._id })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      place,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving place details',
    });
  }
};

// @desc    Submit a new place
// @route   POST /api/places
// @access  Private
const createPlace = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      address,
      city,
      state,
      zipCode,
      lat,
      lng,
      images,
      accessibilityFeatures,
      accessibilityNotes,
      openingHours,
      phone,
      email,
      website,
    } = req.body;

    if (!name || !category || !description || !address || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, category, description, address, city',
      });
    }

    // If uploaded files exist from multer
    let placeImages = [];
    if (req.files && req.files.length > 0) {
      placeImages = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (images) {
      placeImages = Array.isArray(images)
        ? images
        : typeof images === 'string'
        ? [images]
        : [];
    }

    if (placeImages.length === 0) {
      placeImages = [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      ];
    }

    // Parse accessibility features
    let featuresArray = [];
    if (accessibilityFeatures) {
      featuresArray = Array.isArray(accessibilityFeatures)
        ? accessibilityFeatures
        : typeof accessibilityFeatures === 'string'
        ? JSON.parse(accessibilityFeatures)
        : [];
    }

    // Admins automatically get 'approved', regular users are 'pending'
    const status = req.user.role === 'admin' ? 'approved' : 'pending';

    const place = await Place.create({
      name,
      category,
      description,
      address,
      city,
      state: state || '',
      zipCode: zipCode || '',
      location: {
        lat: Number(lat) || 40.7128,
        lng: Number(lng) || -74.006,
      },
      images: placeImages,
      accessibilityFeatures: featuresArray,
      accessibilityNotes: accessibilityNotes || '',
      openingHours: openingHours || 'Mon - Sun: 9:00 AM - 9:00 PM',
      contact: {
        phone: phone || '',
        email: email || '',
        website: website || '',
      },
      status,
      submittedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message:
        status === 'approved'
          ? 'Place created and published successfully!'
          : 'Place submitted successfully and is pending admin verification!',
      place,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating place submission',
    });
  }
};

// @desc    Update a place
// @route   PUT /api/places/:id
// @access  Private (Owner or Admin)
const updatePlace = async (req, res) => {
  try {
    let place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found',
      });
    }

    // Check ownership or admin
    if (
      place.submittedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this place',
      });
    }

    const {
      name,
      category,
      description,
      address,
      city,
      state,
      zipCode,
      lat,
      lng,
      images,
      accessibilityFeatures,
      accessibilityNotes,
      openingHours,
      phone,
      email,
      website,
    } = req.body;

    if (name) place.name = name;
    if (category) place.category = category;
    if (description) place.description = description;
    if (address) place.address = address;
    if (city) place.city = city;
    if (state !== undefined) place.state = state;
    if (zipCode !== undefined) place.zipCode = zipCode;
    if (lat && lng) place.location = { lat: Number(lat), lng: Number(lng) };
    if (images) place.images = Array.isArray(images) ? images : [images];
    if (accessibilityFeatures) {
      place.accessibilityFeatures = Array.isArray(accessibilityFeatures)
        ? accessibilityFeatures
        : typeof accessibilityFeatures === 'string'
        ? JSON.parse(accessibilityFeatures)
        : place.accessibilityFeatures;
    }
    if (accessibilityNotes !== undefined) place.accessibilityNotes = accessibilityNotes;
    if (openingHours) place.openingHours = openingHours;
    if (phone || email || website) {
      place.contact = {
        phone: phone !== undefined ? phone : place.contact.phone,
        email: email !== undefined ? email : place.contact.email,
        website: website !== undefined ? website : place.contact.website,
      };
    }

    await place.save();

    res.json({
      success: true,
      message: 'Place updated successfully',
      place,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating place',
    });
  }
};

// @desc    Delete place
// @route   DELETE /api/places/:id
// @access  Private (Admin or Owner)
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found',
      });
    }

    if (
      place.submittedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this place',
      });
    }

    await Place.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ place: req.params.id });

    res.json({
      success: true,
      message: 'Place and its reviews deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting place',
    });
  }
};

// @desc    Get current user's submitted places
// @route   GET /api/places/user/my-places
// @access  Private
const getMyPlaces = async (req, res) => {
  try {
    const places = await Place.find({ submittedBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      places,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching your places',
    });
  }
};

// @desc    Report incorrect accessibility info
// @route   POST /api/places/:id/report
// @access  Public / Private
const reportPlace = async (req, res) => {
  try {
    const { issueType, description, reporterName } = req.body;
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found',
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a description of the issue',
      });
    }

    const report = await Report.create({
      place: place._id,
      user: req.user ? req.user._id : null,
      reporterName: req.user ? req.user.name : reporterName || 'Community Member',
      issueType: issueType || 'Incorrect Accessibility Features',
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your report has been submitted to the accessibility verification team.',
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting report',
    });
  }
};

// @desc    Get accessibility features and categories metadata
// @route   GET /api/places/meta/options
// @access  Public
const getMetadata = (req, res) => {
  res.json({
    success: true,
    features: ACCESSIBILITY_FEATURES,
    categories: CATEGORIES,
  });
};

module.exports = {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  getMyPlaces,
  reportPlace,
  getMetadata,
};
