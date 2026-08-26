"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.getServiceBySlug = exports.getServices = void 0;
const Service_1 = require("../models/Service");
const slugify_1 = require("../utils/slugify");
const seed_1 = require("../utils/seed");
const getServices = async (req, res) => {
    try {
        const serviceCount = await Service_1.Service.countDocuments();
        if (serviceCount === 0) {
            console.log('[Services] Empty database detected. Auto-seeding catalog...');
            try {
                await (0, seed_1.seedDatabaseData)();
            }
            catch (seedErr) {
                console.error('[Services Seed Error]:', seedErr.message);
            }
        }
        const { category, search, sort, status, page = 1, limit = 50 } = req.query;
        const query = {};
        // Ignore status filter if status === 'All'
        if (status && status !== 'All') {
            query.status = status;
        }
        else if (!status) {
            query.status = 'Active';
        }
        if (category && category !== 'All') {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { shortDescription: { $regex: search, $options: 'i' } },
            ];
        }
        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc')
            sortOption = { price: 1 };
        if (sort === 'price_desc')
            sortOption = { price: -1 };
        if (sort === 'popular')
            sortOption = { isFeatured: -1, price: -1 };
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;
        const services = await Service_1.Service.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);
        const total = await Service_1.Service.countDocuments(query);
        res.json({
            success: true,
            count: services.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: services,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getServices = getServices;
const getServiceBySlug = async (req, res) => {
    try {
        const service = await Service_1.Service.findOne({ slug: req.params.slug });
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.json({ success: true, data: service });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getServiceBySlug = getServiceBySlug;
const createService = async (req, res) => {
    try {
        const { name, category, description, duration, price, discountPrice, images, variants, isFeatured, status } = req.body;
        if (!name || !category || !description || !duration || !price) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }
        const slug = (0, slugify_1.slugify)(name);
        const service = await Service_1.Service.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createService = createService;
const updateService = async (req, res) => {
    try {
        const service = await Service_1.Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        if (req.body.name)
            req.body.slug = (0, slugify_1.slugify)(req.body.name);
        const updatedService = await Service_1.Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.json({ success: true, data: updatedService });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateService = updateService;
const deleteService = async (req, res) => {
    try {
        const service = await Service_1.Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        await service.deleteOne();
        res.json({ success: true, message: 'Service deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteService = deleteService;
