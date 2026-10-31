const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: [true, 'Review must be associated with a place'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide detailed feedback regarding accessibility'],
      trim: true,
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },
    experienceDate: {
      type: String,
      default: '',
    },
    accessibilityHighlights: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a user from submitting more than one review per place (optional or allow one active review)
reviewSchema.index({ place: 1, user: 1 });

// Static method to calculate average rating of a place
reviewSchema.statics.calculateAverageRating = async function (placeId) {
  const stats = await this.aggregate([
    {
      $match: { place: placeId },
    },
    {
      $group: {
        _id: '$place',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  const { Place } = require('./Place');
  if (stats.length > 0) {
    await Place.findByIdAndUpdate(placeId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].nRating,
    });
  } else {
    await Place.findByIdAndUpdate(placeId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
};

// Call calculateAverageRating after saving review
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.place);
});

// Call calculateAverageRating after deleting review
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.place);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
