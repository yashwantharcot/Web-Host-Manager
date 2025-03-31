const request = require('supertest');
const app = require('../../index');
const { sequelize } = require('../../models');
const { generateToken } = require('../../utils/auth');

describe('Domain API Integration Tests', () => {
  let authToken;
  let testClient;
  let testWebsite;

  beforeAll(async () => {
    // Create test data
    testClient = await sequelize.models.Client.create({
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      status: 'active',
    });

    testWebsite = await sequelize.models.Website.create({
      name: 'Test Website',
      url: 'https://test.com',
      clientId: testClient.id,
      status: 'active',
    });

    // Generate auth token
    authToken = generateToken({ id: 1, role: 'admin' });
  });

  afterAll(async () => {
    // Clean up test data
    await sequelize.models.Domain.destroy({ where: {} });
    await sequelize.models.Website.destroy({ where: {} });
    await sequelize.models.Client.destroy({ where: {} });
  });

  describe('GET /api/domains', () => {
    test('should return all domains', async () => {
      const response = await request(app)
        .get('/api/domains')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return 401 without auth token', async () => {
      const response = await request(app).get('/api/domains');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/domains', () => {
    const testDomain = {
      name: 'test.com',
      registrar: 'GoDaddy',
      registrationDate: '2023-01-01',
      expiryDate: '2024-01-01',
      autoRenew: true,
      status: 'active',
      clientId: 1,
      websiteId: 1,
    };

    test('should create a new domain', async () => {
      const response = await request(app)
        .post('/api/domains')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testDomain);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testDomain.name);
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/domains')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/domains/:id', () => {
    let testDomain;

    beforeEach(async () => {
      testDomain = await sequelize.models.Domain.create({
        name: 'test.com',
        registrar: 'GoDaddy',
        registrationDate: '2023-01-01',
        expiryDate: '2024-01-01',
        autoRenew: true,
        status: 'active',
        clientId: testClient.id,
        websiteId: testWebsite.id,
      });
    });

    test('should return domain by id', async () => {
      const response = await request(app)
        .get(`/api/domains/${testDomain.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testDomain.id);
    });

    test('should return 404 for non-existent domain', async () => {
      const response = await request(app)
        .get('/api/domains/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/domains/:id', () => {
    let testDomain;

    beforeEach(async () => {
      testDomain = await sequelize.models.Domain.create({
        name: 'test.com',
        registrar: 'GoDaddy',
        registrationDate: '2023-01-01',
        expiryDate: '2024-01-01',
        autoRenew: true,
        status: 'active',
        clientId: testClient.id,
        websiteId: testWebsite.id,
      });
    });

    test('should update domain', async () => {
      const updateData = {
        name: 'updated.com',
        status: 'expired',
      };

      const response = await request(app)
        .put(`/api/domains/${testDomain.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.status).toBe(updateData.status);
    });

    test('should validate update data', async () => {
      const response = await request(app)
        .put(`/api/domains/${testDomain.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ expiryDate: 'invalid-date' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('DELETE /api/domains/:id', () => {
    let testDomain;

    beforeEach(async () => {
      testDomain = await sequelize.models.Domain.create({
        name: 'test.com',
        registrar: 'GoDaddy',
        registrationDate: '2023-01-01',
        expiryDate: '2024-01-01',
        autoRenew: true,
        status: 'active',
        clientId: testClient.id,
        websiteId: testWebsite.id,
      });
    });

    test('should delete domain', async () => {
      const response = await request(app)
        .delete(`/api/domains/${testDomain.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Domain deleted successfully');

      // Verify domain is deleted
      const deletedDomain = await sequelize.models.Domain.findByPk(testDomain.id);
      expect(deletedDomain).toBeNull();
    });
  });

  describe('GET /api/domains/status/:status', () => {
    test('should return domains by status', async () => {
      const response = await request(app)
        .get('/api/domains/status/active')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(domain => {
        expect(domain.status).toBe('active');
      });
    });
  });
}); 