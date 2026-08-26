import express from 'express';
import { getServices, getServiceBySlug, createService, updateService, deleteService } from '../controllers/serviceController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { seedDatabaseData } from '../utils/seed';

const router = express.Router();

router.get('/force-seed', async (req, res) => {
  try {
    console.log('[API Force Seed] Triggering database seeding...');
    await seedDatabaseData();
    res.json({ success: true, message: 'Database populated with all demo services, packages, and admin accounts!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createService);
router.put('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateService);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteService);

export default router;
