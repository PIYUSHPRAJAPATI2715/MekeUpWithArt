import express from 'express';
import { submitContactForm, getContactMessagesAdmin, markContactMessageRead } from '../controllers/contactController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.post('/', submitContactForm);
router.get('/admin', protect, authorize('ADMIN', 'SUPER_ADMIN'), getContactMessagesAdmin);
router.put('/admin/:id/read', protect, authorize('ADMIN', 'SUPER_ADMIN'), markContactMessageRead);

export default router;
