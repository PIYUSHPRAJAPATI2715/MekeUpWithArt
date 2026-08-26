"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.post('/', contactController_1.submitContactForm);
router.get('/admin', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), contactController_1.getContactMessagesAdmin);
router.put('/admin/:id/read', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), contactController_1.markContactMessageRead);
exports.default = router;
