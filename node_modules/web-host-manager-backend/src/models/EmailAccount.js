'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailAccount extends Model {
    static associate(models) {
      // Define associations
      EmailAccount.belongsTo(models.Website, {
        foreignKey: 'website_id',
        as: 'website'
      });
    }
  }

  EmailAccount.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    website_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'websites',
        key: 'id'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    type: {
      type: DataTypes.ENUM('pop3', 'imap', 'smtp'),
      allowNull: false,
      defaultValue: 'imap'
    },
    server: {
      type: DataTypes.STRING,
      allowNull: true
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quota: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Storage quota in MB'
    },
    used_space: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Used space in MB'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      allowNull: false,
      defaultValue: 'active'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'EmailAccount',
    tableName: 'email_accounts',
    timestamps: true,
    underscored: true
  });

  return EmailAccount;
}; 