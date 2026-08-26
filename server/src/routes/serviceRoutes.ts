import express from 'express';
import { getServices, getServiceBySlug, createService, updateService, deleteService } from '../controllers/serviceController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { seedDatabaseData } from '../utils/seed';

const router = express.Router();

// 1. Force Seed Endpoint (Static - Must be above dynamic :slug)
router.get('/force-seed', async (req, res) => {
  try {
    console.log('[API Force Seed] Triggering database seeding...');
    await seedDatabaseData();
    res.json({ success: true, message: 'Database populated with all demo services, packages, and admin accounts!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. List Services
router.get('/', getServices);

// 3. Admin Mutation Routes
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createService);
router.put('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateService);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteService);

// 4. Dynamic Slug Route (Must be last)
router.get('/:slug', getServiceBySlug);

export default router;
