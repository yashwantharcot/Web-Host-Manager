'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('email_accounts', [
      {
        website_id: 1,
        email: 'admin@smithenterprises.com',
        password: 'encrypted_password_1',
        provider: 'Google Workspace',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        website_id: 1,
        email: 'info@smithenterprises.com',
        password: 'encrypted_password_2',
        provider: 'Google Workspace',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        website_id: 2,
        email: 'contact@johnsonco.com',
        password: 'encrypted_password_3',
        provider: 'Microsoft 365',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        website_id: 3,
        email: 'support@techsolutions.com',
        password: 'encrypted_password_4',
        provider: 'Google Workspace',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        website_id: 3,
        email: 'sales@techsolutions.com',
        password: 'encrypted_password_5',
        provider: 'Google Workspace',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('email_accounts', null, {});
  }
}; 