"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.get('/me', notificationController_1.getMyNotifications);
router.put('/:id/read', notificationController_1.markAsRead);
router.put('/read-all', notificationController_1.markAllAsRead);
router.post('/broadcast', (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), notificationController_1.sendNotificationBroadcast);
exports.default = router;
