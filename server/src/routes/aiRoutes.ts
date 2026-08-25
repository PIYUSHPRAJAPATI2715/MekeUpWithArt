import express from 'express';
import { handleGenerateAIImage } from '../controllers/aiController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.post('/generate-image', protect, authorize('ADMIN', 'SUPER_ADMIN'), handleGenerateAIImage);

export default router;
