import { Router } from 'express';
import { TagController } from '../controllers/tag.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, TagController.createTag);

export default router;