import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import matchRoutes from './match.js';
import roomDocRoutes from './roomDocumentation.js';
import quizRoutes from './quiz.js';
import chatRoutes from './chat.js';
import digilockerRoutes from './digilocker.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/matches', matchRoutes);
router.use('/room-documentation', roomDocRoutes);
router.use('/quiz', quizRoutes);
router.use('/chat', chatRoutes);
router.use('/digilocker', digilockerRoutes);

export default router;