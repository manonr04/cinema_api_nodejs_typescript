import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.firstName).toBe(userData.firstName);
      expect(response.body.user.lastName).toBe(userData.lastName);
      //expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 400 if required fields are missing', async () => {
      const userData = {
        username: 'testuser'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should return 409 if email already exists', async () => {
      const userData = {
        username: 'testuser',
        email: 'admin@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      // Premier enregistrement
      //await request(app)
      //  .post('/api/auth/register')
      //  .send(userData)
      //  .expect(201);

      // Deuxième enregistrement avec le même email
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      // D'abord, créer un utilisateur
      const userData = {
        username: 'logintest',
        email: 'admin@example.com',
        password: 'password123',
        firstName: 'Login',
        lastName: 'Test'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Ensuite, essayer de se connecter
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('user');
      expect(loginResponse.body).toHaveProperty('token');
      expect(loginResponse.body.user.email).toBe(userData.email);
    });

    it('should return 401 with incorrect password', async () => {
      const userData = {
        username: 'logintest2',
        email: 'login@example.com',
        password: 'incorrectpassword',
        firstName: 'Login',
        lastName: 'Test'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        })
        .expect(401);
    });

    it('should return 401 with non-existent email', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);
    });
  });
}); 