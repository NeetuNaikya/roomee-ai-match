import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/chatController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/:matchId', authenticate, getMessages);
router.post('/:matchId', authenticate, sendMessage);
export default router;