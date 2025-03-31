import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, TransactionController.createTransaction);

// Get user transactions with filtering options
router.get('/', authMiddleware, TransactionController.getTransactions);

// Get monthly transaction statistics (for dashboard)
router.get('/monthly-stats', authMiddleware, TransactionController.getMonthlyStats);

router.delete('/:transactionId', authMiddleware, TransactionController.deleteTransaction)

export default router;