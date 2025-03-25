const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const EmailAccount = sequelize.define('EmailAccount', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = EmailAccount;