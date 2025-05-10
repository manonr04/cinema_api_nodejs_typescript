import { Router } from 'express';
import WalletController from '../controllers/transactionController';

const router = Router();

router.post('/', WalletController.createTransaction);
router.get('/', WalletController.getAllTransactions);
router.get('/:id', WalletController.getTransactionById);
router.get('/user/:id', WalletController.getTransactionsByUserId);

export default router;
