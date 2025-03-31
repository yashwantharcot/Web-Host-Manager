'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('email_accounts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      website_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'websites',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quota: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Email storage quota in MB'
      },
      used_space: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Used storage space in MB'
      },
      status: {
        type: Sequelize.ENUM('active', 'suspended', 'deleted'),
        defaultValue: 'active'
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('email_accounts', ['website_id']);
    await queryInterface.addIndex('email_accounts', ['email']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('email_accounts');
  }
}; 