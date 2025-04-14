import { Router } from 'express';
import { TagController } from '../controllers/tag.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, TagController.createTag);
router.get('/', authMiddleware, TagController.getAllTags)
router.delete('/:tagId', authMiddleware, TagController.deleteTag)
router.patch('/:tagId', authMiddleware, TagController.updateTag)

export default router;