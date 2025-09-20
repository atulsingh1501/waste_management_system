const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { MongoMemoryServer } = require('mongodb-memory-server');

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
    process.exit(1);
  }
}

// Demo users data
const demoUsers = [
  {
    name: 'System Administrator',
    email: 'admin@wms.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1-555-0101',
    assignedArea: 'City Center'
  },
  {
    name: 'Operations Manager',
    email: 'manager@wms.com',
    password: 'manager123',
    role: 'manager',
    phone: '+1-555-0102',
    assignedArea: 'Downtown'
  },
  {
    name: 'Collection Staff',
    email: 'staff@wms.com',
    password: 'staff123',
    role: 'staff',
    phone: '+1-555-0103',
    assignedArea: 'Industrial Area'
  },
  {
    name: 'John Citizen',
    email: 'citizen@wms.com',
    password: 'citizen123',
    role: 'citizen',
    phone: '+1-555-0104',
    assignedArea: 'Residential Area'
  }
];

// Seed demo users
async function seedDemoUsers() {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create demo users
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();
      console.log(`Created user: ${userData.email} (${userData.role})`);
    }

    console.log('Demo users created successfully!');
    console.log('\nDemo Accounts:');
    demoUsers.forEach(user => {
      console.log(`- ${user.email} / ${user.password} (${user.role})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo users:', error);
    process.exit(1);
  }
}

seedDemoUsers();
