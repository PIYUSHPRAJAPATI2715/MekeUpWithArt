"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGenerateAIImage = void 0;
const aiImageService_1 = require("../services/aiImageService");
const handleGenerateAIImage = async (req, res) => {
    try {
        const { prompt, category } = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Image description prompt is required' });
        }
        const result = await (0, aiImageService_1.generateAIImage)(prompt, category || 'Hair');
        res.json({
            success: true,
            imageUrl: result.imageUrl,
            status: result.status,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.handleGenerateAIImage = handleGenerateAIImage;
