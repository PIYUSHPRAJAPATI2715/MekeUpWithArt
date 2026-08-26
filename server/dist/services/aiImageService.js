"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAIImage = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const generateAIImage = async (prompt, category = 'Hair') => {
    const enhancedPrompt = `${prompt}, premium unisex salon photography, professional beauty photography, Indian style and customers, luxury salon interior background, high-end editorial lighting, 8k resolution, realistic photography, no text, no watermark`;
    if (env_1.config.OPENAI_API_KEY) {
        try {
            const response = await axios_1.default.post('https://api.openai.com/v1/images/generations', {
                model: 'dall-e-3',
                prompt: enhancedPrompt,
                n: 1,
                size: '1024x1024',
                quality: 'standard',
            }, {
                headers: {
                    Authorization: `Bearer ${env_1.config.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            const imageUrl = response.data.data[0].url;
            return {
                imageUrl,
                status: 'Generated via DALL-E 3',
            };
        }
        catch (error) {
            console.error('[AI Image Service Error]:', error?.response?.data || error.message);
        }
    }
    // Curated HD luxury photography fallback mapping per salon category when API Key is not set
    const fallbackImages = {
        Hair: [
            'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
        ],
        Skin: [
            'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1512290900673-03080e77402a?auto=format&fit=crop&w=1200&q=80',
        ],
        Makeup: [
            'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=80',
        ],
        Nails: [
            'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
        ],
        Eyelash: [
            'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=1200&q=80',
        ],
        Bridal: [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80',
        ],
        Salon: [
            'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1200&q=80',
        ]
    };
    const list = fallbackImages[category] || fallbackImages.Hair;
    const selected = list[Math.floor(Math.random() * list.length)];
    return {
        imageUrl: selected,
        status: 'AI Image integration fallback: OPENAI_API_KEY missing in server .env. Returned luxury salon visual.',
    };
};
exports.generateAIImage = generateAIImage;
