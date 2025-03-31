const request = require('supertest');
const app = require('../../server');
const { User, Client } = require('../../models');
const jwt = require('jsonwebtoken');

describe('Client Management', () => {
  let authToken;
  let testUser;
  let testClient;

  beforeEach(async () => {
    // Get test user
    testUser = await User.findOne({ where: { email: 'test@example.com' } });
    authToken = jwt.sign({ id: testUser.id }, process.env.JWT_SECRET);

    // Create a test client
    testClient = await Client.create({
      name: 'Test Client',
      email: 'client@example.com',
      phone: '1234567890',
      company: 'Test Company',
      notes: 'Test notes',
      userId: testUser.id
    });
  });

  describe('GET /api/clients', () => {
    it('should return list of clients', async () => {
      const response = await request(app)
        .get('/api/clients')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data.clients)).toBe(true);
      expect(response.body.data.clients[0]).toHaveProperty('name', 'Test Client');
    });

    it('should reject unauthorized access', async () => {
      const response = await request(app)
        .get('/api/clients');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('GET /api/clients/:id', () => {
    it('should return a single client', async () => {
      const response = await request(app)
        .get(`/api/clients/${testClient.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.client).toHaveProperty('name', 'Test Client');
    });

    it('should return 404 for non-existent client', async () => {
      const response = await request(app)
        .get('/api/clients/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('POST /api/clients', () => {
    it('should create new client', async () => {
      const newClient = {
        name: 'New Client',
        email: 'newclient@example.com',
        phone: '0987654321',
        company: 'New Company',
        notes: 'New client notes'
      };

      const response = await request(app)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newClient);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.client).toHaveProperty('name', 'New Client');
      expect(response.body.data.client).toHaveProperty('userId', testUser.id);
    });

    it('should validate client data', async () => {
      const invalidClient = {
        name: '', // Invalid: empty name
        email: 'notanemail', // Invalid: not an email
        phone: '123' // Invalid: too short
      };

      const response = await request(app)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidClient);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PATCH /api/clients/:id', () => {
    it('should update client', async () => {
      const update = {
        name: 'Updated Client',
        company: 'Updated Company'
      };

      const response = await request(app)
        .patch(`/api/clients/${testClient.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(update);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.client).toHaveProperty('name', 'Updated Client');
      expect(response.body.data.client).toHaveProperty('company', 'Updated Company');
    });

    it('should return 404 for non-existent client', async () => {
      const response = await request(app)
        .patch('/api/clients/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Client' });

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('DELETE /api/clients/:id', () => {
    it('should delete client', async () => {
      const response = await request(app)
        .delete(`/api/clients/${testClient.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeNull();

      // Verify client is deleted
      const deletedClient = await Client.findByPk(testClient.id);
      expect(deletedClient).toBeNull();
    });

    it('should return 404 for non-existent client', async () => {
      const response = await request(app)
        .delete('/api/clients/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('fail');
    });
  });
});
