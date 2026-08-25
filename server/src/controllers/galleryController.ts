import { Request, Response } from 'express';
import { Gallery } from '../models/Gallery';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getGallery = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const query: any = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const items = await Gallery.find(query).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, imageUrl, isFeatured } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Title and imageUrl are required' });
    }

    const item = await Gallery.create({ title, category: category || 'Salon', imageUrl, isFeatured: isFeatured || false });
    res.status(201).json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGalleryItem = async (req: AuthRequest, res: Response) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
