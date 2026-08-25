import { Request, Response } from 'express';
import { Package } from '../models/Package';
import { slugify } from '../utils/slugify';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getPackages = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const query: any = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'Active';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const packages = await Package.find(query)
      .populate('servicesIncluded', 'name category price duration')
      .sort({ sortOrder: 1, createdAt: -1 });

    res.json({ success: true, data: packages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPackageBySlug = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug }).populate('servicesIncluded');
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, data: pkg });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPackage = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, servicesIncluded, originalPrice, discountPrice, duration, validityDays, benefits, image, status, featured } = req.body;

    if (!name || !description || !originalPrice || !discountPrice) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    let slug = slugify(name);
    const existing = await Package.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const pkg = await Package.create({
      name,
      slug,
      description,
      servicesIncluded: servicesIncluded || [],
      originalPrice,
      discountPrice,
      duration: duration || 60,
      validityDays: validityDays || 30,
      benefits: benefits || [],
      image: image || '',
      status: status || 'Active',
      featured: featured || false,
    });

    res.status(201).json({ success: true, data: pkg });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePackage = async (req: AuthRequest, res: Response) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    if (req.body.name && req.body.name !== pkg.name) {
      req.body.slug = slugify(req.body.name);
    }

    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePackage = async (req: AuthRequest, res: Response) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
