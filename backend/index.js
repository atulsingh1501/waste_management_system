const express = require('express');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const vehiclesRouter = require('./routes/vehicles');
const collectionsRouter = require('./routes/collections');
const reportsRouter = require('./routes/reports');
const routesRouter = require('./routes/routes');
const notificationsRouter = require('./routes/notifications');
const { router: authRouter, authMiddleware } = require('./routes/auth');
const binsRouter = require('./routes/bins');
const app = express();
const PORT = process.env.PORT || 3001;

// Start MongoDB Memory Server
async function startMemoryDB() {
  const mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  return { mongod, mongoUri };
}

// Connect to in-memory MongoDB
async function connectDB() {
  try {
    const { mongoUri } = await startMemoryDB();
    console.log('Attempting to connect to in-memory MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('In-memory MongoDB connected successfully');
    return mongoUri;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Please ensure MongoDB is running and the connection string is correct');
    process.exit(1);
  }
}

// Initialize database connection
connectDB();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend server is running with in-memory MongoDB!');
});

// Users API
app.use('/api/users', authMiddleware, usersRouter);
// Vehicles API
app.use('/api/vehicles', authMiddleware, vehiclesRouter);
// Collections API
app.use('/api/collections', authMiddleware, collectionsRouter);
// Reports API
app.use('/api/reports', authMiddleware, reportsRouter);
// Routes API
app.use('/api/routes', authMiddleware, routesRouter);
// Notifications API
app.use('/api/notifications', authMiddleware, notificationsRouter);
// Auth API
app.use('/api/auth', authRouter);
// Bins API
app.use('/api/bins', authMiddleware, binsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Using in-memory MongoDB for development`);
});

require('dotenv').config();
