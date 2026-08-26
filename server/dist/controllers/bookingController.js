"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.updateBookingStatus = exports.getAllBookings = exports.getMyBookings = exports.createBooking = exports.getSlots = void 0;
const Booking_1 = require("../models/Booking");
const Service_1 = require("../models/Service");
const Package_1 = require("../models/Package");
const Notification_1 = require("../models/Notification");
const AuditLog_1 = require("../models/AuditLog");
const slotCalculator_1 = require("../utils/slotCalculator");
const emailService_1 = require("../services/emailService");
const whatsappService_1 = require("../services/whatsappService");
const getSlots = async (req, res) => {
    try {
        const { date, duration } = req.query;
        if (!date) {
            return res.status(400).json({ success: false, message: 'Date parameter is required' });
        }
        const durationMinutes = duration ? Number(duration) : 30;
        const slots = await (0, slotCalculator_1.getAvailableSlotsForDate)(date, durationMinutes);
        res.json({ success: true, date, slots });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSlots = getSlots;
const createBooking = async (req, res) => {
    try {
        const { itemType, itemId, date, timeSlot, staff, customerName, customerPhone, customerEmail, notes, variantName } = req.body;
        if (!itemType || !itemId || !date || !timeSlot || !customerName || !customerPhone || !customerEmail) {
            return res.status(400).json({ success: false, message: 'Please provide all required booking details' });
        }
        let itemName = '';
        let price = 0;
        let duration = 45;
        if (itemType === 'service') {
            const service = await Service_1.Service.findById(itemId);
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
        }
        else if (itemType === 'package') {
            const pkg = await Package_1.Package.findById(itemId);
            if (!pkg) {
                return res.status(404).json({ success: false, message: 'Package not found' });
            }
            itemName = pkg.name;
            price = pkg.discountPrice || pkg.originalPrice;
            duration = pkg.duration || 60;
        }
        else {
            return res.status(400).json({ success: false, message: 'Invalid itemType' });
        }
        // Backend availability validation to prevent double booking
        const availableSlots = await (0, slotCalculator_1.getAvailableSlotsForDate)(date, duration);
        const targetSlot = availableSlots.find((s) => s.time === timeSlot);
        if (!targetSlot || !targetSlot.available) {
            return res.status(400).json({ success: false, message: 'Selected time slot is no longer available. Please select another slot.' });
        }
        // Generate Booking ID: MWA-20260825-XXXX
        const dateFormatted = date.replace(/-/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const bookingId = `MWA-${dateFormatted}-${randomSuffix}`;
        const booking = await Booking_1.Booking.create({
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
        await Notification_1.Notification.create({
            user: req.user?._id,
            title: 'Booking Received',
            message: `Your booking (${bookingId}) for ${itemName} on ${date} at ${timeSlot} is pending confirmation.`,
            channel: 'Web',
            type: 'booking',
            link: '/profile',
        });
        // Send Async WhatsApp & Email Notifications (non-blocking errors)
        const emailHtml = (0, emailService_1.getBookingConfirmationEmailTemplate)(booking);
        (0, emailService_1.sendEmail)(customerEmail, `Appointment Booking Received #${bookingId} - MAKEUP WITH ART`, emailHtml).catch(console.error);
        const waText = (0, whatsappService_1.formatBookingWhatsAppText)(booking, 'CREATED');
        (0, whatsappService_1.sendWhatsAppMessage)(customerPhone, waText).catch(console.error);
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createBooking = createBooking;
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking_1.Booking.find({ customer: req.user?._id })
            .populate('staff', 'name photo designation')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: bookings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyBookings = getMyBookings;
const getAllBookings = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        const { status, date, search, page = 1, limit = 50 } = req.query;
        const query = {};
        if (status && status !== 'All') {
            query.status = status;
        }
        if (date) {
            query.date = date;
        }
        if (search) {
            query.$or = [
                { bookingId: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { customerPhone: { $regex: search, $options: 'i' } },
                { itemName: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const bookings = await Booking_1.Booking.find(query)
            .populate('customer', 'name email phone avatar')
            .populate('staff', 'name designation photo')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Booking_1.Booking.countDocuments(query);
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllBookings = getAllBookings;
const updateBookingStatus = async (req, res) => {
    try {
        const { status, cancellationReason, staffId } = req.body;
        const booking = await Booking_1.Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        const oldStatus = booking.status;
        if (status)
            booking.status = status;
        if (cancellationReason)
            booking.cancellationReason = cancellationReason;
        if (staffId)
            booking.staff = staffId;
        await booking.save();
        // Create Audit Log for Admin action
        await AuditLog_1.AuditLog.create({
            admin: req.user?._id,
            adminEmail: req.user?.email || 'admin@makeupwithart.com',
            action: 'UPDATE_BOOKING_STATUS',
            entity: 'Booking',
            entityId: booking._id.toString(),
            details: `Changed status from ${oldStatus} to ${status} for Booking ${booking.bookingId}`,
        });
        // Notify User
        await Notification_1.Notification.create({
            user: booking.customer,
            title: `Booking Status: ${status}`,
            message: `Your booking #${booking.bookingId} for ${booking.itemName} is now ${status}.`,
            channel: 'Web',
            type: 'booking',
            link: '/profile',
        });
        // Trigger WhatsApp & Email for major status updates
        if (status === 'Confirmed') {
            const waText = (0, whatsappService_1.formatBookingWhatsAppText)(booking, 'CONFIRMED');
            (0, whatsappService_1.sendWhatsAppMessage)(booking.customerPhone, waText).catch(console.error);
        }
        else if (status === 'Cancelled') {
            const waText = (0, whatsappService_1.formatBookingWhatsAppText)(booking, 'CANCELLED');
            (0, whatsappService_1.sendWhatsAppMessage)(booking.customerPhone, waText).catch(console.error);
        }
        res.json({ success: true, data: booking });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateBookingStatus = updateBookingStatus;
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking_1.Booking.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.cancelBooking = cancelBooking;
