import { Response } from 'express';
import { generateAIImage } from '../services/aiImageService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const handleGenerateAIImage = async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, category } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Image description prompt is required' });
    }

    const result = await generateAIImage(prompt, category || 'Hair');
    res.json({
      success: true,
      imageUrl: result.imageUrl,
      status: result.status,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
