import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { authService } from '../services/authService';
import userService from '../services/userService';

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, username, roles } = req.body;

    if (!email || !password || !firstName || !lastName || !username) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    try {
      const result = await authService.register(email, password, firstName, lastName, username, roles);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'User already exists') {
        return res.status(409).json({ message: 'Email déjà utilisé' });
      }
      throw error;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Tentative de connexion avec:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Erreurs de validation:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Champs manquants:', { email: !!email, password: !!password });
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    try {
      console.log('Appel de authService.login avec:', { email, password });
      const result = await authService.login(email, password);
      console.log('Résultat de la connexion:', result);

      // Renvoyer le token dans la réponse
      res.json({
        user: {
          id: result.user.id,
          lastName: result.user.lastName,
          email: result.user.email,
          roles: result.user.roles
        },
        token: result.token
      });
    } catch (error: any) {
      console.log('Erreur lors de la connexion:', error.message);
      if (error.message === 'User not found' || error.message === 'Invalid password') {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }
      throw error;
    }
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const authController = {
  /**
   * Rafraîchir un token d'accès
   */
  refreshToken: async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token manquant' });
      return;
    }

    // Vérifier si le refresh token est valide
    if (!authService.verifyRefreshToken(refreshToken)) {
      res.status(403).json({ message: 'Refresh token invalide ou expiré' });
      return;
    }

    // Récupérer l'ID de l'utilisateur à partir du refresh token
    const userId: string | null = authService.getUserIdFromRefreshToken(refreshToken);
    if (!userId) {
      res.status(403).json({ message: 'Refresh token invalide' });
      return;
    }

    // Trouver l'utilisateur
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    // Générer un nouveau access token
    const newAccessToken = authService.generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  },

  /**
   * Déconnexion (révoquer un refresh token)
   */
  logout: (req: Request, res: Response): void => {
    // Pour une API, la déconnexion est gérée côté client
    // Le client doit simplement supprimer le token stocké
    res.status(204).send();
  }
}; 