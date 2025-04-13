import { Router } from 'express';
import { BudgetController } from '../controllers/budget.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, BudgetController.createBudget);
router.get('/', authMiddleware, BudgetController.getBudgets);
router.get('/:budgetId', authMiddleware, BudgetController.getBudget);
router.delete('/:budgetId', authMiddleware, BudgetController.deleteBudget)
router.patch('/:budgetId', authMiddleware, BudgetController.updateBudget)

export default router;