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
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
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

export const getSettingsPublic = async (req: any, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = await BusinessSettings.create({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = await BusinessSettings.create({
        businessName: 'MAKEUP WITH ART',
        phoneNumbers: ['9352769045', '7575939735'],
        email: 'makeupwitharto@gmail.com',
        address: 'Pillar No. 113, Shyam Nagar Metro Station, Jaipur',
        instagram: 'makeup.with.art',
      });
    }
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
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

export const getBusinessSettings = getSettings;
export const updateBusinessSettings = updateSettings;

export const getWorkingHours = async (req: AuthRequest, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    let hours = await WorkingHours.find();
    if (hours.length === 0) {
      console.log('[WorkingHours] Empty catalog detected. Auto-seeding 7 default days 10:30 to 21:30...');
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      for (const day of days) {
        await WorkingHours.create({
          day,
          isOpen: true,
          openTime: '10:30',
          closeTime: '21:30',
          breakStart: '14:00',
          breakEnd: '14:30',
          slotIntervalMinutes: 30,
        });
      }
      hours = await WorkingHours.find();
    }
    res.json({ success: true, data: hours });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWorkingHours = async (req: AuthRequest, res: Response) => {
  try {
    const { hours } = req.body;
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
      details: 'Updated salon weekly operating hours or break times',
    });

    const updatedHours = await WorkingHours.find();
    res.json({ success: true, data: updatedHours });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHolidays = async (req: AuthRequest, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json({ success: true, data: holidays });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHoliday = async (req: AuthRequest, res: Response) => {
  try {
    const { date, title, isFullDay, customOpenTime, customCloseTime } = req.body;
    if (!date || !title) {
      return res.status(400).json({ success: false, message: 'Date and title are required' });
    }

    const holiday = await Holiday.create({ date, title, isFullDay: isFullDay !== false, customOpenTime, customCloseTime });

    await AuditLog.create({
      admin: req.user?._id,
      adminEmail: req.user?.email || '',
      action: 'CREATE_HOLIDAY',
      entity: 'Holiday',
      details: `Added holiday block for ${date} (${title})`,
    });

    res.status(201).json({ success: true, data: holiday });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHoliday = async (req: AuthRequest, res: Response) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) return res.status(404).json({ success: false, message: 'Holiday not found' });

    await AuditLog.create({
      admin: req.user?._id,
      adminEmail: req.user?.email || '',
      action: 'DELETE_HOLIDAY',
      entity: 'Holiday',
      details: `Removed holiday block for date ${holiday.date}`,
    });

    res.json({ success: true, message: 'Holiday removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
