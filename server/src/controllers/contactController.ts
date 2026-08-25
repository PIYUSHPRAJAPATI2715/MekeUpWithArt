import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';
import { AuthRequest } from '../middlewares/authMiddleware';

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: 'All contact fields are required' });
    }

    const doc = await ContactMessage.create({ name, email, phone, message });
    res.status(201).json({ success: true, message: 'Your message has been sent to MAKEUP WITH ART.', data: doc });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContactMessagesAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markContactMessageRead = async (req: AuthRequest, res: Response) => {
  try {
    const doc = await ContactMessage.findByIdAndUpdate(req.params.id, { status: 'Read' }, { new: true });
    res.json({ success: true, data: doc });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
