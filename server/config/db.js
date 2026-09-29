const mongoose = require('mongoose');

const { mongoUri } = require('./env');

async function connectDatabase() {
  if (!mongoUri) {
    console.error('MongoDB connection failed: MONGODB_URI is not configured.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { connectDatabase };
