import { Request, Response } from 'express';
import { Staff } from '../models/Staff';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getStaffMembers = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.find({ isActive: true }).populate('servicesHandled', 'name category');
    res.json({ success: true, data: staff });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllStaffAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.find().populate('servicesHandled', 'name category');
    res.json({ success: true, data: staff });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createStaff = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json({ success: true, data: staff });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStaff = async (req: AuthRequest, res: Response) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!staff) return res.status(404).json({ success: false, message: 'Staff member not found' });
    res.json({ success: true, data: staff });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStaff = async (req: AuthRequest, res: Response) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Staff member removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
