// Database configuration
const config = {
  // MongoDB Atlas connection string (replace with your actual connection string)
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/wms_db'
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'wms_jwt_secret_key_2024'
  },

  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // CORS configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
  }
};

module.exports = config;
