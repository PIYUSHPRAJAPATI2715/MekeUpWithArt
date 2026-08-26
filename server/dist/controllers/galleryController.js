"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGalleryItem = exports.createGalleryItem = exports.getGallery = void 0;
const Gallery_1 = require("../models/Gallery");
const getGallery = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        const { category } = req.query;
        const query = {};
        if (category && category !== 'All') {
            query.category = category;
        }
        const items = await Gallery_1.Gallery.find(query).sort({ sortOrder: 1, createdAt: -1 });
        res.json({ success: true, data: items });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getGallery = getGallery;
const createGalleryItem = async (req, res) => {
    try {
        const { title, category, imageUrl, isFeatured } = req.body;
        if (!title || !imageUrl) {
            return res.status(400).json({ success: false, message: 'Title and imageUrl are required' });
        }
        const item = await Gallery_1.Gallery.create({ title, category: category || 'Salon', imageUrl, isFeatured: isFeatured || false });
        res.status(201).json({ success: true, data: item });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createGalleryItem = createGalleryItem;
const deleteGalleryItem = async (req, res) => {
    try {
        const item = await Gallery_1.Gallery.findByIdAndDelete(req.params.id);
        if (!item)
            return res.status(404).json({ success: false, message: 'Gallery item not found' });
        res.json({ success: true, message: 'Gallery item deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteGalleryItem = deleteGalleryItem;
