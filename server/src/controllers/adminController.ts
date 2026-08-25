import { Response } from 'express';
import { User } from '../models/User';
import { Booking } from '../models/Booking';
import { Service } from '../models/Service';
import { Package } from '../models/Package';
import { BusinessSettings } from '../models/BusinessSettings';
import { WorkingHours } from '../models/WorkingHours';
import { Holiday } from '../models/Holiday';
import { AuditLog } from '../models/AuditLog';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const [
      totalUsers,
      totalBookings,
      todaysBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalServices,
      totalPackages,
      recentBookings,
      completedList,
    ] = await Promise.all([
      User.countDocuments({ role: 'CUSTOMER' }),
      Booking.countDocuments(),
      Booking.countDocuments({ date: todayStr }),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Confirmed' }),
      Booking.countDocuments({ status: 'Completed' }),
      Booking.countDocuments({ status: 'Cancelled' }),
      Service.countDocuments({ status: 'Active' }),
      Package.countDocuments({ status: 'Active' }),
      Booking.find().sort({ createdAt: -1 }).limit(6).populate('customer', 'name avatar'),
      Booking.find({ status: 'Completed' }).select('price'),
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBusinessSettings = async (req: AuthRequest, res: Response) => {
  try {
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = await BusinessSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBusinessSettings = async (req: AuthRequest, res: Response) => {
  try {
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = await BusinessSettings.create(req.body);
    } else {
      settings = await BusinessSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }

    await AuditLog.create({
      admin: req.user?._id,
      adminEmail: req.user?.email || '',
      action: 'UPDATE_BUSINESS_SETTINGS',
      entity: 'BusinessSettings',
      details: 'Updated salon address, contacts, or hero branding details',
    });

    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWorkingHours = async (req: AuthRequest, res: Response) => {
  try {
    const hours = await WorkingHours.find().sort({ createdAt: 1 });
    res.json({ success: true, data: hours });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWorkingHours = async (req: AuthRequest, res: Response) => {
  try {
    const { hours } = req.body; // array of working hour objects
    if (!Array.isArray(hours)) {
      return res.status(400).json({ success: false, message: 'Invalid payload, expected array' });
    }

    for (const item of hours) {
      await WorkingHours.findOneAndUpdate({ day: item.day }, item, { upsert: true, new: true });
    }

    await AuditLog.create({
      admin: req.user?._id,
      adminEmail: req.user?.email || '',
      action: 'UPDATE_WORKING_HOURS',
      entity: 'WorkingHours',
      details: 'Updated weekly operating hours & break times',
    });

    res.json({ success: true, message: 'Working hours updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHolidays = async (req: AuthRequest, res: Response) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json({ success: true, data: holidays });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHoliday = async (req: AuthRequest, res: Response) => {
  try {
    const { date, title, isFullDay, notes } = req.body;
    if (!date || !title) {
      return res.status(400).json({ success: false, message: 'Date and title are required' });
    }

    const holiday = await Holiday.create({ date, title, isFullDay: isFullDay ?? true, notes: notes || '' });

    await AuditLog.create({
      admin: req.user?._id,
      adminEmail: req.user?.email || '',
      action: 'CREATE_HOLIDAY',
      entity: 'Holiday',
      entityId: holiday._id.toString(),
      details: `Added holiday: ${title} on ${date}`,
    });

    res.status(201).json({ success: true, data: holiday });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHoliday = async (req: AuthRequest, res: Response) => {
  try {
    await Holiday.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Holiday deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
