import express from 'express';
import { getAuthUrl, handleCallback } from '../controllers/digilockerController.js';

const router = express.Router();

router.get('/auth-url', getAuthUrl);
router.get('/callback', handleCallback);

export default router;