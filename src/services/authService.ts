import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
//import logger from '../config/logger';
import userService from './userService';
import { User } from '../db/models/user';

// Clés secrètes pour les tokens (à déplacer dans un fichier .env en production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret-key';

// Durée de validité des tokens
const ACCESS_TOKEN_EXPIRY = '10s'; // Pour les tests
const REFRESH_TOKEN_EXPIRY = '7d';

export const authService = {
  async register(email: string, password: string, firstName: string, lastName: string, username: string, roles: string[]): Promise<User> {
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await userService.createUser({
      email,
      password,
      firstName,
      lastName,
      username,
      roles
    });

    return user;
  },

  async login(email: string, password: string): Promise<{ 
    token: string; 
    refreshToken: string;
    user: Partial<User> 
  }> {
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await userService.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Générer le token d'accès
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        roles: user.roles
      },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Générer le refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    user.password='';

    return {
      token, 
      refreshToken,
      user
    };
  },

  async refreshTokens(refreshToken: string): Promise<{ 
    token: string;
    refreshToken: string;
    user: Partial<User>;
  }> {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };
      
      const user = await userService.getUserById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      const newToken = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          roles: user.roles
        },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
      );

      return {
        token: newToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles
        }
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      }
      throw new Error('Invalid refresh token');
    }
  },

  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('TOKEN_EXPIRED');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('TOKEN_INVALID');
      }
      throw error;
    }
  },

};