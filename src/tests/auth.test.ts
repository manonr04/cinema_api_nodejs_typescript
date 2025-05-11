import express from 'express';
import { authService } from '../services/authService';
import userRoutes from '../routes/userRoutes';
import userService from '../services/userService';
import User from '../db/models/user';
import request from 'supertest';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User API', () => {
  const adminEmail = 'admin@test.com';
  const adminPassword = 'admin';
  let accessToken: string;
  //let refreshToken: string;

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

  describe('Authentication flow', () => {
    it('should login and get tokens', async () => {
      const loginResult = await authService.login(adminEmail, adminPassword);
      expect(loginResult.token).toBeDefined();
      expect(loginResult.refreshToken).toBeDefined();
      expect(loginResult.user).toBeDefined();
      expect(loginResult.user.email).toBe(adminEmail);

      accessToken = loginResult.token;
      refreshToken = loginResult.refreshToken;

      // Attendre 11 secondes pour s'assurer que le token est bien expiré
      await new Promise(resolve => setTimeout(resolve, 11000));

      await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect(res => {
          expect(res.body.message).toEqual('Invalid token');
        });
    });
  });
}); 