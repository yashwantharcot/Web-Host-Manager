const request = require('supertest');
const app = require('../../server');
const { User } = require('../../models');
const jwt = require('jsonwebtoken');

describe('Authentication', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.username).toBe(newUser.username);
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not register a user with existing email', async () => {
      const existingUser = {
        username: 'duplicate',
        email: 'test@example.com', // This email is created in setup.js
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUser);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should validate user input', async () => {
      const invalidUser = {
        username: 'a', // too short
        email: 'notanemail',
        password: '123' // too short
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'testpass123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.token).toBeDefined();
    });

    it('should not login with incorrect password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should not login with non-existent email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'testpass123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;

    beforeEach(async () => {
      const user = await User.findOne({ where: { email: 'test@example.com' } });
      authToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    });

    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('fail');
    });
  });
});
