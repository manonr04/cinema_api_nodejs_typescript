import userService, { getBanlanceAccountByUser } from '../services/userService';
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  const result = await userService.getAllUser();
  res.json(result);
};

export const getOneUser = async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);
  res.json(result);
};

export const getAccountBalanceUser = async (req: Request, res: Response) => {
  console.log(req.params)
  const result = await userService.getBanlanceAccountByUser(req.params.id);
  res.json(result);
};

export const updateUser = async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, req.body);
  res.json(result);
};

export const removeUser = async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);
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