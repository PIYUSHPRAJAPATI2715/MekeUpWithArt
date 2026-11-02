"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const faqController_1 = require("../controllers/faqController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
// Public route for customer FAQ page
router.get('/', faqController_1.getPublicFaqs);
// Admin routes
router.get('/admin', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), faqController_1.getAdminFaqs);
router.post('/', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), faqController_1.createFaq);
router.put('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), faqController_1.updateFaq);
router.delete('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), faqController_1.deleteFaq);
exports.default = router;
