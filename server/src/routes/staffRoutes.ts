import express from 'express';
import { getStaffMembers, getAllStaffAdmin, createStaff, updateStaff, deleteStaff } from '../controllers/staffController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.get('/', getStaffMembers);

router.get('/admin', protect, authorize('ADMIN', 'SUPER_ADMIN'), getAllStaffAdmin);
router.post('/admin', protect, authorize('ADMIN', 'SUPER_ADMIN'), createStaff);
router.put('/admin/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateStaff);
router.delete('/admin/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteStaff);

export default router;
