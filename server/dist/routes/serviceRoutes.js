"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serviceController_1 = require("../controllers/serviceController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const seed_1 = require("../utils/seed");
const router = express_1.default.Router();
// 1. Force Seed Endpoint (Static - Must be above dynamic :slug)
router.get('/force-seed', async (req, res) => {
    try {
        console.log('[API Force Seed] Triggering database seeding...');
        await (0, seed_1.seedDatabaseData)();
        res.json({ success: true, message: 'Database populated with all demo services, packages, and admin accounts!' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
// 2. List Services
router.get('/', serviceController_1.getServices);
// 3. Admin Mutation Routes
router.post('/', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), serviceController_1.createService);
router.put('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), serviceController_1.updateService);
router.delete('/:id', authMiddleware_1.protect, (0, roleMiddleware_1.authorize)('ADMIN', 'SUPER_ADMIN'), serviceController_1.deleteService);
// 4. Dynamic Slug Route (Must be last)
router.get('/:slug', serviceController_1.getServiceBySlug);
exports.default = router;
