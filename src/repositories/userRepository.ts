import { User } from "../db/models/user";

export const findAllUser = () => User.findAll();

export const findUserById = (id: string | number) =>
  User.findByPk(id);

export const createUser = (data: Partial<User>) =>
  User.create(data);

export const updateUser = (id: string | number, data: Partial<User>) =>
  User.update(data, { where: { id } });

export const removeUser = (id: string | number) =>
  User.destroy({ where: { id } });

export default {
  findAllUser,
  findUserById,
  createUser,
  updateUser,
  removeUser,
}