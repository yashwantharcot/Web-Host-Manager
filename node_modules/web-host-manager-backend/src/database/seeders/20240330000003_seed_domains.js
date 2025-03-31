'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('domains', [
      {
        website_id: 1,
        name: 'smithenterprises.com',
        registrar: 'GoDaddy',
        expiry_date: new Date('2025-03-30'),
        renewal_cost: 14.99,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        website_id: 1,
        name: 'smith-enterprises.com',
        registrar: 'GoDaddy',
        expiry_date: new Date('2025-03-30'),
        renewal_cost: 14.99,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        website_id: 2,
        name: 'johnsonco.com',
        registrar: 'Namecheap',
        expiry_date: new Date('2025-06-15'),
        renewal_cost: 12.99,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        website_id: 3,
        name: 'techsolutions.com',
        registrar: 'Google Domains',
        expiry_date: new Date('2025-12-31'),
        renewal_cost: 12.00,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('domains', null, {});
  }
}; 