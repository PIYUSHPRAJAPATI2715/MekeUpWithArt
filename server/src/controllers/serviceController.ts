import { Request, Response } from 'express';
import { Service } from '../models/Service';
import { slugify } from '../utils/slugify';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, search, sort, status, page = 1, limit = 50 } = req.query;

    const query: any = {};
    
    // Non-admin default to Active only
    if (status) {
      query.status = status;
    } else {
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

    let sortOption: any = { sortOrder: 1, createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { featured: -1, createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const services = await Service.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      data: services,
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

export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Get related services in same category
    const related = await Service.find({
      category: service.category,
      _id: { $ne: service._id },
      status: 'Active',
    }).limit(4);

    res.json({
      success: true,
      data: service,
      related,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, description, shortDescription, price, discountPrice, duration, benefits, images, variants, status, featured } = req.body;

    if (!name || !category || !description || !shortDescription || price === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required service fields' });
    }

    let slug = slugify(name);
    const existing = await Service.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const service = await Service.create({
      name,
      slug,
      category,
      description,
      shortDescription,
      price,
      discountPrice,
      duration: duration || 30,
      benefits: benefits || [],
      images: images || [],
      variants: variants || [],
      status: status || 'Active',
      featured: featured || false,
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

    if (req.body.name && req.body.name !== service.name) {
      req.body.slug = slugify(req.body.name);
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
