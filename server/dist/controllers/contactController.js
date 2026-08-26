"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markContactMessageRead = exports.getContactMessagesAdmin = exports.submitContactForm = void 0;
const ContactMessage_1 = require("../models/ContactMessage");
const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ success: false, message: 'All contact fields are required' });
        }
        const doc = await ContactMessage_1.ContactMessage.create({ name, email, phone, message });
        res.status(201).json({ success: true, message: 'Your message has been sent to MAKEUP WITH ART.', data: doc });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.submitContactForm = submitContactForm;
const getContactMessagesAdmin = async (req, res) => {
    try {
        const messages = await ContactMessage_1.ContactMessage.find().sort({ createdAt: -1 });
        res.json({ success: true, data: messages });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getContactMessagesAdmin = getContactMessagesAdmin;
const markContactMessageRead = async (req, res) => {
    try {
        const doc = await ContactMessage_1.ContactMessage.findByIdAndUpdate(req.params.id, { status: 'Read' }, { new: true });
        res.json({ success: true, data: doc });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.markContactMessageRead = markContactMessageRead;
