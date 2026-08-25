import express from 'express';
import { getSlots, createBooking, getMyBookings, getAllBookings, updateBookingStatus, cancelBooking } from '../controllers/bookingController';
import { protect } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.get('/slots', getSlots);

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin Routes
router.get('/admin/all', protect, authorize('ADMIN', 'SUPER_ADMIN'), getAllBookings);
router.put('/admin/:id/status', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateBookingStatus);

export default router;
