// filepath: backend/config/database.js
require('dotenv').config(); // Load environment variables from .env file
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance using the DATABASE_URL from the .env file
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Disable logging; set to true for debugging
});

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;