const request = require('supertest');
const app = require('../../server');
const { User } = require('../../models');
const jwt = require('jsonwebtoken');

describe('Validation Middleware', () => {
  let authToken;

  beforeEach(async () => {
    const user = await User.findOne({ where: { email: 'test@example.com' } });
    authToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  });

  describe('Client Validation', () => {
    it('should reject invalid client data', async () => {
      const invalidClient = {
        // Missing required name field
        email: 'not-an-email',
        phone: 'invalid-phone'
      };

      const response = await request(app)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidClient);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: expect.any(String)
          }),
          expect.objectContaining({
            field: 'email',
            message: expect.any(String)
          }),
          expect.objectContaining({
            field: 'phone',
            message: expect.any(String)
          })
        ])
      );
    });

    it('should accept valid client data', async () => {
      const validClient = {
        name: 'Test Client',
        email: 'valid@example.com',
        phone: '1234567890',
        company: 'Test Company'
      };

      const response = await request(app)
        .post('/api/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validClient);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', validClient.name);
      expect(response.body).toHaveProperty('email', validClient.email);
    });
  });

  describe('Domain Validation', () => {
    it('should reject invalid domain data', async () => {
      const invalidDomain = {
        name: 'invalid domain name',
        registrationDate: 'not-a-date',
        expiryDate: 'not-a-date'
      };

      const response = await request(app)
        .post('/api/domains')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDomain);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: expect.any(String)
          }),
          expect.objectContaining({
            field: 'registrationDate',
            message: expect.any(String)
          }),
          expect.objectContaining({
            field: 'expiryDate',
            message: expect.any(String)
          })
        ])
      );
    });

    it('should accept valid domain data', async () => {
      const validDomain = {
        name: 'example.com',
        registrationDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        clientId: 1
      };

      const response = await request(app)
        .post('/api/domains')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validDomain);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', validDomain.name);
    });
  });
});
