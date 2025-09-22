// Database configuration
const config = {
  // MongoDB Atlas connection string (replace with your actual connection string)
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://atulsingh05540_db_user:a1t2u3l4@wms.ixcxwbi.mongodb.net/?retryWrites=true&w=majority&appName=wms'
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
    origin: process.env.FRONTEND_URL || 'http://localhost:5174'
  }
};

module.exports = config;
