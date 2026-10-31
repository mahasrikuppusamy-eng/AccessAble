const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/accessable';
    console.log(`Attempting to connect to MongoDB at: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
    
    // Set short timeout for initial check if using localhost
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`MongoDB Connected successfully to: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}). Starting in-memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongodInstance.getUri();
      console.log(`In-memory MongoDB started at: ${inMemoryUri}`);
      
      await mongoose.connect(inMemoryUri);
      console.log('Connected to In-Memory MongoDB successfully!');
    } catch (memError) {
      console.error('Failed to start in-memory MongoDB server:', memError.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
