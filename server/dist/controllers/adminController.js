"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.deleteHoliday = exports.createHoliday = exports.getHolidays = exports.updateWorkingHours = exports.getWorkingHours = exports.updateBusinessSettings = exports.getBusinessSettings = exports.updateSettings = exports.getSettings = exports.getSettingsPublic = exports.getDashboardStats = void 0;
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
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
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
const getSettingsPublic = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        let settings = await BusinessSettings_1.BusinessSettings.findOne();
        if (!settings) {
            settings = await BusinessSettings_1.BusinessSettings.create({
                businessName: 'MAKEUP WITH ART',
                phoneNumbers: ['9352769045', '7575939735'],
                email: 'makeupwitharto@gmail.com',
                address: 'Pillar No. 113, Shyam Nagar Metro Station, Jaipur',
                instagram: 'makeup.with.art',
                googleMapsIframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.8912!2d75.7621!3d26.8912',
                heroTitle: 'CRAFTING LUXURY BEAUTY & ARTISTRY',
                heroSubheading: 'Experience Jaipur\'s premier unisex salon destination for HD bridal makeup, couture hair smoothing, hydra facials & 3D chrome nail art.',
                aboutContent: 'At MAKEUP WITH ART, beauty is an immersive art form. Located at Shyam Nagar Metro Station, our luxury unisex studio delivers world-class salon experiences.',
            });
        }
        res.json({ success: true, data: settings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSettingsPublic = getSettingsPublic;
const getSettings = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        let settings = await BusinessSettings_1.BusinessSettings.findOne();
        if (!settings) {
            settings = await BusinessSettings_1.BusinessSettings.create({
                businessName: 'MAKEUP WITH ART',
                phoneNumbers: ['9352769045', '7575939735'],
                email: 'makeupwitharto@gmail.com',
                address: 'Pillar No. 113, Shyam Nagar Metro Station, Jaipur',
                instagram: 'makeup.with.art',
            });
        }
        res.json({ success: true, data: settings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
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
exports.updateSettings = updateSettings;
exports.getBusinessSettings = exports.getSettings;
exports.updateBusinessSettings = exports.updateSettings;
const getWorkingHours = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        let hours = await WorkingHours_1.WorkingHours.find();
        if (hours.length === 0) {
            console.log('[WorkingHours] Empty catalog detected. Auto-seeding 7 default days 10:30 to 21:30...');
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            for (const day of days) {
                await WorkingHours_1.WorkingHours.create({
                    day,
                    isOpen: true,
                    openTime: '10:30',
                    closeTime: '21:30',
                    breakStart: '14:00',
                    breakEnd: '14:30',
                    slotIntervalMinutes: 30,
                });
            }
            hours = await WorkingHours_1.WorkingHours.find();
        }
        res.json({ success: true, data: hours });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getWorkingHours = getWorkingHours;
const updateWorkingHours = async (req, res) => {
    try {
        const { hours } = req.body;
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
            details: 'Updated salon weekly operating hours or break times',
        });
        const updatedHours = await WorkingHours_1.WorkingHours.find();
        res.json({ success: true, data: updatedHours });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateWorkingHours = updateWorkingHours;
const getHolidays = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
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
        const { date, title, isFullDay, customOpenTime, customCloseTime } = req.body;
        if (!date || !title) {
            return res.status(400).json({ success: false, message: 'Date and title are required' });
        }
        const holiday = await Holiday_1.Holiday.create({ date, title, isFullDay: isFullDay !== false, customOpenTime, customCloseTime });
        await AuditLog_1.AuditLog.create({
            admin: req.user?._id,
            adminEmail: req.user?.email || '',
            action: 'CREATE_HOLIDAY',
            entity: 'Holiday',
            details: `Added holiday block for ${date} (${title})`,
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
        const holiday = await Holiday_1.Holiday.findByIdAndDelete(req.params.id);
        if (!holiday)
            return res.status(404).json({ success: false, message: 'Holiday not found' });
        await AuditLog_1.AuditLog.create({
            admin: req.user?._id,
            adminEmail: req.user?.email || '',
            action: 'DELETE_HOLIDAY',
            entity: 'Holiday',
            details: `Removed holiday block for date ${holiday.date}`,
        });
        res.json({ success: true, message: 'Holiday removed' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteHoliday = deleteHoliday;
const getAuditLogs = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        const logs = await AuditLog_1.AuditLog.find().sort({ createdAt: -1 }).limit(100);
        res.json({ success: true, data: logs });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAuditLogs = getAuditLogs;
