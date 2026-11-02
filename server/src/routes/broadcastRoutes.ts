import express from 'express';
import {
  getAudienceStats,
  getBroadcasts,
  getBroadcastById,
  createAndSendBroadcast,
  deleteBroadcast,
} from '../controllers/broadcastController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/audience-stats', getAudienceStats);
router.get('/', getBroadcasts);
router.get('/:id', getBroadcastById);
router.post('/send', createAndSendBroadcast);
router.delete('/:id', deleteBroadcast);

export default router;
