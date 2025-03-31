const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending'),
      defaultValue: 'active'
    },
    lastContact: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true, // Enable soft deletes
    tableName: 'clients',
    indexes: [
      {
        unique: true,
        fields: ['email', 'userId']
      }
    ]
  });

  Client.associate = (models) => {
    // Client belongs to a User
    Client.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'RESTRICT'
    });

    // Client has many Domains
    Client.hasMany(models.Domain, {
      foreignKey: {
        name: 'clientId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });

    // Client has many EmailAccounts
    Client.hasMany(models.EmailAccount, {
      foreignKey: {
        name: 'clientId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  return Client;
};