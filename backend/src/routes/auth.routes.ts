//src/routes/auth.routes.ts
import { AuthController } from '../controllers/auth.controller'
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.initiateUserRegistration);
router.post('/verify/:verificationToken', AuthController.verifyUser);
router.post('/logout', authMiddleware, AuthController.logout);
router.post('/request-reset-password', AuthController.requestResetPassword)
router.post('/reset-password/:token', AuthController.resetPassword)
router.post('/change-password', authMiddleware, AuthController.changePassword)

export default router;