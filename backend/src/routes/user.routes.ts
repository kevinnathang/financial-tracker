// src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', UserController.createUser);
router.post('/login', AuthController.login);
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/', authMiddleware, UserController.getAllUsers);
router.get('/:id', authMiddleware, UserController.getUser);
router.delete('/:id', authMiddleware, UserController.deleteUser);
router.patch('/:id', authMiddleware, UserController.updateUser);

export default router;