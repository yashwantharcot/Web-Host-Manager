const { sequelize } = require('../models');
const { connect: connectMongo } = require('../config/mongo');

// Connect to MongoDB for tests and clear collections
beforeAll(async () => {
  // ensure mongoose is connected via the config helper
  try {
    // timeout the connect after 5s to avoid blocking tests on unreachable DB
    await Promise.race([
      connectMongo(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('Mongo connect timeout')), 5000))
    ]);
  } catch (e) {
    // if connect fails, tests will surface the error
  }
  await sequelize.sync({ force: true });
});

// Close database connection after all tests
afterAll(async () => {
  await sequelize.close();
});

// Clear database before each test
beforeEach(async () => {
  await sequelize.sync({ force: true });
});

// Global test timeout
jest.setTimeout(20000);

// Suppress console logs during tests
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();