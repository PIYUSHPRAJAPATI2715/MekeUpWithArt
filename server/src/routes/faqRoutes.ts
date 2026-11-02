import express from 'express';
import {
  getPublicFaqs,
  getAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from '../controllers/faqController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

// Public route for customer FAQ page
router.get('/', getPublicFaqs);

// Admin routes
router.get('/admin', protect, authorize('ADMIN', 'SUPER_ADMIN'), getAdminFaqs);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createFaq);
router.put('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateFaq);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteFaq);

export default router;
