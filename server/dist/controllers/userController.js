"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUserStatus = exports.getUserById = exports.getUsers = void 0;
const User_1 = require("../models/User");
const Booking_1 = require("../models/Booking");
const AuditLog_1 = require("../models/AuditLog");
const getUsers = async (req, res) => {
    try {
        const { search, role, page = 1, limit = 50 } = req.query;
        const query = {};
        if (role && role !== 'All') {
            query.role = role;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const users = await User_1.User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await User_1.User.countDocuments(query);
        res.json({
            success: true,
            data: users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const bookings = await Booking_1.Booking.find({ customer: user._id }).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: {
                user,
                totalBookings: bookings.length,
                bookings,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUserById = getUserById;
const toggleUserStatus = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.role === 'SUPER_ADMIN') {
            return res.status(403).json({ success: false, message: 'Super Admin status cannot be altered' });
        }
        user.isActive = !user.isActive;
        await user.save();
        await AuditLog_1.AuditLog.create({
            admin: req.user?._id,
            adminEmail: req.user?.email || '',
            action: user.isActive ? 'ENABLE_USER' : 'DISABLE_USER',
            entity: 'User',
            entityId: user._id.toString(),
            details: `Account ${user.isActive ? 'enabled' : 'disabled'} for ${user.email}`,
        });
        res.json({
            success: true,
            message: `User account ${user.isActive ? 'enabled' : 'disabled'} successfully`,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.toggleUserStatus = toggleUserStatus;
