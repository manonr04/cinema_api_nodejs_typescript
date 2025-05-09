import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../config/logger';
import { userService } from './userService';

// Clés secrètes pour les tokens (à déplacer dans un fichier .env en production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret-key';

// Durée de validité des tokens
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Stockage temporaire des refresh tokens (à remplacer par une base de données en production)
const refreshTokens: string[] = [];

export class AuthService {
  async register(email: string, password: string, firstName: string, lastName: string, username: string): Promise<{ user: any; token: string }> {
    try {
      logger.info(`Tentative d'inscription pour l'utilisateur: ${email}`);
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        logger.warn(`Tentative d'inscription échouée: l'utilisateur ${email} existe déjà`);
        throw new Error('User already exists');
      }

      const hashedPassword = await this.hashPassword(password);
      logger.debug(`Mot de passe hashé généré pour l'utilisateur: ${email}`);
      
      const user = await userService.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username
      });

      const token = this.generateAccessToken(user);
      logger.info(`Inscription réussie pour l'utilisateur: ${email}`);

      // todo : supprimer le password du user retourné
      //const { password: _, ...safeUser } = user;
      return { user, token };
    } catch (error) {
      logger.error(`Erreur lors de l'inscription: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      throw error;
    }
  }

  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    try {
      logger.info(`Tentative de connexion pour l'utilisateur: ${email}`);
      const user = await userService.findByEmail(email);
      
      if (!user) {
        logger.warn(`Tentative de connexion échouée: utilisateur ${email} non trouvé`);
        throw new Error('User not found');
      }

      logger.debug('Vérification du mot de passe');
      const isValidPassword = await this.verifyPassword(password, user.password);
      
      if (!isValidPassword) {
        logger.warn(`Tentative de connexion échouée: mot de passe invalide pour l'utilisateur ${email}`);
        throw new Error('Invalid password');
      }

      const token = this.generateAccessToken(user);
      logger.info(`Connexion réussie pour l'utilisateur: ${email}`);

      // Ne pas renvoyer le mot de passe dans la réponse
      //const { password: _, ...safeUser } = user;
      return { user: user, token };
    } catch (error) {
      logger.error(`Erreur lors de la connexion: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      throw error;
    }
  }

  generateAccessToken(user: any): string {
    logger.debug(`Génération du token d'accès pour l'utilisateur: ${user.email}`);
    return jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
  }

  generateRefreshToken(user: any): string {
    logger.debug(`Génération du refresh token pour l'utilisateur: ${user.email}`);
    const refreshToken = jwt.sign(
      { id: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    
    refreshTokens.push(refreshToken);
    return refreshToken;
  }

  verifyRefreshToken(token: string): boolean {
    logger.debug('Vérification du refresh token');
    if (!refreshTokens.includes(token)) {
      logger.warn('Refresh token non trouvé dans la liste des tokens valides');
      return false;
    }
    
    try {
      jwt.verify(token, REFRESH_TOKEN_SECRET);
      return true;
    } catch (error) {
      logger.error(`Erreur lors de la vérification du refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      return false;
    }
  }

  getUserIdFromRefreshToken(token: string): number | null {
    try {
      logger.debug('Extraction de l\'ID utilisateur du refresh token');
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: number };
      return decoded.id;
    } catch (error) {
      logger.error(`Erreur lors de l'extraction de l'ID utilisateur: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      return null;
    }
  }

  revokeRefreshToken(token: string): void {
    logger.info('Révoquation du refresh token');
    const index = refreshTokens.indexOf(token);
    if (index !== -1) {
      refreshTokens.splice(index, 1);
      logger.debug('Refresh token révoqué avec succès');
    } else {
      logger.warn('Tentative de révoquation d\'un refresh token inexistant');
    }
  }

  async verifyToken(token: string): Promise<{ id: number; username: string; email: string }> {
    try {
      logger.debug('Vérification du token');
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string; email: string };
      logger.debug('Token vérifié avec succès');
      return decoded;
    } catch (error) {
      logger.error(`Erreur lors de la vérification du token: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      throw new Error('Invalid token');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      logger.debug('Hachage du mot de passe');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      logger.debug('Mot de passe haché avec succès');
      return hashedPassword;
    } catch (error) {
      logger.error(`Erreur lors du hachage du mot de passe: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      throw error;
    }
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      logger.debug('Vérification du mot de passe');
      const isValid = await bcrypt.compare(password, hashedPassword);
      logger.debug(`Résultat de la vérification du mot de passe: ${isValid}`);
      return isValid;
    } catch (error) {
      logger.error(`Erreur lors de la vérification du mot de passe: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
      throw error;
    }
  }
}

export const authService = new AuthService(); 