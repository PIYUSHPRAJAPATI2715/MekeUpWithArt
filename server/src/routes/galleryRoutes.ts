import express from 'express';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../controllers/galleryController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.get('/', getGallery);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createGalleryItem);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteGalleryItem);

export default router;
