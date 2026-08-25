import express from 'express';
import { getMyNotifications, markAsRead, markAllAsRead, sendNotificationBroadcast } from '../controllers/notificationController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.use(protect);

router.get('/me', getMyNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

router.post('/broadcast', authorize('ADMIN', 'SUPER_ADMIN'), sendNotificationBroadcast);

export default router;
