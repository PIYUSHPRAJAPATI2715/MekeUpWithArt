"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationBroadcast = exports.markAllAsRead = exports.markAsRead = exports.getMyNotifications = void 0;
const Notification_1 = require("../models/Notification");
const User_1 = require("../models/User");
const emailService_1 = require("../services/emailService");
const whatsappService_1 = require("../services/whatsappService");
const AuditLog_1 = require("../models/AuditLog");
const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification_1.Notification.find({
            $or: [{ user: req.user?._id }, { user: null }],
        })
            .sort({ createdAt: -1 })
            .limit(30);
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        res.json({
            success: true,
            unreadCount,
            data: notifications,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyNotifications = getMyNotifications;
const markAsRead = async (req, res) => {
    try {
        await Notification_1.Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true, message: 'Notification marked as read' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        await Notification_1.Notification.updateMany({ user: req.user?._id, isRead: false }, { isRead: true });
        res.json({ success: true, message: 'All notifications marked as read' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.markAllAsRead = markAllAsRead;
const sendNotificationBroadcast = async (req, res) => {
    try {
        const { title, message, channel, targetAudience, selectedUserIds } = req.body;
        if (!title || !message) {
            return res.status(400).json({ success: false, message: 'Title and message are required' });
        }
        let targetUsers = [];
        if (targetAudience === 'SELECTED' && Array.isArray(selectedUserIds)) {
            targetUsers = await User_1.User.find({ _id: { $in: selectedUserIds } });
        }
        else {
            targetUsers = await User_1.User.find({ role: 'CUSTOMER', isActive: true });
        }
        // Save in-app notifications
        const docs = targetUsers.map((u) => ({
            user: u._id,
            title,
            message,
            channel: channel || 'Web',
            type: 'promotion',
        }));
        await Notification_1.Notification.insertMany(docs);
        // Multi-channel async dispatch
        if (channel === 'Email' || channel === 'All') {
            targetUsers.forEach((u) => {
                (0, emailService_1.sendEmail)(u.email, title, `<div style="font-family: sans-serif; padding: 20px;"><h2>${title}</h2><p>${message}</p></div>`).catch(console.error);
            });
        }
        if (channel === 'WhatsApp' || channel === 'All') {
            targetUsers.forEach((u) => {
                if (u.phone) {
                    (0, whatsappService_1.sendWhatsAppMessage)(u.phone, `*${title}*\n\n${message}\n\n- MAKEUP WITH ART`).catch(console.error);
                }
            });
        }
        await AuditLog_1.AuditLog.create({
            admin: req.user?._id,
            adminEmail: req.user?.email || '',
            action: 'SEND_BROADCAST_NOTIFICATION',
            entity: 'Notification',
            details: `Sent notification '${title}' to ${targetUsers.length} users via channel ${channel}`,
        });
        res.json({
            success: true,
            message: `Notification broadcast sent to ${targetUsers.length} recipient(s).`,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.sendNotificationBroadcast = sendNotificationBroadcast;
