"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.use((0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'));
router.get('/', userController_1.getUsers);
router.get('/:id', userController_1.getUserById);
router.put('/:id/toggle-status', userController_1.toggleUserStatus);
exports.default = router;
