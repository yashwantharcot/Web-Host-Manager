console.log('Loading database.js...');
const { DataTypes } = require('sequelize');
const path = require('path');
console.log('Resolved path:', path.resolve(__dirname, '../config/database'));
const sequelize = require(path.resolve(__dirname, '../config/database'));
console.log('Loaded database.js successfully.');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;

