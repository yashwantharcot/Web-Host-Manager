// filepath: c:\Github Repositories\Web-Host-Manager\Web-Host-Manager\WebHostManager\config\database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
});

module.exports = sequelize;