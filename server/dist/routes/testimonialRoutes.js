"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testimonialController_1 = require("../controllers/testimonialController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.get('/', testimonialController_1.getTestimonials);
router.post('/', testimonialController_1.createTestimonial);
router.get('/admin', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), testimonialController_1.getAllTestimonialsAdmin);
router.put('/admin/:id/status', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), testimonialController_1.toggleTestimonialStatus);
router.delete('/admin/:id', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), testimonialController_1.deleteTestimonial);
exports.default = router;
