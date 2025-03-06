//src/routes/auth.routes.ts
import { AuthController } from '../controllers/auth.controller'
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/logout', authMiddleware, AuthController.logout);
router.post('/request-reset-password', AuthController.requestResetPassword)
router.post('/reset-password/:token', AuthController.resetPassword)

export default router;