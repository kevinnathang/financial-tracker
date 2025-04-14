import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, TransactionController.createTransaction);
router.get('/', authMiddleware, TransactionController.getAllTransactions);
router.get('/monthly-stats', authMiddleware, TransactionController.getMonthlyStats);
router.delete('/:transactionId', authMiddleware, TransactionController.deleteTransaction)
router.patch('/:transactionId', authMiddleware, TransactionController.updateTransaction)

export default router;