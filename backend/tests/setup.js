require('dotenv').config({
  path: '.env.test'
});

const { sequelize, User } = require('../models');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

// Allow longer time for in-memory MongoDB startup in CI/slow machines
if (typeof jest !== 'undefined' && jest && typeof jest.setTimeout === 'function') {
  jest.setTimeout(30000);
}

// Global setup - runs once before all tests
beforeAll(async () => {
  try {
    // Start in-memory MongoDB and set the MONGO_URI so the app connects to it
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGO_URI = uri;

    // Sync database in test mode (this will use the test database)
    await sequelize.sync({ force: true });
    console.log('Test database synced successfully');
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Test user created successfully');
  } catch (error) {
    console.error('Test setup failed:', error);
    throw error;
  }
});

// Global teardown - runs once after all tests
afterAll(async () => {
  try {
  // Close database connection
  await sequelize.close();
  // Stop in-memory MongoDB
  if (mongoServer) await mongoServer.stop();
    console.log('Database connection closed successfully');
  } catch (error) {
    console.error('Test teardown failed:', error);
    throw error;
  }
});

// Reset database before each test
beforeEach(async () => {
  try {
    await sequelize.sync({ force: true });
    
    // Recreate test user
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'admin'
    });
  } catch (error) {
    console.error('Test reset failed:', error);
    throw error;
  }
});
