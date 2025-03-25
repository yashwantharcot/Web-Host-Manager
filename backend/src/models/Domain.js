const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Domain = sequelize.define('Domain', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  registrar: {
    type: DataTypes.STRING
  },
  registrationDate: {
    type: DataTypes.DATE
  },
  expiryDate: {
    type: DataTypes.DATE
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  renewalCharge: {
    type: DataTypes.DECIMAL(10, 2)
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'pending'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Domain; 