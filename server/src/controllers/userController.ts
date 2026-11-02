import { Response } from 'express';
import { User } from '../models/User';
import { Booking } from '../models/Booking';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AuditLog } from '../models/AuditLog';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { search, role, page = 1, limit = 50 } = req.query;
    const query: any = {};

    if (role && role !== 'All') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
        { phone: { $regex: search as string, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
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

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const bookings = await Booking.find({ customer: user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        user,
        totalBookings: bookings.length,
        bookings,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Super Admin status cannot be altered' });
    }

    user.isActive = !user.isActive;
    await user.save();

    await AuditLog.create({
      admin: req.user?._id,
      adminEmail: req.user?.email || '',
      action: user.isActive ? 'ENABLE_USER' : 'DISABLE_USER',
      entity: 'User',
      entityId: user._id.toString(),
      details: `Account ${user.isActive ? 'enabled' : 'disabled'} for ${user.email}`,
    });

    res.json({
      success: true,
      message: `User account ${user.isActive ? 'enabled' : 'disabled'} successfully`,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUserByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, email, password, role = 'CUSTOMER' } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Customer Name and Phone number are required' });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const userEmail = email ? email.toLowerCase().trim() : `client_${cleanPhone}@makeupwithart.local`;

    const existingUser = await User.findOne({
      $or: [{ phone: cleanPhone }, { phone }, { email: userEmail }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `Customer already registered with this phone or email (${existingUser.name})`,
        data: existingUser,
      });
    }

    const userPassword = password || 'Customer@123';

    const user = await User.create({
      name: name.trim(),
      phone: cleanPhone,
      email: userEmail,
      password: userPassword,
      role: role || 'CUSTOMER',
      isActive: true,
      avatar: '/logo.png',
    });

    await AuditLog.create({
      admin: req.user?._id,
      adminEmail: req.user?.email || '',
      action: 'CREATE_USER',
      entity: 'User',
      entityId: user._id.toString(),
      details: `Admin created customer profile for ${name} (${cleanPhone})`,
    });

    res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer account not found' });
    }

    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Super Admin account cannot be deleted' });
    }

    if (req.user && req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own logged-in admin account' });
    }

    await User.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      admin: req.user?._id,
      adminEmail: req.user?.email || '',
      action: 'DELETE_USER',
      entity: 'User',
      entityId: user._id.toString(),
      details: `Admin deleted customer profile for ${user.name} (${user.email || user.phone})`,
    });

    res.json({
      success: true,
      message: `Customer ${user.name} deleted successfully`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

