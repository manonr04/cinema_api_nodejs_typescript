import Transaction from "../db/models/transaction";

export const findAllTransactions = () =>
  Transaction.findAll();

export const findTransactionById = (id: number | string) =>
  Transaction.findByPk(id);

export const findTransactionsByUserId = (userId: number | string) =>
  Transaction.findAll({ where: { userId }, order: [['date', 'DESC']] });

export const createTransaction = (data: any) =>
  Transaction.create(data);

export const removeTransaction = (id: number | string) =>
  Transaction.destroy({ where: { id } });

export default {
  findAllTransactions,
  findTransactionById,
  findTransactionsByUserId,
  createTransaction,
  removeTransaction,
};
