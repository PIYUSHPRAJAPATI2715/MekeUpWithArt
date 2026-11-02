"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const broadcastController_1 = require("../controllers/broadcastController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.use((0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'));
router.get('/audience-stats', broadcastController_1.getAudienceStats);
router.get('/', broadcastController_1.getBroadcasts);
router.get('/:id', broadcastController_1.getBroadcastById);
router.post('/send', broadcastController_1.createAndSendBroadcast);
router.delete('/:id', broadcastController_1.deleteBroadcast);
exports.default = router;
