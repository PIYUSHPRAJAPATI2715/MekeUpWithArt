"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const staffController_1 = require("../controllers/staffController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.get('/', staffController_1.getStaffMembers);
router.get('/admin', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), staffController_1.getAllStaffAdmin);
router.post('/admin', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), staffController_1.createStaff);
router.put('/admin/:id', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), staffController_1.updateStaff);
router.delete('/admin/:id', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), staffController_1.deleteStaff);
exports.default = router;
