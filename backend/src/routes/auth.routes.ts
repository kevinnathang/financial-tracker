import { AuthController } from '../controllers/auth.controller'
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/logout', authMiddleware, AuthController.logout);
router.post('/reset-password-request', authMiddleware, AuthController.sendResetPassword)
router.post('/reset-password', AuthController.resetPassword)

export default router;