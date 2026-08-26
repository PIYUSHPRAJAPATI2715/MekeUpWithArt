"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.deleteHoliday = exports.createHoliday = exports.getHolidays = exports.updateWorkingHours = exports.getWorkingHours = exports.updateBusinessSettings = exports.getBusinessSettings = exports.getDashboardStats = void 0;
const User_1 = require("../models/User");
const Booking_1 = require("../models/Booking");
const Service_1 = require("../models/Service");
const Package_1 = require("../models/Package");
const BusinessSettings_1 = require("../models/BusinessSettings");
const WorkingHours_1 = require("../models/WorkingHours");
const Holiday_1 = require("../models/Holiday");
const AuditLog_1 = require("../models/AuditLog");
const getDashboardStats = async (req, res) => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const [totalUsers, totalBookings, todaysBookings, pendingBookings, confirmedBookings, completedBookings, cancelledBookings, totalServices, totalPackages, recentBookings, completedList,] = await Promise.all([
            User_1.User.countDocuments({ role: 'CUSTOMER' }),
            Booking_1.Booking.countDocuments(),
            Booking_1.Booking.countDocuments({ date: todayStr }),
            Booking_1.Booking.countDocuments({ status: 'Pending' }),
            Booking_1.Booking.countDocuments({ status: 'Confirmed' }),
            Booking_1.Booking.countDocuments({ status: 'Completed' }),
            Booking_1.Booking.countDocuments({ status: 'Cancelled' }),
            Service_1.Service.countDocuments({ status: 'Active' }),
            Package_1.Package.countDocuments({ status: 'Active' }),
            Booking_1.Booking.find().sort({ createdAt: -1 }).limit(6).populate('customer', 'name avatar'),
            Booking_1.Booking.find({ status: 'Completed' }).select('price'),
        ]);
        const totalRevenue = completedList.reduce((acc, curr) => acc + (curr.price || 0), 0);
        res.json({
            success: true,
            stats: {
                totalUsers,
                totalBookings,
                todaysBookings,
                pendingBookings,
                confirmedBookings,
                completedBookings,
                cancelledBookings,
                totalServices,
                totalPackages,
                totalRevenue,
            },
            recentBookings,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
const getBusinessSettings = async (req, res) => {
    try {
        let settings = await BusinessSettings_1.BusinessSettings.findOne();
        if (!settings) {
            settings = await BusinessSettings_1.BusinessSettings.create({});
        }
        res.json({ success: true, data: settings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getBusinessSettings = getBusinessSettings;
const updateBusinessSettings = async (req, res) => {
    try {
        let settings = await BusinessSettings_1.BusinessSettings.findOne();
        if (!settings) {
            settings = await BusinessSettings_1.BusinessSettings.create(req.body);
        }
        else {
            settings = await BusinessSettings_1.BusinessSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
        }
        await AuditLog_1.AuditLog.create({
            admin: req.user?._id,
            adminEmail: req.user?.email || '',
            action: 'UPDATE_BUSINESS_SETTINGS',
            entity: 'BusinessSettings',
            details: 'Updated salon address, contacts, or hero branding details',
        });
        res.json({ success: true, data: settings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateBusinessSettings = updateBusinessSettings;
const getWorkingHours = async (req, res) => {
    try {
        const hours = await WorkingHours_1.WorkingHours.find().sort({ createdAt: 1 });
        res.json({ success: true, data: hours });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getWorkingHours = getWorkingHours;
const updateWorkingHours = async (req, res) => {
    try {
        const { hours } = req.body; // array of working hour objects
        if (!Array.isArray(hours)) {
            return res.status(400).json({ success: false, message: 'Invalid payload, expected array' });
        }
        for (const item of hours) {
            await WorkingHours_1.WorkingHours.findOneAndUpdate({ day: item.day }, item, { upsert: true, new: true });
        }
        await AuditLog_1.AuditLog.create({
            admin: req.user?._id,
            adminEmail: req.user?.email || '',
            action: 'UPDATE_WORKING_HOURS',
            entity: 'WorkingHours',
            details: 'Updated weekly operating hours & break times',
        });
        res.json({ success: true, message: 'Working hours updated successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateWorkingHours = updateWorkingHours;
const getHolidays = async (req, res) => {
    try {
        const holidays = await Holiday_1.Holiday.find().sort({ date: 1 });
        res.json({ success: true, data: holidays });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getHolidays = getHolidays;
const createHoliday = async (req, res) => {
    try {
        const { date, title, isFullDay, notes } = req.body;
        if (!date || !title) {
            return res.status(400).json({ success: false, message: 'Date and title are required' });
        }
        const holiday = await Holiday_1.Holiday.create({ date, title, isFullDay: isFullDay ?? true, notes: notes || '' });
        await AuditLog_1.AuditLog.create({
            admin: req.user?._id,
            adminEmail: req.user?.email || '',
            action: 'CREATE_HOLIDAY',
            entity: 'Holiday',
            entityId: holiday._id.toString(),
            details: `Added holiday: ${title} on ${date}`,
        });
        res.status(201).json({ success: true, data: holiday });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createHoliday = createHoliday;
const deleteHoliday = async (req, res) => {
    try {
        await Holiday_1.Holiday.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Holiday deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteHoliday = deleteHoliday;
const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog_1.AuditLog.find().sort({ createdAt: -1 }).limit(100);
        res.json({ success: true, data: logs });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAuditLogs = getAuditLogs;
