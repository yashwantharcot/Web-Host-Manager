const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Domain = sequelize.define('Domain', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Domain;