require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const seedDatabase = require('./seedData');

const server = express();
const PORT = process.env.PORT || 5000;

// ✅ SAME variable everywhere
let DB = process.env.MONGO_URI;

// Fix for malformed connection string (e.g. double key in .env)
if (DB && DB.startsWith('MONGO_URI=')) {
  DB = DB.replace('MONGO_URI=', '');
  process.env.MONGO_URI = DB; // ✅ Update globally so app.js uses the fixed URI
}

console.log("MONGO_URI:", DB);

// Import app (routes + sessions + passport)
const app = require('./app');

// Attach app middleware
server.use(app);

// ✅ Fix: Handle API 404s explicitly to prevent HTML response
server.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route not found: ${req.originalUrl}` });
});

// --- Production Deployment Setup ---
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app's build directory
  server.use(express.static(path.join(__dirname, '../client/build')));

  // For any other request, serve the React app's index.html file
  server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
} else {
  server.get('/', (req, res) => {
    res.send('✅ Backend API is Running in Development!');
  });
}

// MongoDB connection + server start
(async () => {
  try {
    await mongoose.connect(DB); // IPv4 forced ✅
    console.log('✅ Successfully connected to MongoDB');

    await seedDatabase();

    server.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
})();
