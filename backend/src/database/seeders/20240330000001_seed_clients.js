'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('clients', [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-123-4567',
        company: 'Smith Enterprises',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1-555-987-6543',
        company: 'Johnson & Co',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Michael Chen',
        email: 'mchen@example.com',
        phone: '+1-555-456-7890',
        company: 'Tech Solutions Inc',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('clients', null, {});
  }
}; 