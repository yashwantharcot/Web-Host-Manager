require('dotenv').config({
  path: '.env.test'
});

const { sequelize, User } = require('../models');
const bcrypt = require('bcryptjs');

// Global setup - runs once before all tests
beforeAll(async () => {
  try {
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
