"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.get('/settings/public', adminController_1.getBusinessSettings); // Public route for customer site footer/contacts
router.use(authMiddleware_1.protect);
router.use((0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'));
router.get('/dashboard', adminController_1.getDashboardStats);
router.get('/settings', adminController_1.getBusinessSettings);
router.put('/settings', adminController_1.updateBusinessSettings);
router.get('/working-hours', adminController_1.getWorkingHours);
router.put('/working-hours', adminController_1.updateWorkingHours);
router.get('/holidays', adminController_1.getHolidays);
router.post('/holidays', adminController_1.createHoliday);
router.delete('/holidays/:id', adminController_1.deleteHoliday);
router.get('/audit-logs', adminController_1.getAuditLogs);
exports.default = router;
