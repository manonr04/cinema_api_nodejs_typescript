import request from 'supertest';
import express from 'express';
import { authService } from '../services/authService';
import userRoutes from '../routes/userRoutes';
import userService from '../services/userService';
import bcrypt from 'bcryptjs';
import User from '../db/models/user';
import moment from 'moment';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User API', () => {
  let authToken: string;
  let testUserId: string;
  let testUserPassword: string;
  let testUserEmail: string;

  const adminEmail = 'admin@test.com';
  const adminPassword = 'admin';

  beforeAll(async () => {

    const admin: User | null = await userService.findByEmail(adminEmail);
    
    if (!admin) {
      const adminData = {
        username: 'admin',
        email: adminEmail,
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'Test',
        roles: ['admin']
      };

      await authService.register(
        adminData.email,
        adminData.password,
        adminData.firstName,
        adminData.lastName,
        adminData.username,
        adminData.roles
      );
    }
  });

  describe('POST /api/users', () => {
    it('should create, get, update, delete a user with hashed password', async () => {
      const timestamp = moment().format('YYYYMMDD_HHmmss');
      testUserEmail = `test@test.fr`;
      testUserPassword = 'password';
      
      const userData = {
        email: testUserEmail,
        password: testUserPassword,
        firstName: 'Test',
        lastName: 'User',
        username: `testuser_${timestamp}`,
        roles: ['user']
      };

      let response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body.firstName).toBe(userData.firstName);
      expect(response.body.lastName).toBe(userData.lastName);
      expect(response.body.roles).toEqual(['user']);
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('balance');
      
      testUserId = response.body.id;

      // Vérifier que le mot de passe a été haché en base de données
      const createdUser = await userService.findByEmail(userData.email);
      expect(createdUser).toBeDefined();
      expect(createdUser?.password).not.toBe(testUserPassword);
      expect(await bcrypt.compare(testUserPassword, createdUser!.password)).toBe(true);

      let user = await userService.findByEmail(adminEmail);
      expect(user).toBeDefined();
      let isValid = await userService.verifyPassword(adminPassword, user!.password);
      expect(isValid).toBe(true);

      user = await userService.findByEmail(adminEmail);
      expect(user).toBeDefined();
      isValid = await userService.verifyPassword('wrongpassword', user!.password);
      expect(isValid).toBe(false);

      const updateData = {
        firstName: 'Updated',
        lastName: 'User',
        roles: ['admin']
      };

      response = await request(app)
        .put(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      // suppression du user
      await request(app)
        .delete(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // check de la suppression du user
      await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 400 if required fields are missing', async () => {
      const userData = {
        username: 'testuser',
        roles: ['admin']
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
        lastName: 'User',
        roles: ['admin']
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
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('roles');
      // Vérifier que les mots de passe ne sont pas exposés
      response.body.forEach((user: any) => {
        expect(user).not.toHaveProperty('password');
      });
    });

    it('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });

  describe('GET /api/users/:id', () => {

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

  describe('PUT /api/users/:id', () => {

    it('should return 401 if not authenticated', async () => {
      await request(app)
        .put(`/api/users/${testUserId}`)
        .send({ firstName: 'Test', roles: ['admin'] })
        .expect(401);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should return 404 if user not found', async () => {
      await request(app)
        .delete('/api/users/999999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 401 if not authenticated', async () => {
      await request(app)
        .delete(`/api/users/${testUserId}`)
        .expect(401);
    });
  });

  describe('User Service', () => {
    it('should find user by email', async () => {
      const user = await userService.findByEmail('admin@test.com');
      expect(user).toBeDefined();
      expect(user?.email).toBe('admin@test.com');
      expect(user?.roles).toEqual(['admin']);
    });

    it('should return null for non-existent email', async () => {
      const user = await userService.findByEmail('nonexistent@test.com');
      expect(user).toBeNull();
    });



  });
}); 