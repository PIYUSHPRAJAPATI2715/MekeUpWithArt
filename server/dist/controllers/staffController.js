"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStaff = exports.updateStaff = exports.createStaff = exports.getAllStaffAdmin = exports.getStaffMembers = void 0;
const Staff_1 = require("../models/Staff");
const getStaffMembers = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        const staff = await Staff_1.Staff.find({ status: 'Active' });
        res.json({ success: true, data: staff });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getStaffMembers = getStaffMembers;
const getAllStaffAdmin = async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        const staff = await Staff_1.Staff.find();
        res.json({ success: true, data: staff });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllStaffAdmin = getAllStaffAdmin;
const createStaff = async (req, res) => {
    try {
        const staff = await Staff_1.Staff.create(req.body);
        res.status(201).json({ success: true, data: staff });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createStaff = createStaff;
const updateStaff = async (req, res) => {
    try {
        const staff = await Staff_1.Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!staff)
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        res.json({ success: true, data: staff });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateStaff = updateStaff;
const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff_1.Staff.findByIdAndDelete(req.params.id);
        if (!staff)
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        res.json({ success: true, message: 'Staff member deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteStaff = deleteStaff;
