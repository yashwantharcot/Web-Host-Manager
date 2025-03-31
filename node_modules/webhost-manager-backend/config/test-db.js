const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '.env.test' });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Disable logging in test environment
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Test database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the test database:', err);
  });

module.exports = sequelize;
