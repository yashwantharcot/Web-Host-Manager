const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Domain = sequelize.define('Domain', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
      }
    },
    registrar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registrarUsername: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registrarPassword: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nameservers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    registrationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    autoRenew: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'pending', 'transferring'),
      defaultValue: 'active'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true, // Enable soft deletes
    tableName: 'domains'
  });

  Domain.associate = (models) => {
    // Domain belongs to a Client
    Domain.belongsTo(models.Client, {
      foreignKey: {
        name: 'clientId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  return Domain;
};