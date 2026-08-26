"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.get('/slots', bookingController_1.getSlots);
router.post('/', authMiddleware_1.protect, bookingController_1.createBooking);
router.get('/my-bookings', authMiddleware_1.protect, bookingController_1.getMyBookings);
router.put('/:id/cancel', authMiddleware_1.protect, bookingController_1.cancelBooking);
// Admin Routes
router.get('/admin/all', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), bookingController_1.getAllBookings);
router.put('/admin/:id/status', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), bookingController_1.updateBookingStatus);
exports.default = router;
