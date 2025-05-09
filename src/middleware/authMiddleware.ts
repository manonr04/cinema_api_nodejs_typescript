import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger';

// Clé secrète pour les tokens (à déplacer dans un fichier .env en production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Interface pour étendre Request avec les informations d'utilisateur
export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware pour vérifier le token JWT
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    logger.warn('Tentative d\'accès sans token d\'authentification');
    res.status(401).json({ message: 'Token d\'authentification manquant' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    logger.debug(`Token vérifié avec succès pour l'utilisateur: ${decoded.email}`);
    next();
  } catch (error) {
    logger.warn(`Token invalide ou expiré: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(403).json({ message: 'Token invalide ou expiré' });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est admin
 */
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.email === 'admin@example.com') {
    next();
  } else {
    logger.warn(`Tentative d'accès admin par un utilisateur non autorisé: ${req.user?.email}`);
    res.status(403).json({ message: 'Accès non autorisé' });
  }
}; 