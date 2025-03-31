'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('domains', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      registrar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      registration_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      auto_renew: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: Sequelize.ENUM('active', 'expired', 'pending', 'transferred'),
        defaultValue: 'active'
      },
      dns_records: {
        type: Sequelize.JSONB,
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
    await queryInterface.addIndex('domains', ['website_id']);
    await queryInterface.addIndex('domains', ['name']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('domains');
  }
}; 