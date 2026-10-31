const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reporterName: {
      type: String,
      default: 'Anonymous',
    },
    issueType: {
      type: String,
      enum: [
        'Incorrect Accessibility Features',
        'Place Closed or Moved',
        'Broken Equipment / Ramp / Elevator',
        'Misleading Description',
        'Other',
      ],
      default: 'Incorrect Accessibility Features',
    },
    description: {
      type: String,
      required: [true, 'Please explain what information is incorrect'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
