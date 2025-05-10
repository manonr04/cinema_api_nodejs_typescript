import userRepository from '../repositories/userRepository';

export const getAllUser = () => {
  return userRepository.findAllUser();
}

export const getUserById = (id: string) => {
  return userRepository.findUserById(id);
}

export const getBanlanceAccountByUser = (id: string) => {
  return userRepository.getBalanceAccountByUserId(id);
}

export const createUser = (data: any) => {
  return userRepository.createUser(data);
};

export const updateUser = (id: string, data: any) => {
  return userRepository.updateUser(id, data);
};

export const deleteUser = (id: string) => {
  return userRepository.removeUser(id);
}

export default { getAllUser, getUserById, createUser, updateUser, deleteUser, getBanlanceAccountByUser };