import { Router } from 'express';
import { getRoomDocumentation } from '../controllers/roomDocumentationController.js';

const router = Router();
router.get('/', getRoomDocumentation);
export default router;