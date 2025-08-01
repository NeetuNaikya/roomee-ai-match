import { Router } from 'express';
import { submitQuiz, getQuizResult } from '../controllers/quizController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/submit', authenticate, submitQuiz);
router.get('/result', authenticate, getQuizResult);
export default router;