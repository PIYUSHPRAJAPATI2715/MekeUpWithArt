import { Response } from 'express';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendEmail } from '../services/emailService';
import { sendWhatsAppMessage } from '../services/whatsappService';
import { AuditLog } from '../models/AuditLog';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany({ user: req.user?._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendNotificationBroadcast = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, channel, targetAudience, selectedUserIds } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    let targetUsers: any[] = [];
    if (targetAudience === 'SELECTED' && Array.isArray(selectedUserIds)) {
      targetUsers = await User.find({ _id: { $in: selectedUserIds } });
    } else {
      targetUsers = await User.find({ role: 'CUSTOMER', isActive: true });
    }

    // Save in-app notifications
    const docs = targetUsers.map((u) => ({
      user: u._id,
      title,
      message,
      channel: channel || 'Web',
      type: 'promotion',
    }));

    await Notification.insertMany(docs);

    // Multi-channel async dispatch
    if (channel === 'Email' || channel === 'All') {
      targetUsers.forEach((u) => {
        sendEmail(u.email, title, `<div style="font-family: sans-serif; padding: 20px;"><h2>${title}</h2><p>${message}</p></div>`).catch(console.error);
      });
    }

    if (channel === 'WhatsApp' || channel === 'All') {
      targetUsers.forEach((u) => {
        if (u.phone) {
          sendWhatsAppMessage(u.phone, `*${title}*\n\n${message}\n\n- MAKEUP WITH ART`).catch(console.error);
        }
      });
    }

    await AuditLog.create({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
