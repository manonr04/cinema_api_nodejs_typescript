import { Request, Response } from "express";
import * as service from "../services/transactionService";

export const getAllTransactions = async (req: Request, res: Response) => {
  const transactions = await service.getAllTransactions();
  res.json(transactions);
};

export const getTransactionById = async (req: Request, res: Response) => {
  const transaction = await service.getTransactionById(req.params.id);
  res.json(transaction);
};

export const getTransactionsByUserId = async (req: Request, res: Response) => {
  console.log(req.params);
  const { id } = req.params;
  const transactions = await service.getTransactionsByUserId(id);
  res.json(transactions);
};

export const createTransaction = async (req: Request, res: Response) => {
  const transaction = await service.createTransaction(req.body);
  res.status(201).json(transaction);
};

export const deleteTransaction = async (req: Request, res: Response) => {
  await service.deleteTransaction(req.params.id);
  res.status(204).send();
};

export default { getAllTransactions, getTransactionsByUserId ,getTransactionById, createTransaction, deleteTransaction };