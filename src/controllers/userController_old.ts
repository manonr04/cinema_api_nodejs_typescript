import { Request, Response } from 'express';
import { userService, User } from '../services/userService_old';

// Interface temporaire pour l'implémentation en mémoire
interface TempUser {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Simulated database
const users: TempUser[] = [];
const nextId = 1;

export const userController_old = {
  // Get all users
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      // Ne pas renvoyer les mots de passe
      const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      res.json(safeUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

  // Get user by id
  getUserById: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Ne pas renvoyer le mot de passe
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Error fetching user' });
    }
  },

  // Create new user
  createUser: async (req: Request, res: Response) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;
      
      if (!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const newUser = await userService.createUser({
        username,
        email,
        password,
        firstName,
        lastName
      });

      // Ne pas renvoyer le mot de passe
      const { password: _, ...safeUser } = newUser;
      res.status(201).json(safeUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  },

  // Update user
  updateUser: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { username, email, firstName, lastName } = req.body;
      
      const updatedUser = await userService.updateUser(id, {
        username,
        email,
        firstName,
        lastName
      });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Ne pas renvoyer le mot de passe
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user' });
    }
  },

  // Delete user
  deleteUser: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await userService.deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Error deleting user' });
    }
  }
}; 