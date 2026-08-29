"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabaseData = void 0;
const seedRealMenu_1 = require("./seedRealMenu");
const User_1 = require("../models/User");
const seedDatabaseData = async () => {
    console.log('[Seed] Seeding database safely with real menu price list...');
    // Admin User
    const adminUser = await User_1.User.findOne({ email: 'admin@makeupwithart.com' });
    if (!adminUser) {
        await User_1.User.create({
            name: 'Art Director Admin',
            email: 'admin@makeupwithart.com',
            phone: '9352769045',
            password: 'Admin@123456',
            role: 'SUPER_ADMIN',
            isActive: true,
            avatar: '/logo.png',
        });
    }
    else if (adminUser.role !== 'SUPER_ADMIN') {
        adminUser.role = 'SUPER_ADMIN';
        await adminUser.save();
    }
    // Sample Customer
    const customerUser = await User_1.User.findOne({ email: 'customer@gmail.com' });
    if (!customerUser) {
        await User_1.User.create({
            name: 'Priya Sharma',
            email: 'customer@gmail.com',
            phone: '7575939735',
            password: 'Customer@123456',
            role: 'CUSTOMER',
            isActive: true,
            avatar: '/logo.png',
        });
    }
    // Seed Real Menu Items
    await (0, seedRealMenu_1.seedRealMenuData)();
};
exports.seedDatabaseData = seedDatabaseData;
