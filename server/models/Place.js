const mongoose = require('mongoose');

const ACCESSIBILITY_FEATURES = [
  'Wheelchair Accessible',
  'Wheelchair Ramps',
  'Accessible Parking',
  'Accessible Restrooms',
  'Elevator Availability',
  'Braille Signage',
  'Audio Assistance',
  'Visual Assistance',
  'Sign Language Support',
  'Accessible Entrance',
  'Hearing Assistance',
];

const CATEGORIES = [
  'Restaurant',
  'Hotel',
  'Hospital',
  'Educational Institution',
  'Shopping Mall',
  'Park',
  'Transit / Station',
  'Cultural / Museum',
  'Library',
  'Sports & Entertainment',
  'Other',
];

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide place name'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: CATEGORIES,
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    address: {
      type: String,
      required: [true, 'Please provide the physical address'],
    },
    city: {
      type: String,
      required: [true, 'Please specify the city'],
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    zipCode: {
      type: String,
      default: '',
    },
    location: {
      lat: {
        type: Number,
        default: 40.7128,
      },
      lng: {
        type: Number,
        default: -74.006,
      },
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    accessibilityFeatures: {
      type: [String],
      enum: ACCESSIBILITY_FEATURES,
      default: [],
    },
    accessibilityNotes: {
      type: String,
      default: '',
    },
    openingHours: {
      type: String,
      default: 'Monday - Sunday: 9:00 AM - 9:00 PM',
    },
    contact: {
      phone: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        default: '',
      },
      website: {
        type: String,
        default: '',
      },
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for calculating accessibility score percentage
placeSchema.virtual('accessibilityScore').get(function () {
  if (!this.accessibilityFeatures || this.accessibilityFeatures.length === 0) return 0;
  return Math.round((this.accessibilityFeatures.length / ACCESSIBILITY_FEATURES.length) * 100);
});

// Configure virtuals to be included in toJSON and toObject outputs
placeSchema.set('toJSON', { virtuals: true });
placeSchema.set('toObject', { virtuals: true });

// Text search index
placeSchema.index({ name: 'text', description: 'text', address: 'text', city: 'text' });

module.exports = {
  Place: mongoose.model('Place', placeSchema),
  ACCESSIBILITY_FEATURES,
  CATEGORIES,
};
