import { Request, Response } from 'express';
import { User } from '../models/User';
import { Service } from '../models/Service';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middlewares/authMiddleware';
import { seedDatabaseData } from '../utils/seed';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Auto-grant SUPER_ADMIN for admin/owner email handles
    const isOwnerEmail = email.toLowerCase().includes('admin') || email.toLowerCase().includes('owner') || email.toLowerCase() === 'makeupwitharto@gmail.com';
    const role = isOwnerEmail ? 'SUPER_ADMIN' : 'CUSTOMER';

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
    });

    // Auto-seed demo services/packages if database has no services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('[Register] Empty services detected. Auto-seeding catalog...');
      await seedDatabaseData();
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let user: any = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact administration.' });
    }

    // Auto-promote admin/owner email handles to SUPER_ADMIN
    const isOwnerEmail = user.email.toLowerCase().includes('admin') || user.email.toLowerCase().includes('owner') || user.email.toLowerCase() === 'makeupwitharto@gmail.com';
    if (isOwnerEmail && user.role !== 'SUPER_ADMIN') {
      user.role = 'SUPER_ADMIN';
      await user.save();
    }

    // Auto-seed catalog if empty
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('[Login] Empty services detected. Auto-seeding catalog...');
      await seedDatabaseData();
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
