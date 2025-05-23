'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Website extends Model {
    static associate(models) {
      // Define associations
      Website.belongsTo(models.Client, {
        foreignKey: 'client_id',
        as: 'client'
      });
      Website.hasMany(models.Domain, {
        foreignKey: 'website_id',
        as: 'domains'
      });
      Website.hasMany(models.EmailAccount, {
        foreignKey: 'website_id',
        as: 'email_accounts'
      });
    }
  }

  Website.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    hosting_provider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hosting_plan: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hosting_expiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ssl_status: {
      type: DataTypes.ENUM('active', 'expired', 'none'),
      allowNull: false,
      defaultValue: 'none'
    },
    ssl_expiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
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
    modelName: 'Website',
    tableName: 'websites',
    timestamps: true,
    underscored: true
  });

  return Website;
}; 