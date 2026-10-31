const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const { Place } = require('../models/Place');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const Report = require('../models/Report');
const { users, places, sampleReviews } = require('./seedData');

dotenv.config();

const seedData = async (shouldExit = true) => {
  try {
    console.log('Seeding AccessAble database...');

    // Clear existing collections
    await User.deleteMany();
    await Place.deleteMany();
    await Review.deleteMany();
    await Favorite.deleteMany();
    await Report.deleteMany();

    console.log('Cleared existing collections.');

    // Insert users
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users (Admin: admin@accessable.org / admin123, User: user@accessable.org / user123).`);

    // Assign submittedBy to places
    const adminUser = createdUsers[0];
    const regularUser = createdUsers[1];

    const placesToInsert = places.map((place, index) => ({
      ...place,
      submittedBy: index % 2 === 0 ? adminUser._id : regularUser._id,
    }));

    const createdPlaces = await Place.insertMany(placesToInsert);
    console.log(`Created ${createdPlaces.length} places.`);

    // Insert reviews
    for (const review of sampleReviews) {
      const place = createdPlaces[review.placeIndex];
      const user = createdUsers[review.userIndex];

      if (place && user) {
        const createdReview = await Review.create({
          place: place._id,
          user: user._id,
          rating: review.rating,
          comment: review.comment,
          accessibilityHighlights: review.accessibilityHighlights,
          experienceDate: review.experienceDate,
        });
      }
    }
    console.log(`Created ${sampleReviews.length} detailed reviews.`);

    // Add a couple of initial favorites for regular user
    if (createdPlaces.length >= 2 && regularUser) {
      await Favorite.create({
        user: regularUser._id,
        place: createdPlaces[0]._id,
      });
      await Favorite.create({
        user: regularUser._id,
        place: createdPlaces[2]._id,
      });
      console.log('Added initial sample favorites for testing.');
    }

    console.log('Database seeded successfully!');

    if (shouldExit) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    if (shouldExit) {
      process.exit(1);
    }
  }
};

// Check if run directly from CLI
if (require.main === module) {
  connectDB().then(() => {
    seedData(true);
  });
}

module.exports = seedData;
