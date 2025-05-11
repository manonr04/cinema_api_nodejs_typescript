import userRepository from '../repositories/userRepository';
import bcrypt from 'bcryptjs';
import logger from '../config/logger';

export const getAllUser = () => {
  return userRepository.findAllUser();
}

export const getUserById = (id: string) => {
  return userRepository.findUserById(id);
}

export const findByEmail = (email: string) => {
  return userRepository.findByEmail(email);
}

export const createUser = async (data: any) => {
  try {
    logger.info(`Création d'un nouvel utilisateur: ${data.email}`);
    
    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    // Création de l'utilisateur avec le mot de passe haché
    const userData = {
      ...data,
      password: hashedPassword
    };
    
    const user = await userRepository.createUser(userData);
    logger.info(`Utilisateur créé avec succès: ${user.email}`);
    
    return user;
  } catch (error) {
    logger.error(`Erreur lors de la création de l'utilisateur: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
    throw error;
  }
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    logger.debug('Vérification du mot de passe');
    const isValid = await bcrypt.compare(password, hashedPassword);
    logger.debug(`Résultat de la vérification du mot de passe: ${isValid}`);
    return isValid;
  } catch (error) {
    logger.error(`Erreur lors de la vérification du mot de passe: ${error instanceof Error ? error.message : 'Unknown error'}`, { error });
    throw error;
  }
};

export const updateUser = (id: string, data: any) => {
  return userRepository.updateUser(id, data);
};

export const deleteUser = (id: string) => {
  return userRepository.removeUser(id);
}

export default { 
  getAllUser, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  findByEmail,
  verifyPassword 
};