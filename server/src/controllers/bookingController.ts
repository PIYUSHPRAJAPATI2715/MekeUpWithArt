import { Response } from 'express';
import { Booking } from '../models/Booking';
import { Service } from '../models/Service';
import { Package } from '../models/Package';
import { Notification } from '../models/Notification';
import { AuditLog } from '../models/AuditLog';
import { AuthRequest } from '../middlewares/authMiddleware';
import { getAvailableSlotsForDate } from '../utils/slotCalculator';
import { sendEmail, getBookingConfirmationEmailTemplate } from '../services/emailService';
import { sendWhatsAppMessage, formatBookingWhatsAppText } from '../services/whatsappService';

export const getSlots = async (req: AuthRequest, res: Response) => {
  try {
    const { date, duration } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required' });
    }

    const durationMinutes = duration ? Number(duration) : 30;
    const slots = await getAvailableSlotsForDate(date as string, durationMinutes);

    res.json({ success: true, date, slots });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { itemType, itemId, date, timeSlot, staff, customerName, customerPhone, customerEmail, notes, variantName } = req.body;

    if (!itemType || !itemId || !date || !timeSlot || !customerName || !customerPhone || !customerEmail) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking details' });
    }

    let itemName = '';
    let price = 0;
    let duration = 45;

    if (itemType === 'service') {
      const service = await Service.findById(itemId);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }
      itemName = service.name;
      price = service.discountPrice || service.price;
      duration = service.duration || 45;

      if (variantName && service.variants) {
        const found = service.variants.find((v) => v.name === variantName);
        if (found) {
          itemName = `${service.name} (${found.name})`;
          price = found.price;
          duration = found.duration;
        }
      }
    } else if (itemType === 'package') {
      const pkg = await Package.findById(itemId);
      if (!pkg) {
        return res.status(404).json({ success: false, message: 'Package not found' });
      }
      itemName = pkg.name;
      price = pkg.discountPrice || pkg.originalPrice;
      duration = pkg.duration || 60;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid itemType' });
    }

    // Validate slot availability (only block if explicitly already booked by another customer)
    const availableSlots = await getAvailableSlotsForDate(date, duration);
    if (availableSlots && availableSlots.length > 0) {
      const cleanTimeSlot = timeSlot.trim().toLowerCase().replace(/\s+/g, '');
      const slotObj = availableSlots.find((s) => s.time.toLowerCase().replace(/\s+/g, '') === cleanTimeSlot);
      if (slotObj && !slotObj.available) {
        return res.status(400).json({ success: false, message: 'Selected time slot is already booked. Please choose another time slot.' });
      }
    }

    // Generate Booking ID: MWA-20260825-XXXX
    const dateFormatted = date.replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `MWA-${dateFormatted}-${randomSuffix}`;

    const booking = await Booking.create({
      bookingId,
      customer: req.user?._id,
      itemType,
      itemId,
      itemName,
      variantName: variantName || '',
      price,
      date,
      timeSlot,
      duration,
      staff: staff || null,
      customerName,
      customerPhone,
      customerEmail,
      notes: notes || '',
      status: 'Pending',
    });

    // In-App Notification for User
    await Notification.create({
      user: req.user?._id,
      title: 'Booking Received',
      message: `Your booking (${bookingId}) for ${itemName} on ${date} at ${timeSlot} is pending confirmation.`,
      channel: 'Web',
      type: 'booking',
      link: '/profile',
    });

    // Send Async WhatsApp & Email Notifications (non-blocking errors)
    const emailHtml = getBookingConfirmationEmailTemplate(booking);
    sendEmail(customerEmail, `Appointment Booking Received #${bookingId} - MAKEUP WITH ART`, emailHtml).catch(console.error);

    const waText = formatBookingWhatsAppText(booking, 'CREATED');
    sendWhatsAppMessage(customerPhone, waText).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ customer: req.user?._id })
      .populate('staff', 'name photo designation')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const { status, date, search, page = 1, limit = 50 } = req.query;
    const query: any = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (date) {
      query.date = date;
    }
    if (search) {
      query.$or = [
        { bookingId: { $regex: search as string, $options: 'i' } },
        { customerName: { $regex: search as string, $options: 'i' } },
        { customerPhone: { $regex: search as string, $options: 'i' } },
        { itemName: { $regex: search as string, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone avatar')
      .populate('staff', 'name designation photo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, cancellationReason, staffId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const oldStatus = booking.status;
    if (status) booking.status = status;
    if (cancellationReason) booking.cancellationReason = cancellationReason;
    if (staffId) booking.staff = staffId;

    await booking.save();

    // Create Audit Log for Admin action
    await AuditLog.create({
      admin: req.user?._id,
      adminEmail: req.user?.email || 'admin@makeupwithart.com',
      action: 'UPDATE_BOOKING_STATUS',
      entity: 'Booking',
      entityId: booking._id.toString(),
      details: `Changed status from ${oldStatus} to ${status} for Booking ${booking.bookingId}`,
    });

    // Notify User
    await Notification.create({
      user: booking.customer,
      title: `Booking Status: ${status}`,
      message: `Your booking #${booking.bookingId} for ${booking.itemName} is now ${status}.`,
      channel: 'Web',
      type: 'booking',
      link: '/profile',
    });

    // Trigger WhatsApp & Email for major status updates
    if (status === 'Confirmed') {
      const waText = formatBookingWhatsAppText(booking, 'CONFIRMED');
      sendWhatsAppMessage(booking.customerPhone, waText).catch(console.error);
    } else if (status === 'Cancelled') {
      const waText = formatBookingWhatsAppText(booking, 'CANCELLED');
      sendWhatsAppMessage(booking.customerPhone, waText).catch(console.error);
    }

    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership if customer
    if (req.user?.role === 'CUSTOMER' && booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'Cancelled';
    booking.cancellationReason = req.body.cancellationReason || 'Cancelled by user';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
