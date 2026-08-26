"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.toggleTestimonialStatus = exports.createTestimonial = exports.getAllTestimonialsAdmin = exports.getTestimonials = void 0;
const Testimonial_1 = require("../models/Testimonial");
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial_1.Testimonial.find({ status: 'Approved' }).sort({ createdAt: -1 });
        res.json({ success: true, data: testimonials });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTestimonials = getTestimonials;
const getAllTestimonialsAdmin = async (req, res) => {
    try {
        const list = await Testimonial_1.Testimonial.find().sort({ createdAt: -1 });
        res.json({ success: true, data: list });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllTestimonialsAdmin = getAllTestimonialsAdmin;
const createTestimonial = async (req, res) => {
    try {
        const { customerName, rating, review, photo } = req.body;
        if (!customerName || !rating || !review) {
            return res.status(400).json({ success: false, message: 'Name, rating, and review are required' });
        }
        const item = await Testimonial_1.Testimonial.create({ customerName, rating, review, photo: photo || '', status: 'Approved' });
        res.status(201).json({ success: true, data: item });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createTestimonial = createTestimonial;
const toggleTestimonialStatus = async (req, res) => {
    try {
        const item = await Testimonial_1.Testimonial.findById(req.params.id);
        if (!item)
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        item.status = item.status === 'Approved' ? 'Pending' : 'Approved';
        await item.save();
        res.json({ success: true, data: item });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.toggleTestimonialStatus = toggleTestimonialStatus;
const deleteTestimonial = async (req, res) => {
    try {
        await Testimonial_1.Testimonial.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Testimonial deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteTestimonial = deleteTestimonial;
