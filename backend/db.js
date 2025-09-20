const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    const mongoUri = config.mongodb.uri;
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Please ensure MongoDB is running and the connection string is correct');
    process.exit(1);
  }
};

module.exports = connectDB;
