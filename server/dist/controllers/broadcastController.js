"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBroadcast = exports.createAndSendBroadcast = exports.getBroadcastById = exports.getBroadcasts = exports.getAudienceStats = void 0;
const Broadcast_1 = require("../models/Broadcast");
const User_1 = require("../models/User");
const Booking_1 = require("../models/Booking");
const ContactMessage_1 = require("../models/ContactMessage");
const whatsappService_1 = require("../services/whatsappService");
/**
 * Get count and preview of recipients by audience
 */
const getAudienceStats = async (req, res) => {
    try {
        const customers = await User_1.User.find({ role: 'CUSTOMER', phone: { $exists: true, $ne: '' } }).select('name phone');
        const bookings = await Booking_1.Booking.find({ customerPhone: { $exists: true, $ne: '' } }).select('customerName customerPhone');
        const contacts = await ContactMessage_1.ContactMessage.find({ phone: { $exists: true, $ne: '' } }).select('name phone');
        const customerPhones = new Set();
        const bookingPhones = new Set();
        const contactPhones = new Set();
        const allPhones = new Set();
        customers.forEach((c) => {
            const p = c.phone.replace(/\D/g, '');
            if (p.length >= 10) {
                customerPhones.add(p);
                allPhones.add(p);
            }
        });
        bookings.forEach((b) => {
            const p = b.customerPhone.replace(/\D/g, '');
            if (p.length >= 10) {
                bookingPhones.add(p);
                allPhones.add(p);
            }
        });
        contacts.forEach((ct) => {
            const p = ct.phone.replace(/\D/g, '');
            if (p.length >= 10) {
                contactPhones.add(p);
                allPhones.add(p);
            }
        });
        const status = (0, whatsappService_1.getWhatsAppConnectionStatus)();
        res.json({
            success: true,
            data: {
                totalUniqueAudience: allPhones.size,
                totalCustomers: customerPhones.size,
                totalBookings: bookingPhones.size,
                totalContacts: contactPhones.size,
                status,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAudienceStats = getAudienceStats;
/**
 * Get all past broadcasts
 */
const getBroadcasts = async (req, res) => {
    try {
        const broadcasts = await Broadcast_1.Broadcast.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email');
        res.json({ success: true, data: broadcasts });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getBroadcasts = getBroadcasts;
/**
 * Get a single broadcast by ID
 */
const getBroadcastById = async (req, res) => {
    try {
        const broadcast = await Broadcast_1.Broadcast.findById(req.params.id).populate('createdBy', 'name email');
        if (!broadcast) {
            return res.status(404).json({ success: false, message: 'Broadcast not found' });
        }
        res.json({ success: true, data: broadcast });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getBroadcastById = getBroadcastById;
/**
 * Create and execute a WhatsApp Broadcast
 */
const createAndSendBroadcast = async (req, res) => {
    try {
        const { title, message, imageUrl, targetAudience = 'ALL', customNumbers = [] } = req.body;
        if (!title || !message) {
            return res.status(400).json({ success: false, message: 'Broadcast title and message are required' });
        }
        // Gather recipients
        const recipientMap = new Map(); // phone -> name
        if (targetAudience === 'CUSTOM' && Array.isArray(customNumbers)) {
            customNumbers.forEach((raw) => {
                const clean = raw.replace(/\D/g, '');
                if (clean.length >= 10) {
                    recipientMap.set(clean, 'Valued Client');
                }
            });
        }
        else {
            if (targetAudience === 'ALL' || targetAudience === 'CUSTOMERS') {
                const users = await User_1.User.find({ role: 'CUSTOMER', phone: { $exists: true, $ne: '' } }).select('name phone');
                users.forEach((u) => {
                    const clean = u.phone.replace(/\D/g, '');
                    if (clean.length >= 10 && !recipientMap.has(clean)) {
                        recipientMap.set(clean, u.name || 'Valued Client');
                    }
                });
            }
            if (targetAudience === 'ALL' || targetAudience === 'BOOKINGS') {
                const bookings = await Booking_1.Booking.find({ customerPhone: { $exists: true, $ne: '' } }).select('customerName customerPhone');
                bookings.forEach((b) => {
                    const clean = b.customerPhone.replace(/\D/g, '');
                    if (clean.length >= 10 && !recipientMap.has(clean)) {
                        recipientMap.set(clean, b.customerName || 'Valued Client');
                    }
                });
            }
            if (targetAudience === 'ALL' || targetAudience === 'CONTACTS') {
                const contacts = await ContactMessage_1.ContactMessage.find({ phone: { $exists: true, $ne: '' } }).select('name phone');
                contacts.forEach((c) => {
                    const clean = c.phone.replace(/\D/g, '');
                    if (clean.length >= 10 && !recipientMap.has(clean)) {
                        recipientMap.set(clean, c.name || 'Valued Client');
                    }
                });
            }
        }
        const recipients = Array.from(recipientMap.entries()).map(([phone, name]) => ({ phone, name }));
        if (recipients.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid phone numbers found in the selected target audience.',
            });
        }
        // Create initial broadcast document
        const broadcast = new Broadcast_1.Broadcast({
            title,
            message,
            imageUrl: imageUrl || '',
            targetAudience,
            customNumbers,
            status: 'SENDING',
            recipientCount: recipients.length,
            sentCount: 0,
            failedCount: 0,
            logs: [],
            createdBy: req.user?._id,
            sentAt: new Date(),
        });
        await broadcast.save();
        // Execute sending
        let sentCount = 0;
        let failedCount = 0;
        const logs = [];
        for (const item of recipients) {
            try {
                // Replace {name} and {salon_name} placeholder
                const personalizedMessage = message
                    .replace(/{name}/gi, item.name)
                    .replace(/{salon_name}/gi, 'MAKEUP WITH ART');
                const result = await (0, whatsappService_1.sendWhatsAppMessage)(item.phone, personalizedMessage, imageUrl);
                if (result.success) {
                    sentCount++;
                    logs.push({
                        phone: item.phone,
                        name: item.name,
                        status: 'SENT',
                        timestamp: new Date(),
                    });
                }
                else {
                    failedCount++;
                    logs.push({
                        phone: item.phone,
                        name: item.name,
                        status: 'FAILED',
                        error: result.message,
                        timestamp: new Date(),
                    });
                }
            }
            catch (sendErr) {
                failedCount++;
                logs.push({
                    phone: item.phone,
                    name: item.name,
                    status: 'FAILED',
                    error: sendErr.message || 'Transmission error',
                    timestamp: new Date(),
                });
            }
        }
        broadcast.sentCount = sentCount;
        broadcast.failedCount = failedCount;
        broadcast.logs = logs;
        broadcast.status = failedCount === 0 ? 'COMPLETED' : sentCount > 0 ? 'PARTIALLY_COMPLETED' : 'FAILED';
        await broadcast.save();
        res.json({
            success: true,
            message: `Broadcast processed for ${recipients.length} recipients (${sentCount} sent, ${failedCount} failed).`,
            data: broadcast,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createAndSendBroadcast = createAndSendBroadcast;
/**
 * Delete a broadcast
 */
const deleteBroadcast = async (req, res) => {
    try {
        const broadcast = await Broadcast_1.Broadcast.findByIdAndDelete(req.params.id);
        if (!broadcast) {
            return res.status(404).json({ success: false, message: 'Broadcast not found' });
        }
        res.json({ success: true, message: 'Broadcast record deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteBroadcast = deleteBroadcast;
