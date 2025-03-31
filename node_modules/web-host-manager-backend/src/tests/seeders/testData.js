const { User, Client, Website, Domain } = require('../../models');
const bcrypt = require('bcryptjs');

const seedTestData = async () => {
  try {
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
    });

    // Create test client
    const client = await Client.create({
      name: 'Test Client',
      email: 'client@example.com',
      phone: '1234567890',
      address: '123 Test St',
      userId: user.id
    });

    // Create test website
    const website = await Website.create({
      name: 'Test Website',
      url: 'https://test.com',
      hostingProvider: 'Test Host',
      hostingPlan: 'Basic',
      status: 'active',
      clientId: client.id
    });

    // Create test domains
    await Domain.create({
      name: 'test.com',
      registrar: 'GoDaddy',
      registrationDate: '2023-01-01',
      expiryDate: '2024-01-01',
      status: 'active',
      autoRenew: true,
      clientId: client.id,
      websiteId: website.id
    });

    await Domain.create({
      name: 'example.com',
      registrar: 'Namecheap',
      registrationDate: '2023-02-01',
      expiryDate: '2024-02-01',
      status: 'expired',
      autoRenew: false,
      clientId: client.id,
      websiteId: website.id
    });

    console.log('Test data seeded successfully');
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  }
};

module.exports = seedTestData; 