"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePackage = exports.updatePackage = exports.createPackage = exports.getPackageBySlug = exports.getPackages = void 0;
const Package_1 = require("../models/Package");
const slugify_1 = require("../utils/slugify");
const seed_1 = require("../utils/seed");
const getPackages = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        const packageCount = await Package_1.Package.countDocuments();
        if (packageCount === 0) {
            console.log('[Packages] Empty packages catalog. Auto-seeding catalog...');
            await (0, seed_1.seedDatabaseData)();
        }
        const { status, search } = req.query;
        const query = {};
        if (status && status !== 'All') {
            query.status = status;
        }
        else if (!status) {
            query.status = 'Active';
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const packages = await Package_1.Package.find(query)
            .populate('servicesIncluded', 'name category price duration')
            .sort({ isPopular: -1, createdAt: -1 });
        res.json({ success: true, data: packages });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPackages = getPackages;
const getPackageBySlug = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        const pkg = await Package_1.Package.findOne({ slug: req.params.slug }).populate('servicesIncluded');
        if (!pkg) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }
        res.json({ success: true, data: pkg });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPackageBySlug = getPackageBySlug;
const createPackage = async (req, res) => {
    try {
        const { name, description, servicesIncluded, originalPrice, discountPrice, duration, validityDays, image, isPopular, status } = req.body;
        if (!name || !description || !originalPrice || !discountPrice) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }
        const slug = (0, slugify_1.slugify)(name);
        const pkg = await Package_1.Package.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createPackage = createPackage;
const updatePackage = async (req, res) => {
    try {
        const pkg = await Package_1.Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }
        if (req.body.name)
            req.body.slug = (0, slugify_1.slugify)(req.body.name);
        const updatedPackage = await Package_1.Package.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.json({ success: true, data: updatedPackage });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updatePackage = updatePackage;
const deletePackage = async (req, res) => {
    try {
        const pkg = await Package_1.Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }
        await pkg.deleteOne();
        res.json({ success: true, message: 'Package deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deletePackage = deletePackage;
