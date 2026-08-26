import { Request, Response } from 'express';
import { Testimonial } from '../models/Testimonial';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const testimonials = await Testimonial.find({ status: 'Approved' }).sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTestimonialsAdmin = async (req: AuthRequest, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const list = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { customerName, rating, review, photo } = req.body;
    if (!customerName || !rating || !review) {
      return res.status(400).json({ success: false, message: 'Name, rating, and review are required' });
    }

    const item = await Testimonial.create({ customerName, rating, review, photo: photo || '', status: 'Approved' });
    res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleTestimonialStatus = async (req: AuthRequest, res: Response) => {
  try {
    const item = await Testimonial.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' });

    item.status = item.status === 'Approved' ? 'Pending' : 'Approved';
    await item.save();

    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTestimonial = async (req: AuthRequest, res: Response) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
