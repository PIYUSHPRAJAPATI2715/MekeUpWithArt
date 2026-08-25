import express from 'express';
import {
  getDashboardStats,
  getBusinessSettings,
  updateBusinessSettings,
  getWorkingHours,
  updateWorkingHours,
  getHolidays,
  createHoliday,
  deleteHoliday,
  getAuditLogs,
} from '../controllers/adminController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.get('/settings/public', getBusinessSettings); // Public route for customer site footer/contacts

router.use(protect);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/settings', getBusinessSettings);
router.put('/settings', updateBusinessSettings);

router.get('/working-hours', getWorkingHours);
router.put('/working-hours', updateWorkingHours);

router.get('/holidays', getHolidays);
router.post('/holidays', createHoliday);
router.delete('/holidays/:id', deleteHoliday);

router.get('/audit-logs', getAuditLogs);

export default router;
