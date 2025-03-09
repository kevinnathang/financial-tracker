// src/routes/index.ts
import { Router } from 'express';
import userRoutes from './user.routes';
import transactionRoutes from './transaction.routes';
import authRoutes from './auth.routes'

const router = Router();

router.use('/user', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/auth', authRoutes)

export default router;