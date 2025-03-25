const { sequelize } = require('../models');

// Close database connection after all tests
afterAll(async () => {
  await sequelize.close();
});

// Clear database before each test
beforeEach(async () => {
  await sequelize.sync({ force: true });
});

// Global test timeout
jest.setTimeout(10000);

// Suppress console logs during tests
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn(); 