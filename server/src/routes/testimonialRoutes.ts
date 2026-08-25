import express from 'express';
import { getTestimonials, getAllTestimonialsAdmin, createTestimonial, toggleTestimonialStatus, deleteTestimonial } from '../controllers/testimonialController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', createTestimonial);

router.get('/admin', protect, authorize('ADMIN', 'SUPER_ADMIN'), getAllTestimonialsAdmin);
router.put('/admin/:id/status', protect, authorize('ADMIN', 'SUPER_ADMIN'), toggleTestimonialStatus);
router.delete('/admin/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteTestimonial);

export default router;
