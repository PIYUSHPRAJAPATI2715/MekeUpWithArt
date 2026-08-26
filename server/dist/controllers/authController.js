"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const Service_1 = require("../models/Service");
const generateToken_1 = require("../utils/generateToken");
const seed_1 = require("../utils/seed");
const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }
        // Auto-grant SUPER_ADMIN for admin/owner email handles
        const lowerEmail = email.toLowerCase();
        const isOwnerEmail = lowerEmail.includes('admin') || lowerEmail.includes('owner') || lowerEmail === 'makeupwitharto@gmail.com';
        const role = isOwnerEmail ? 'SUPER_ADMIN' : 'CUSTOMER';
        const user = await User_1.User.create({
            name,
            email,
            phone,
            password,
            role,
        });
        // Auto-seed demo services/packages if database has no services
        const serviceCount = await Service_1.Service.countDocuments();
        if (serviceCount === 0) {
            console.log('[Register] Empty services detected. Auto-seeding catalog...');
            await (0, seed_1.seedDatabaseData)();
        }
        const token = (0, generateToken_1.generateToken)(user._id.toString(), user.role);
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }
        let user = await User_1.User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact administration.' });
        }
        // Direct MongoDB raw collection update for guaranteed SUPER_ADMIN role in MongoDB Atlas
        const lowerEmail = user.email.toLowerCase();
        const isOwnerEmail = lowerEmail.includes('admin') || lowerEmail.includes('owner') || lowerEmail === 'makeupwitharto@gmail.com';
        if (isOwnerEmail) {
            await User_1.User.collection.updateOne({ _id: user._id }, { $set: { role: 'SUPER_ADMIN' } });
            user.role = 'SUPER_ADMIN';
        }
        // Auto-seed catalog if empty
        const serviceCount = await Service_1.Service.countDocuments();
        if (serviceCount === 0) {
            console.log('[Login] Empty services detected. Auto-seeding catalog...');
            await (0, seed_1.seedDatabaseData)();
        }
        const token = (0, generateToken_1.generateToken)(user._id.toString(), user.role);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res) => {
    try {
        const { name, phone, avatar } = req.body;
        const user = await User_1.User.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (name)
            user.name = name;
        if (phone)
            user.phone = phone;
        if (avatar)
            user.avatar = avatar;
        await user.save();
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProfile = updateProfile;
