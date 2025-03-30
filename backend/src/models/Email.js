const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Email = sequelize.define('Email', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('webmail', 'pop3', 'imap'),
    defaultValue: 'webmail'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Clients',
      key: 'id'
    }
  },
  websiteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Websites',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Define associations
Email.associate = (models) => {
  Email.belongsTo(models.Client, {
    foreignKey: 'clientId',
    onDelete: 'CASCADE'
  });
  Email.belongsTo(models.Website, {
    foreignKey: 'websiteId',
    onDelete: 'CASCADE'
  });
};

module.exports = Email; 