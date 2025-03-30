'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('websites', [
      {
        client_id: 1, // John Smith
        name: 'Smith Enterprises Main Site',
        url: 'https://smithenterprises.com',
        hosting_provider: 'AWS',
        login_credentials: JSON.stringify({
          username: 'admin',
          password: 'encrypted_password_1'
        }),
        expiry_date: new Date('2025-03-30'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        client_id: 2, // Sarah Johnson
        name: 'Johnson & Co Website',
        url: 'https://johnsonco.com',
        hosting_provider: 'DigitalOcean',
        login_credentials: JSON.stringify({
          username: 'admin',
          password: 'encrypted_password_2'
        }),
        expiry_date: new Date('2025-06-15'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        client_id: 3, // Michael Chen
        name: 'Tech Solutions Portal',
        url: 'https://techsolutions.com',
        hosting_provider: 'Google Cloud',
        login_credentials: JSON.stringify({
          username: 'admin',
          password: 'encrypted_password_3'
        }),
        expiry_date: new Date('2025-12-31'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('websites', null, {});
  }
}; 