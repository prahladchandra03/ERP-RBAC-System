require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const seedDatabase = require('./seedData');

const server = express();
const PORT = process.env.PORT || 3001;
const DB = process.env.MONGODB_URI;

// Import app (routes + sessions + passport)
const app = require('./app');

// Attach app middleware
server.use(app);

// MongoDB connection + server start
(async () => {
  try {
    await mongoose.connect(DB);
    console.log('✅ Successfully connected to MongoDB');

    // Seed database (only if empty)
    await seedDatabase();

    server.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1); // stop server if DB fails
  }
})();
