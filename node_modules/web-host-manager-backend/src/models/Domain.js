'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Domain extends Model {
    static associate(models) {
      // Define associations
      Domain.belongsTo(models.Website, {
        foreignKey: 'website_id',
        as: 'website'
      });
    }
  }

  Domain.init({
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    registrar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    auto_renew: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'pending', 'transferred'),
      allowNull: false,
      defaultValue: 'active'
    },
    dns_records: {
      type: DataTypes.JSON,
      allowNull: true
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
    modelName: 'Domain',
    tableName: 'domains',
    timestamps: true,
    underscored: true
  });

  return Domain;
}; 