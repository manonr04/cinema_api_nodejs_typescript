import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import { authService } from '../services/authService';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User API', () => {
  let authToken: string;

  beforeAll(async () => {
    const adminData = {
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'Test'
    };

    const result = await authService.register(
      adminData.email,
      adminData.password,
      adminData.firstName,
      adminData.lastName,
      adminData.username
    );
    authToken = result.token;
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(userData.username);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.firstName).toBe(userData.firstName);
      expect(response.body.lastName).toBe(userData.lastName);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 if required fields are missing', async () => {
      const userData = {
        username: 'testuser'
      };

      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData)
        .expect(400);
    });

    it('should return 401 if not authenticated', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(401);
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      // First create a user
      const userData = {
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const createResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData);

      const userId = createResponse.body.id;

      // Then get the user by id
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.username).toBe(userData.username);
      expect(response.body.firstName).toBe(userData.firstName);
      expect(response.body.lastName).toBe(userData.lastName);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 if user not found', async () => {
      await request(app)
        .get('/api/users/999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/api/users/1')
        .expect(401);
    });
  });
}); 