import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

// todo: à recoder Données initiales en JSON
const INITIAL_USERS = {
  "users": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "password": "$2a$10$rKbjENtR5AUySefaSiezl.4Xsc9eC91mNtXEpwVaWEjenr.Nsdfcy", // "password123"
      "firstName": "Admin",
      "lastName": "User",
      "createdAt": "2024-03-20T00:00:00.000Z",
      "updatedAt": "2024-03-20T00:00:00.000Z"
    }
  ]
};

class UserService_old {
  private users: User[] = [];
  private nextId = 2;

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    try {
      this.users = INITIAL_USERS.users.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
      this.nextId = 1;
    }
  }

  private saveUsers(): void {
    // Pour le moment, on ne fait rien
    console.log('Saving users (disabled for now)');
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    console.log('Création d\'un nouvel utilisateur avec le mot de passe:', userData.password);
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    console.log('Mot de passe haché:', hashedPassword);
    
    const newUser: User = {
      ...userData,
      id: this.nextId++,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    const updatedUser = {
      ...this.users[userIndex],
      ...userData,
      id, // Ensure ID doesn't change
      updatedAt: new Date()
    };

    if (userData.password) {
      updatedUser.password = await bcrypt.hash(userData.password, 10);
    }

    this.users[userIndex] = updatedUser;
    this.saveUsers();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    if (this.users.length !== initialLength) {
      this.saveUsers();
      return true;
    }
    return false;
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log('Recherche de l\'utilisateur avec l\'email:', email);
    const user = this.users.find(user => user.email === email);
    console.log('Utilisateur trouvé:', user ? 'oui' : 'non');
    if (user) {
      console.log('Hash du mot de passe stocké:', user.password);
    }
    return user || null;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}

export const userService = new UserService_old();