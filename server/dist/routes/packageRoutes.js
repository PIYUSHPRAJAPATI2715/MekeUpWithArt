"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const packageController_1 = require("../controllers/packageController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = express_1.default.Router();
router.get('/', packageController_1.getPackages);
router.get('/:slug', packageController_1.getPackageBySlug);
router.post('/', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), packageController_1.createPackage);
router.put('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), packageController_1.updatePackage);
router.delete('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), packageController_1.deletePackage);
exports.default = router;
