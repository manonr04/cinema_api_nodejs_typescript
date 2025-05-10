import * as walletRepo from '../repositories/transactionRepository';

export const getAllTransactions = () => {
  return walletRepo.findAllTransactions();
};

export const getTransactionById = (id: string) => {
  return walletRepo.findTransactionById(id);
};

export const getTransactionsByUserId = (userId: string) => {
  return walletRepo.findTransactionsByUserId(userId);
};

export const createTransaction = (data: any) => {
  if (!['deposit', 'withdrawal', 'purchase'].includes(data.type)) {
    throw new Error("Type de transaction invalide (deposit, withdrawal, purchase)");
  }

  if (data.amount <= 0) {
    throw new Error("Le montant doit être supérieur à zéro");
  }

  return walletRepo.createTransaction({
    userId: data.userId,
    amount: data.amount,
    type: data.type,
    date: new Date()
  });
};

export const deleteTransaction = (id: string) => {
  return walletRepo.removeTransaction(id);
};

export default { getAllTransactions, getTransactionById, getTransactionsByUserId, createTransaction, deleteTransaction };
