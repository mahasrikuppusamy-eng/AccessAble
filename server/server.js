const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { Place } = require('./models/Place');
const seedData = require('./seed/seed');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow client connections
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static directory for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/places', require('./routes/placeRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AccessAble API Service',
  });
});

// Root API Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AccessAble – Accessibility Discovery Platform REST API',
    version: '1.0.0',
    documentation: '/api/places, /api/auth, /api/reviews, /api/favorites, /api/admin',
  });
});

// Global 404 Handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found - ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is fresh / empty
    const placeCount = await Place.countDocuments();
    if (placeCount === 0) {
      console.log('No existing places found. Auto-seeding initial accessibility data...');
      await seedData(false);
    } else {
      console.log(`Database already initialized with ${placeCount} places.`);
    }

    app.listen(PORT, () => {
      console.log(`AccessAble server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

startServer();
