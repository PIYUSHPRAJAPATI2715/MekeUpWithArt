import express from 'express';
import { getServices, getServiceBySlug, createService, updateService, deleteService } from '../controllers/serviceController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createService);
router.put('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateService);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteService);

export default router;
