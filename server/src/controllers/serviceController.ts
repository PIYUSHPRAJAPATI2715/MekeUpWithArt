import { Request, Response } from 'express';
import { Service } from '../models/Service';
import { slugify } from '../utils/slugify';
import { AuthRequest } from '../middlewares/authMiddleware';
import { seedDatabaseData } from '../utils/seed';

export const getServices = async (req: Request, res: Response) => {
  try {
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('[Services] Empty database detected. Auto-seeding catalog...');
      try {
        await seedDatabaseData();
      } catch (seedErr: any) {
        console.error('[Services Seed Error]:', seedErr.message);
      }
    }

    const { category, search, sort, status, page = 1, limit = 50 } = req.query;

    const query: any = {};
    
    // Ignore status filter if status === 'All'
    if (status && status !== 'All') {
      query.status = status;
    } else if (!status) {
      query.status = 'Active';
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { shortDescription: { $regex: search as string, $options: 'i' } },
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'popular') sortOption = { isFeatured: -1, price: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const services = await Service.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      count: services.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: services,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, description, duration, price, discountPrice, images, variants, isFeatured, status } = req.body;

    if (!name || !category || !description || !duration || !price) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const slug = slugify(name);

    const service = await Service.create({
      name,
      slug,
      category,
      description,
      duration,
      price,
      discountPrice,
      images: images || [],
      variants: variants || [],
      isFeatured: isFeatured || false,
      status: status || 'Active',
    });

    res.status(201).json({ success: true, data: service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req: AuthRequest, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (req.body.name) req.body.slug = slugify(req.body.name);

    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updatedService });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await service.deleteOne();
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
