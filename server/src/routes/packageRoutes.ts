import express from 'express';
import { getPackages, getPackageBySlug, createPackage, updatePackage, deletePackage } from '../controllers/packageController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.get('/', getPackages);
router.get('/:slug', getPackageBySlug);

router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createPackage);
router.put('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updatePackage);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deletePackage);

export default router;
