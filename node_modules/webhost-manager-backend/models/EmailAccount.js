const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const EmailAccount = sequelize.define('EmailAccount', {
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
    server: {
      type: DataTypes.STRING,
      allowNull: false
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 65535
      }
    },
    type: {
      type: DataTypes.ENUM('POP3', 'IMAP', 'Exchange'),
      defaultValue: 'IMAP'
    },
    useSSL: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    quotaLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'deleted'),
      defaultValue: 'active'
    }
  }, {
    timestamps: true,
    paranoid: true, // Enable soft deletes
    tableName: 'email_accounts',
    hooks: {
      beforeCreate: async (emailAccount) => {
        if (emailAccount.password) {
          emailAccount.password = await bcrypt.hash(emailAccount.password, 10);
        }
      },
      beforeUpdate: async (emailAccount) => {
        if (emailAccount.changed('password')) {
          emailAccount.password = await bcrypt.hash(emailAccount.password, 10);
        }
      }
    }
  });

  EmailAccount.associate = (models) => {
    // EmailAccount belongs to a Client
    EmailAccount.belongsTo(models.Client, {
      foreignKey: {
        name: 'clientId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  // Instance method to validate password
  EmailAccount.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password);
  };

  return EmailAccount;
};