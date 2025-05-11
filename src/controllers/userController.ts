import userService from '../services/userService';
import { Request, Response } from "express";
import User from '../db/models/user';

const excludePassword = (user: any) => {
  const { password, ...userWithoutPassword } = user.toJSON ? user.toJSON() : user;
  return userWithoutPassword;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json(excludePassword(result));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  const result: User[] = await userService.getAllUser();
  res.json(result.map(excludePassword));
};

export const getOneUser = async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);
  if (!result) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(excludePassword(result));
};

export const getAccountBalanceUser = async (req: Request, res: Response) => {
  console.log(req.params)
  const result = await userService.getUserById(req.params.id);
  res.json(result?.accountBalance);
};

export const updateUser = async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, req.body);
  if (!result) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json({ error: 'User updated' });
};

export const removeUser = async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  if (!result) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(204).end();
};

export default {
  getAllUser,
  getOneUser,
  createUser,
  updateUser,
  removeUser,
  getAccountBalanceUser
}