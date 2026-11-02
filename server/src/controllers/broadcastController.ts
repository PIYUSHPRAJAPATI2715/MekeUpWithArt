import { Request, Response } from 'express';
import { Broadcast } from '../models/Broadcast';
import { User } from '../models/User';
import { Booking } from '../models/Booking';
import { ContactMessage } from '../models/ContactMessage';
import { sendWhatsAppMessage, getWhatsAppConnectionStatus } from '../services/whatsappService';
import { AuthRequest } from '../middlewares/authMiddleware';

/**
 * Get count and preview of recipients by audience
 */
export const getAudienceStats = async (req: AuthRequest, res: Response) => {
  try {
    const customers = await User.find({ role: 'CUSTOMER', phone: { $exists: true, $ne: '' } }).select('name phone');
    const bookings = await Booking.find({ customerPhone: { $exists: true, $ne: '' } }).select('customerName customerPhone');
    const contacts = await ContactMessage.find({ phone: { $exists: true, $ne: '' } }).select('name phone');

    const customerPhones = new Set<string>();
    const bookingPhones = new Set<string>();
    const contactPhones = new Set<string>();
    const allPhones = new Set<string>();

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

    const status = getWhatsAppConnectionStatus();

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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all past broadcasts
 */
export const getBroadcasts = async (req: AuthRequest, res: Response) => {
  try {
    const broadcasts = await Broadcast.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    res.json({ success: true, data: broadcasts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get a single broadcast by ID
 */
export const getBroadcastById = async (req: AuthRequest, res: Response) => {
  try {
    const broadcast = await Broadcast.findById(req.params.id).populate('createdBy', 'name email');
    if (!broadcast) {
      return res.status(404).json({ success: false, message: 'Broadcast not found' });
    }
    res.json({ success: true, data: broadcast });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create and execute a WhatsApp Broadcast
 */
export const createAndSendBroadcast = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, imageUrl, targetAudience = 'ALL', customNumbers = [] } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Broadcast title and message are required' });
    }

    // Gather recipients
    const recipientMap = new Map<string, string>(); // phone -> name

    if (targetAudience === 'CUSTOM' && Array.isArray(customNumbers)) {
      customNumbers.forEach((raw: string) => {
        const clean = raw.replace(/\D/g, '');
        if (clean.length >= 10) {
          recipientMap.set(clean, 'Valued Client');
        }
      });
    } else {
      if (targetAudience === 'ALL' || targetAudience === 'CUSTOMERS') {
        const users = await User.find({ role: 'CUSTOMER', phone: { $exists: true, $ne: '' } }).select('name phone');
        users.forEach((u) => {
          const clean = u.phone.replace(/\D/g, '');
          if (clean.length >= 10 && !recipientMap.has(clean)) {
            recipientMap.set(clean, u.name || 'Valued Client');
          }
        });
      }

      if (targetAudience === 'ALL' || targetAudience === 'BOOKINGS') {
        const bookings = await Booking.find({ customerPhone: { $exists: true, $ne: '' } }).select('customerName customerPhone');
        bookings.forEach((b) => {
          const clean = b.customerPhone.replace(/\D/g, '');
          if (clean.length >= 10 && !recipientMap.has(clean)) {
            recipientMap.set(clean, b.customerName || 'Valued Client');
          }
        });
      }

      if (targetAudience === 'ALL' || targetAudience === 'CONTACTS') {
        const contacts = await ContactMessage.find({ phone: { $exists: true, $ne: '' } }).select('name phone');
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
    const broadcast = new Broadcast({
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
    const logs: any[] = [];

    for (const item of recipients) {
      try {
        // Replace {name} and {salon_name} placeholder
        const personalizedMessage = message
          .replace(/{name}/gi, item.name)
          .replace(/{salon_name}/gi, 'MAKEUP WITH ART');

        const result = await sendWhatsAppMessage(item.phone, personalizedMessage, imageUrl);

        if (result.success) {
          sentCount++;
          logs.push({
            phone: item.phone,
            name: item.name,
            status: 'SENT',
            timestamp: new Date(),
          });
        } else {
          failedCount++;
          logs.push({
            phone: item.phone,
            name: item.name,
            status: 'FAILED',
            error: result.message,
            timestamp: new Date(),
          });
        }
      } catch (sendErr: any) {
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a broadcast
 */
export const deleteBroadcast = async (req: AuthRequest, res: Response) => {
  try {
    const broadcast = await Broadcast.findByIdAndDelete(req.params.id);
    if (!broadcast) {
      return res.status(404).json({ success: false, message: 'Broadcast not found' });
    }
    res.json({ success: true, message: 'Broadcast record deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
