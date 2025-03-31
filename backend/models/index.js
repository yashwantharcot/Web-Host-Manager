const { Sequelize } = require('sequelize');
const path = require('path');

// Load environment variables
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

// Get environment-specific configuration
const env = process.env.NODE_ENV || 'development';
let config;

try {
  config = require('../config/database.js')[env];
} catch (error) {
  // If database.js doesn't exist or has issues, use environment variables
  config = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: env === 'test' ? false : console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
}

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool
  }
);

// Import models
const models = {
  User: require('./User')(sequelize),
  Client: require('./Client')(sequelize),
  Domain: require('./Domain')(sequelize),
  EmailAccount: require('./EmailAccount')(sequelize)
};

// Initialize associations
Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  ...models
};