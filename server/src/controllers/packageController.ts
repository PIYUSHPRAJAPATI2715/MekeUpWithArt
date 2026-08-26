import { Request, Response } from 'express';
import { Package } from '../models/Package';
import { slugify } from '../utils/slugify';
import { AuthRequest } from '../middlewares/authMiddleware';
import { seedDatabaseData } from '../utils/seed';

export const getPackages = async (req: Request, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    const packageCount = await Package.countDocuments();
    if (packageCount === 0) {
      console.log('[Packages] Empty packages catalog. Auto-seeding catalog...');
      await seedDatabaseData();
    }

    const { status, search } = req.query;
    const query: any = {};

    if (status && status !== 'All') {
      query.status = status;
    } else if (!status) {
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
      .sort({ isPopular: -1, createdAt: -1 });

    res.json({ success: true, data: packages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPackageBySlug = async (req: Request, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
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
    const { name, description, servicesIncluded, originalPrice, discountPrice, duration, validityDays, image, isPopular, status } = req.body;

    if (!name || !description || !originalPrice || !discountPrice) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const slug = slugify(name);

    const pkg = await Package.create({
      name,
      slug,
      description,
      servicesIncluded: servicesIncluded || [],
      originalPrice,
      discountPrice,
      duration: duration || 120,
      validityDays: validityDays || 30,
      images: image ? [image] : [],
      isPopular: isPopular || false,
      status: status || 'Active',
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

    if (req.body.name) req.body.slug = slugify(req.body.name);

    const updatedPackage = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedPackage });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePackage = async (req: AuthRequest, res: Response) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    await pkg.deleteOne();
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
